import eventsource from 'eventsource';
import { Server } from "socket.io";
import { io } from "socket.io-client";
import { pb } from './database';

global.EventSource = eventsource;

function forwardEvent(socket, name) {
    socket.on(name, data => {
        console.log(`sending ${name}`);
        socket.to(data.log_id).emit(name, data);
    });
}

export function initWsServer(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', socket => {
        const hs = socket.handshake;

        if (hs.auth.callsign) {
            socket.data.db = false;
            socket.data.callsign = hs.auth.callsign;

            io.to(hs.query.log).emit('join', socket.data.callsign);
            socket.join(hs.query.log);

            socket.on('disconnect', () => {
                console.log(`${socket.data.callsign} disconnected`);
                socket.rooms.forEach(room => io.to(room).emit('part', socket.data.callsign));
            });

            console.log(`${socket.data.callsign} joined ${hs.query.log}`);
        } else if (hs.auth.db && ['::1', '127.0.0.1'].includes(hs.address)) {
            io.fetchSockets().then(sockets => {
                sockets.filter(s => s.data.db && s.id !== socket.id).forEach(s => {
                    console.log('disconnecting duplicate database listener socket');
                    s.disconnect();
                });
            });

            socket.data.db = true;

            forwardEvent(socket, 'create-contact');
            forwardEvent(socket, 'update-contact');
            forwardEvent(socket, 'delete-contact');
        } else {
            socket.disconnect();
            console.log('rejected socket for bad auth');
        }
    });

    return io;
}

export function initDbListener(address, port) {
    const ws = io(`ws://${address}:${port}/`, { auth: { db: true } });

    ws.on('connect', () => {
        console.log('database listener socket connected');
    });

    const unsub = pb.collection('contacts').subscribe('*', e => {
        ws.emit(`${e.action}-contact`, e.record);
    });

    ws.on('disconnect', reason => {
        console.log(`database listener socket disconnected: ${reason}`);
        unsub.catch(() => {});
    });
}
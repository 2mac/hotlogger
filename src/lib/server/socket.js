import eventsource from 'eventsource';
import { Server } from "socket.io";
import { io } from "socket.io-client";
import { pb } from './database.js';

global.EventSource = eventsource;

function forwardEvent(socket, name) {
    socket.on(name, data => {
        console.log(`sending ${name}`);
        socket.to(data.log_id).emit(name, data);
    });
}

function roomData(socket) {
    return {
        id: socket.id,
        data: socket.data
    };
}

export function initWsServer(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', socket => {
        const hs = socket.handshake;

        if (hs.auth.callsign) {
            socket.data.db = false;
            socket.data.callsign = hs.auth.callsign;
            socket.data.band = hs.query.band;
            socket.data.mode = hs.query.mode;

            io.to(hs.query.log).emit('join', roomData(socket));
            socket.join(hs.query.log);

            socket.on('disconnect', () => {
                console.log(`${socket.data.callsign} disconnected`);
                io.to(hs.query.log).emit('part', socket.id);
            });

            socket.on('who', async (arg, callback) => {
                const sockets = await io.in(hs.query.log).fetchSockets();
                callback(sockets.map(roomData));
            });

            socket.on('change-band', arg => {
                socket.data.band = arg;
                io.to(hs.query.log).emit('update', roomData(socket));
            });

            socket.on('change-mode', arg => {
                socket.data.mode = arg;
                io.to(hs.query.log).emit('update', roomData(socket));
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
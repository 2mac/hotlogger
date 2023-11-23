import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function getLogs(callsign) {
    return await pb.collection('logbooks').getFullList({
        filter: pb.filter('owner = {:callsign}', { callsign: callsign.toUpperCase() }),
        sort: '-updated',
        requestKey: 'all' + callsign
    });
}

export async function getSharedLogs(callsign) {
    return await pb.collection('logbooks').getFullList({
        filter: pb.filter('owner != {:callsign} && shared = true', { callsign: callsign.toUpperCase() }),
        sort: '-updated',
        requestKey: 'shared' + callsign
    });
}

export async function getLog(id) {
    return await pb.collection('logbooks').getFirstListItem(pb.filter('id = {:id}', { id: id }));
}

export async function createLog(owner, callsign, name, type, shared) {
    return await pb.collection('logbooks').create({
        owner: owner.toUpperCase(),
        callsign: callsign.toUpperCase(),
        name: name,
        type: type,
        shared: shared
    });
}

export async function getContacts(logId) {
    return await pb.collection('contacts').getFullList({
        filter: pb.filter('log_id = {:logId}', { logId: logId }),
        sort: '-time,-created',
        requestKey: null
    });
}

export async function addContact(data) {
    data['time'] = new Date();
    data.other_call = data.other_call.toUpperCase();
    
    return await pb.collection('contacts').create(data);
}
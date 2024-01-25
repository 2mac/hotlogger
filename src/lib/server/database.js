import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

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

export async function touchLog(log) {
    pb.collection('logbooks').update(log.id, log);
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

export async function updateLog(id, data) {
    return await pb.collection('logbooks').update(id, data);
}

export async function deleteLog(id) {
    getContacts(id).then(contacts => contacts.forEach(c => pb.collection('contacts').delete(c.id)));
    
    return await pb.collection('logbooks').delete(id);
}

export async function getContacts(logId) {
    return await pb.collection('contacts').getFullList({
        filter: pb.filter('log_id = {:logId}', { logId: logId }),
        sort: '-time,-created',
        requestKey: null,
        batch: 10000
    });
}

function sanitizeContact(data) {
    data.other_call = data.other_call.toUpperCase();

    if (data.custom) {
        const c = data.custom;

        c.arrl_section = c.arrl_section?.toUpperCase();
        c.class = c.class?.toUpperCase();
    }

    return data;
}

export async function addContact(data) {
    data['time'] = new Date();
    data = sanitizeContact(data);
    
    return await pb.collection('contacts').create(data);
}

export async function updateContact(id, data) {
    data = sanitizeContact(data);

    return await pb.collection('contacts').update(id, data);
}

export async function deleteContact(id) {
    return await pb.collection('contacts').delete(id);
}
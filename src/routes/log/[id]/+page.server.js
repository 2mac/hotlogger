import { addContact, getContacts, getLog, updateContact } from '$lib/server/database.js';

export async function load({ cookies, params }) {
    const results = await Promise.all([
        getLog(params.id),
        getContacts(params.id)
    ]);

    return {
        log: results[0],
        contacts: results[1],
        freq_khz: cookies.get('freq_khz'),
        mode: cookies.get('mode')
    };
}

export const actions = {
    add: async ({ cookies, params, request }) => {
        const myCall = cookies.get('callsign');
        if (!myCall)
            throw redirect(303, '/');

        const formData = await request.formData();
        const data = {
            op_call: myCall,
            log_id: params.id
        };
        
        formData.forEach((v, k) => data[k] = v);
        const contact = await addContact(data);

        cookies.set('freq_khz', data.freq_khz);
        cookies.set('mode', data.mode);

        return {
            success: true,
            contact: contact
        };
    },

    edit: async ({ params, request }) => {
        const formData = await request.formData();
        const data = {};
        
        formData.forEach((v, k) => data[k] = v);
        const date = data.date;
        const time = data.time.replace(':', '');

        data.time = new Date(Date.UTC(
            date.slice(0,4),
            date.slice(5,7) - 1,
            date.slice(8,10),
            time.slice(0,2),
            time.slice(2,4)
        ));

        delete data.date;
        const contact = await updateContact(data.id, data);

        return {
            success: true,
            contact: contact
        };
    }
};
import { logTypes } from '$lib/logtype.js';
import { addContact, deleteContact, getContacts, getLog, touchLog, updateContact } from '$lib/server/database.js';
import { formDataToObject } from '$lib/server/form.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, params }) {
    const log = await getLog(params.id);

    const callsign = cookies.get('callsign');
    if (log.owner === callsign) {
        const logType = logTypes.find(t => t.id === log.type);
        const reqField = logType.customFields?.find(f => f.required === true && !log.custom?.[f.key]);
        if (reqField)
            throw redirect(303, `/log/${params.id}/settings`);
    }

    const contacts = await getContacts(params.id);
    touchLog(log);

    return {
        callsign: callsign,
        log: log,
        contacts: contacts,
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
        
        const data = formDataToObject(formData);
        data.op_call = myCall;
        data.log_id = params.id;
        
        const contact = await addContact(data);

        cookies.set('freq_khz', data.freq_khz, { path: '/', secure: false });
        cookies.set('mode', data.mode, { path: '/', secure: false });

        return {
            success: true,
            contact: contact
        };
    },

    edit: async ({ params, request }) => {
        const formData = await request.formData();
        const data = formDataToObject(formData);
        
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
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        await deleteContact(id);

        return { success: true };
    },

    changeCall: async ({ cookies, request }) => {
        const data = await request.formData();
        cookies.set('callsign', data.get('callsign').toUpperCase(), { path: '/' });

        return { success: true };
    }
};

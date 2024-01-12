import { logTypes } from '$lib/logtype.js';
import { deleteLog, getLog, updateLog } from '$lib/server/database.js';
import { formDataToObject } from '$lib/server/form.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
    const log = await getLog(params.id);

    return {
        log: log
    };
}

export const actions = {
    save: async ({ params, request }) => {
        const formData = await request.formData();
        const data = formDataToObject(formData);
        data.shared = formData.has('shared');

        const logType = logTypes.find(t => t.id == data.type);

        const booleans = logType.customFields?.filter(f => f.type === 'checkbox');
        booleans?.forEach(b => data.custom[b.key] = formData.has(`c:${b.key}`));

        await updateLog(params.id, data);

        redirect(303, `/log/${params.id}`);
    },

    delete: async ({ params }) => {
        await deleteLog(params.id);
        redirect(303, '/log');
    }
};
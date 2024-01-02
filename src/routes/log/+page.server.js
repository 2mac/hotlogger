import * as db from '$lib/server/database.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const callsign = cookies.get('callsign');
    if (!callsign)
        redirect(303, '/');

    const results = await Promise.all([
        db.getLogs(callsign),
        db.getSharedLogs(callsign)
    ]);

    return {
        myLogs: results[0],
        sharedLogs: results[1]
    };
}

export const actions = {
    create: async ({ cookies, request }) => {
        const callsign = cookies.get('callsign');
        if (!callsign)
            redirect(303, '/');
    
        const data = await request.formData();
        let log = await db.createLog(
            callsign, 
            data.get('callsign'), 
            data.get('name'), 
            data.get('type'), 
            data.get('shared')
        );
        
        redirect(303, `/log/${log.id}`);
    }
};
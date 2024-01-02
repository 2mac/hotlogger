import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const callsign = cookies.get('callsign');

    return {
        callsign: callsign
    };
}

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        cookies.set('callsign', data.get('callsign').toUpperCase(), { path: '/' });
        redirect(303, '/log');
    }
};
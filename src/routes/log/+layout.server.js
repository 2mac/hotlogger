
export function load({ cookies }) {
    
    return {
        callsign: cookies.get('callsign')
    }
}
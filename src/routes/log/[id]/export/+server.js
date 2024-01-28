
import { freqToBand } from '$lib/bands.js';
import { exportFormats, getContactData, logTypes } from '$lib/logtype.js';
import { getContacts, getLog } from '$lib/server/database.js';
import { error } from '@sveltejs/kit';
import dateFormat from 'dateformat';

const cabrilloBands = [50, 70, 144, 222, 432, 902, 1200, 2300, 3400, 5700, 10000].reverse();

const generators = {
    cabrillo: {
        extension: 'cabrillo',
        contentType: 'application/cabrillo',
        generate(header, qsos) {
            header = [
                'START-OF-LOG: 3.0', 
                ...[...header.entries()].map(([k, v]) => `${k}: ${v}`),
                'CREATED-BY: HotLogger - https://github.com/2mac/hotlogger',
                'SOAPBOX: '
            ];
            
            qsos = qsos.map(qso => {
                const date = dateFormat(qso.time, 'yyyy-mm-dd HHMM', true);
                let band = cabrilloBands.find(b => b * 1000 <= qso.freq_khz) || 0;
                band = band >= 1000 ? (band / 1000).toFixed(1).replace('.0', '') + 'G' : band;
                band = band === 0 ? qso.freq_khz : band;
                
                return `QSO: ${band} ${qso.mode} ${date} ${qso.exchange.sent} ${qso.exchange.received}`;
            });
            
            return [
                ...header,
                ...qsos,
                'END-OF-LOG: '
            ].join('\r\n');
        },
    },

    csv: {
        extension: 'csv',
        contentType: 'text/csv',
        generate(header, qsos) {
            return [
                header.join(','),
                ...qsos
            ].join('\r\n');
        }
    }
};

function prepareCsvExport(log, contacts) {
    const logType = logTypes.find(t => t.id === log.type);
    const qsos = [];

    contacts.forEach(contact => {
        qsos.push(logType.displayFields.map(field => getContactData(contact, field)).join(','));
    });
    
    return {
        header: exportFormats.csv.defaultHeader(log, contacts),
        qsos: qsos
    };
}

export async function GET({ params, url }) {
    const log = await getLog(params.id);
    const format = url.searchParams.get('format');
    const logType = logTypes.find(t => t.id === log.type);
    let availableFormats = ['csv'];
    if (logType.exports)
        availableFormats = [ ...availableFormats, ...Object.keys(logType.exports)];

    if (availableFormats.includes(format)) {
        const generator = generators[format];
        const contacts = (await getContacts(params.id)).reverse();
        const exporter = logType.exports?.[format] || prepareCsvExport;
        const { header, qsos } = exporter(log, contacts);
        
        return new Response(generator.generate(header, qsos), {
            headers: {
                'Content-Type': generator.contentType,
                'Content-Disposition': `attachment; filename="${log.name}.${generator.extension}"`
            }
        });
    }

    error(400, `${format} format is not available for ${logType.name} logs`);
}
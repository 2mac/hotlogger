import { contestBands, freqToBand } from "./bands";
import dateFormat from "dateformat";

const standardModes = [
    'SSB',
    'CW',
    'RTTY',
    'FT8'
];

export const exportFormats = {
    adif: {
        format: 'adif',
        name: 'ADIF',
        defaultHeader(log, contacts) {
            const logType = logTypes.find(t => t.id === log.type);
            const header = new Map();
            header.set('adif_ver', { value: '3.1.4' });
            header.set('created_timestamp', { value: dateFormat(new Date(), 'yyyymmdd HHMMss', true) });
            header.set('programid', { value: 'HotLogger' });

            return header;
        }
    },
    
    cabrillo: {
        format: 'cabrillo',
        name: 'Cabrillo 3.0',
        defaultHeader(log, contacts) {
            const logType = logTypes.find(t => t.id === log.type);
            const header = new Map();
            header.set('CALLSIGN', log.callsign);
            header.set('CATEGORY-ASSISTED', 'NON-ASSISTED');
            header.set('CATEGORY-BAND', 'ALL');
            header.set('CATEGORY-MODE', 'MIXED');
            header.set('NAME', log.custom?.poc || log.owner);
            header.set('EMAIL', log.custom?.email || '');

            if (log.custom?.arrl_section)
                header.set('LOCATION', log.custom.arrl_section);

            if (log.custom?.address) {
                const addr = log.custom.address;
                header.set('ADDRESS', addr.address);
                header.set('ADDRESS-CITY', addr.city);
                header.set('ADDRESS-STATE-PROVINCE', addr.state);
                header.set('ADDRESS-POSTALCODE', addr.zip);
                header.set('ADDRESS-COUNTRY', addr.country);
            }

            const operators = new Set();
            contacts.forEach(contact => operators.add(contact.op_call));
            header.set('OPERATORS', [...operators].sort().join(', '));
            header.set('CATEGORY-OPERATOR', operators.size > 1 ? 'MULTI-OP' : 'SINGLE-OP');

            if (logType.score)
                header.set('CLAIMED-SCORE', logType.score(log, contacts));

            return header;
        }
    },

    csv: {
        format: 'csv',
        name: 'CSV',
        defaultHeader(log, contacts) {
            const logType = logTypes.find(t => t.id === log.type);
            return logType.displayFields.map(field => contactFields[field].label);
        }
    }
};

export const contactFields = {
    band: {
        label: 'Band',
        data: contact => freqToBand(contact.freq_khz)
    },
    
    date: {
        label: 'Date',
        type: 'date',
        required: true,
        data: contact => dateFormat(contact.time, 'yyyy-mm-dd', true)
    },

    freq_khz: { label: 'Freq (kHz)' },
    memo: { label: 'Memo' },
    mode: { label: 'Mode' },
    name: { label: 'Name' },
    op_call: { label: 'Operator' },
    other_call: { label: 'Call', required: true },
    qth: { label: 'QTH' },
    rst_recd: { label: "RST Rec'd", pattern: '[1-5][0-9]{1,2}[A-Za-z]?' },
    rst_sent: { label: 'RST Sent', pattern: '[1-5][0-9]{1,2}[A-Za-z]?' },

    time: {
        label: 'Time',
        required: true,
        data: contact => dateFormat(contact.time, 'HHMM', true),
        pattern: '[0-9]{2}:?[0-9]{2}'
    },

    'c:arrl_section': {
        label: 'Section',
        required: true,
        data: contact => contact.custom.arrl_section
    },
    
    'c:class': {
        label: 'Class',
        required: true,
        data: contact => contact.custom.class
    },
    
    'c:pota_park': {
        label: 'Park 2 Park',
        data: contact => contact.custom.pota_park
    },
    
    'c:skcc_nr': {
        label: 'SKCC #',
        required: true,
        data: contact => contact.custom.skcc_nr,
        pattern: '[0-9]+[A-Za-z]?'
    }
};

Object.entries(contactFields).forEach(([k, v]) => {
    v.data = v.data || (contact => contact[k]);
    v.key = v.key || k;
    v.type = v.type || 'text';
});

export const logTypes = [
    {
        id: 0,
        name: 'Standard log',
        display: true,
        inputs: [
            'other_call', 'name', 'qth',
            'rst_sent', 'rst_recd',
            'freq_khz', 'mode',
            'memo'
        ],
        displayFields: [ 'freq_khz', 'mode', 'name', 'qth', 'rst_sent', 'rst_recd', 'memo' ],
        modes: standardModes
    },

    {
        id: 3,
        name: 'Parks on the Air',
        display: true,
        inputs: [ 'other_call', 'qth', 'rst_sent', 'rst_recd', 'c:pota_park', 'freq_khz', 'mode', 'memo' ],
        displayFields: [ 'freq_khz', 'mode', 'qth', 'rst_sent', 'rst_recd', 'c:pota_park', 'memo' ],
        modes: standardModes,

        customFields: [
            { key: 'pota_park', label: 'Park Reference', type: 'text', placeholder: 'K-1234', required: true }
        ],

        exports: {
            adif: (log, contacts) => {
                const header = exportFormats.adif.defaultHeader(log, contacts);
                const qsos = contacts.map(qso => {
                    qso.my_sig = 'POTA';
                    qso.my_sig_info = log.custom?.pota_park;
                    qso.sig = 'POTA';
                    qso.sig_info = qso.custom.pota_park;

                    return qso;
                });

                return { header, qsos };
            }
        }
    },

    {
        id: 1,
        name: 'Straight Key Century Club',
        display: true,
        inputs: [
            'other_call', 'name', 'qth',
            'rst_sent', 'rst_recd',
            'freq_khz', 'memo',
            'c:skcc_nr'
        ],
        displayFields: [ 'freq_khz', 'c:skcc_nr', 'name', 'qth', 'rst_sent', 'rst_recd', 'memo' ],
        modes: [ 'CW' ],
        restrictModes: true
    },

    {
        id: 2,
        name: 'Winter Field Day',
        display: true,
        inputs: [ 'other_call', 'c:class', 'c:arrl_section', 'freq_khz', 'mode' ],
        displayFields: [ 'c:class', 'c:arrl_section', 'band', 'mode' ],
        modes: [ 'PH', 'CW', 'DG' ],
        restrictModes: true,
        bands: contestBands,
        contest: true,
        autocomplete: true,
        preventDuplicates: true,

        customFields: [
            { key: 'qrp', label: 'QRP?', type: 'checkbox' },
            { key: 'class', label: 'Station Class', type: 'text', required: true },
            { key: 'arrl_section', label: 'Section', type: 'text', required: true },
            { key: 'poc', label: 'Primary Contact Name', type: 'text', required: true },
            { key: 'club', label: 'Club Name', type: 'text' },
            { key: 'address', label: 'Address', type: 'address', required: true },
            { key: 'email', label: 'Email', type: 'email' }
        ],

        score: (log, contacts) => {
            const pairs = new Set();
            contacts.forEach(({ freq_khz, mode }) => pairs.add(`${freqToBand(freq_khz)}${mode}}`));
            const mult = pairs.size;
            const qsoPoints = contacts.map(({ mode }) => mode === 'PH' ? 1 : 2).reduce((total, next) => total + next, 0);
            const powerMult = log.custom?.qrp ? 2 : 1;
            return mult * powerMult * qsoPoints;
        },

        exports: {
            adif: (log, contacts) => {
                const header = exportFormats.adif.defaultHeader(log, contacts);
                const qsos = contacts.map(qso => {
                    qso.class = qso.custom.class;
                    qso.arrl_section = qso.custom.arrl_section;

                    return qso;
                });

                return { header, qsos };
            },
            
            cabrillo: (log, contacts) => {
                const header = exportFormats.cabrillo.defaultHeader(log, contacts);
                const qsos = contacts.map(qso => {
                    qso.exchange = {
                        sent: `${log.callsign} ${log.custom.class} ${log.custom.arrl_section}`,
                        received: `${qso.other_call} ${qso.custom.class} ${qso.custom.arrl_section}`
                    };

                    return qso;
                });

                header.set('CONTEST', 'WFD');
                header.set('CATEGORY-POWER', log.custom.qrp ? 'LOW' : 'HIGH');
                header.set('CATEGORY-STATION', log.custom.class.endsWith('M') ? 'MOBILE' : 'FIXED');

                const numXmitters = Number(log.custom.class.slice(0, -1) || 1);
                header.set('CATEGORY-TRANSMITTER',
                    numXmitters === 1 ? 'ONE' :
                    numXmitters === 2 ? 'TWO' :
                    'UNLIMITED'
                );

                header.set('X-EXCHANGE', log.custom.class);

                return { header, qsos };
            }
        }
    }
];

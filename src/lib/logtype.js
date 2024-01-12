import { contestBands, freqToBand } from "./bands";

const standardModes = [
    'SSB',
    'CW',
    'RTTY',
    'FT8'
];

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
        displayFields: [ 'date', 'time', 'other_call', 'freq_khz', 'mode', 'name', 'qth', 'rst_sent', 'rst_recd', 'memo' ],
        modes: standardModes
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
        displayFields: [ 'date', 'time', 'other_call', 'freq_khz', 'c:skcc_nr', 'name', 'qth', 'rst_sent', 'rst_recd', 'memo' ],
        modes: [ 'CW' ],
        restrictModes: true
    },

    {
        id: 2,
        name: 'Winter Field Day',
        display: true,
        inputs: [ 'other_call', 'c:class', 'c:arrl_section', 'freq_khz', 'mode' ],
        displayFields: [ 'date', 'time', 'other_call', 'c:class', 'c:arrl_section', 'band', 'mode' ],
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
            { key: 'club', label: 'Club Name', type: 'text' },
            { key: 'address', label: 'Address', type: 'address', required: true },
            { key: 'email', label: 'Email', type: 'email' }
        ],

        score: (log, contacts) => {
            const pairs = new Set();
            contacts.forEach(({ freq_khz, mode }) => pairs.add(`${freqToBand(freq_khz)}_${mode}}`));
            const mult = pairs.size;
            const qsoPoints = contacts.map(({ mode }) => mode === 'PH' ? 1 : 2).reduce((total, next) => total + next);
            const powerMult = log.custom?.qrp ? 2 : 1;
            return mult * powerMult * qsoPoints;
        }
    }
];

export const fieldNames = {
    'date': 'Date',
    'time': 'Time',
    'other_call': 'Call',
    'name': 'Name',
    'qth': 'QTH',
    'rst_sent': 'RST Sent',
    'rst_recd': "RST Rec'd",
    'freq_khz': 'Frequency',
    'band': 'Band',
    'mode': 'Mode',
    'op_call': 'Operator',
    'memo': 'Memo',
    'c:arrl_section': 'Section',
    'c:class': 'Class',
    'c:skcc_nr': 'SKCC #'
};

export function getContactData(contact, column) {
    if (column.startsWith('c:')) {
        if (contact.custom)
            return contact.custom[column.slice(2)];
        else
            return null;
    } else {
        return contact[column];
    }
}
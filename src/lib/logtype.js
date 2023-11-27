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
    'mode': 'Mode',
    'op_call': 'Operator',
    'memo': 'Memo',
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
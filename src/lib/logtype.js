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
    }
];

export const standardFields = {
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
    'memo': 'Memo'
};
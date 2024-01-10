const bands = {
    '70cm': [ 420000, 450000 ],
    '125cm': [ 219000, 225000 ],
    '2m': [ 144000, 148000 ],
    '6m': [ 50000, 54000 ],
    '10m': [ 28000, 29700 ],
    '12m': [ 24890, 24990 ],
    '15m': [ 21000, 21450 ],
    '17m': [ 18068, 18168 ],
    '20m': [ 14000, 14350 ],
    '30m': [ 10100, 10150 ],
    '40m': [ 7000, 7300 ],
    '60m': [ 5330, 5406 ],
    '80m': [ 3500, 4000 ],
    '160m': [ 1800, 2000 ],
    '630m': [ 472, 479 ],
    '2200m': [ 135, 138 ]
};

export const hfBands = [
    '10m', '12m', '15m', '17m', '20m', '30m', '40m', '60m', '80m'
];

export const commonBands = [ '6m', ...hfBands, '160m' ];
export const contestBands = [ '10m', '15m', '20m', '40m', '80m', '160m' ];

export function freqToBand(freq) {
    return Object.keys(bands).find(k => freq >= bands[k][0] && freq <= bands[k][1]);
}

export function bandToFreq(band) {
    return bands[band][0];
}

export function bandChoices(bandList) {
    const out = {};
    bandList.forEach(band => out[band] = bands[band][0]);
    return out;
}
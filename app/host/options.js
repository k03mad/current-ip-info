'use strict';

const {blue, green, gray, magenta, red, yellow, cyan} = require('colorette');

module.exports = {
    addIndent: message => gray('⎣ ') + message,

    ipColor: blue,
    valueColor: green,
    timeColor: cyan,

    scanMessageColor: magenta,
    scanMessageSeparator: '—',

    nmapLite: ip => `nmap -Pn ${ip}`,
    nmapTimeoutLite: 2 * 60000,

    nmapFull: ip => `nmap -Pn -sV ${ip}`,
    nmapTimeoutFull: 10 * 60000,

    nmapNewLine: /[\n\r]+/,
    nmapPort: /(^\d+\/\S+)|^Service Info:/,

    warningColor: yellow,
    errorColor: red,
};

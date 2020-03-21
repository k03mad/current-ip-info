#!/usr/bin/env node

'use strict';

const convert = require('xml-js');
const options = require('./lib/options');
const services = require('./lib/services');
const {args, help} = require('./lib/help');
const {request, object} = require('utils-mad');

if (args.help) {
    console.log(help);
    process.exit(0);
}

(async () => {

    const data = args.ip
        ? services
            .filter(elem => elem.queryIp)
            .map(elem => {
                elem.request = elem.queryIp(args.ip);
                return elem;
            })
        : services.map(elem => {
            elem.request = elem.currentIp;
            return elem;
        });

    await Promise.all(data.map(async elem => {
        const output = [];

        try {
            output.push(options.urlColor(elem.request));
            let {body} = await request.got(elem.request);

            if (elem.xmlPath) {
                const converted = convert.xml2js(body, {
                    compact: true,
                    trim: true,
                    nativeType: true,
                    ignoreDeclaration: true,
                });

                body = Object.fromEntries(Object
                    .entries(object.path(converted, elem.xmlPath))
                    // eslint-disable-next-line no-underscore-dangle
                    .map(([key, value]) => [key, value._text]));
            }

            for (const [key, value] of Object.entries(body)) {
                if (value) {
                    if (elem.removeKeys && elem.removeKeys.includes(key)) {
                        continue;
                    }

                    const valueColor = String(value).match(options.numbersRegExp)
                        ? options.numbersColor
                        : options.othersColor;

                    output.push(`${options.indent}${key}: ${valueColor(value)}`);
                }
            }
        } catch (err) {
            output.push(options.errColor(err));
        }

        console.log(`\n${output.join('\n')}`);
    }));

})();
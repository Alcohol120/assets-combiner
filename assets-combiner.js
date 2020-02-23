#!/usr/bin/env node
'use strict';

const Collection = require('./entities/Collection');

let options = process.argv;
options.splice(0, 2);

if(options.length < 1) throw new Error('No configuration');

for(let i = 0; i < options.length; i++) {
    let option = options[i];
    if(!option.match(/^\(.+\)$/)) throw new Error('Invalid arguments');
    option = option.slice(1);
    option = option.slice(0, option.length - 1);
    let params = option.split('&');
    let config = {};
    for(let p = 0; p < params.length; p++) {
        let temp = params[p].split('=');
        config[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    new Collection(config).combine();
}
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const Collection = require('./entities/Collection');

const argv = process.argv.length > 2
    ? process.argv.slice(2)
    : [ 'assets-combiner.json' ];

for(let i = 0; i < argv.length; i++) {
    const config = require(fs.realpathSync(argv[i]));

    const variables = !Array.isArray(config) && config.hasOwnProperty('variables')
        ? config.variables
        : {};
    let collections = [];

    if(Array.isArray(config)) {
        collections = config;
    } else if(config.hasOwnProperty('collections')) {
        collections = config.collections;
    } else collections = [ config ];

    for(let j = 0; j < collections.length; j++) new Collection(collections[j], variables).combine();
}
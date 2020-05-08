#!/usr/bin/env node
'use strict';

const fs = require('fs');
const Collection = require('./entities/Collection');

const argv = process.argv.slice(2);

let configFile = 'assets-combiner.json';
let collectionIndex = -1;

for(let i = 0; i < argv.length; i++) {
    if(argv[i] === '-i') {
        collectionIndex = parseInt(argv[i + 1]);
        i++;
    } else configFile = argv[i];
}

const config = require(fs.realpathSync(configFile));

const variables = !Array.isArray(config) && config.hasOwnProperty('variables')
    ? config.variables
    : {};
let collections = [];

if(Array.isArray(config)) {
    collections = config;
} else if(config.hasOwnProperty('collections')) {
    collections = config.collections;
} else collections = [ config ];

if(collectionIndex >= 0) {
    new Collection(collections[collectionIndex], variables).combine();
} else for(let j = 0; j < collections.length; j++) new Collection(collections[j], variables).combine();
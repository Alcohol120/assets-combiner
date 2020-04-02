#!/usr/bin/env node
'use strict';

const fs = require('fs');
const Collection = require('./entities/Collection');

const argv = process.argv.length > 2
    ? process.argv.slice(2)
    : [ 'assets-combiner.json' ];

for(let i = 0; i < argv.length; i++) {
    let configs = require(fs.realpathSync(argv[i]));
    if(!Array.isArray(configs)) configs = [ configs ];
    for(let j = 0; j < configs.length; j++) new Collection(configs[j]).combine();
}
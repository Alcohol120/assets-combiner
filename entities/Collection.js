'use strict';

const fs = require('fs');
const path = require('path');

const Folder = require('./Folder');

class Collection {

    constructor(config, variables={}) {
        this.including = {
            include: config.hasOwnProperty('include') ? config['include'] : [],
            exclude: config.hasOwnProperty('exclude') ? config['exclude'] : []
        };
        this.variables = Object.assign({}, variables, config.hasOwnProperty('variables') ? config['variables'] : {});
        this.sources = new Folder(config['sourceDir'], this.including);
        this.outputPath = config['outputFile']
            ? fs.realpathSync(path.dirname(config['outputFile'])) + path.sep + path.basename(config['outputFile'])
            : '';
        this.output = '';
    }

    combine() {
        // load all files and folders
        this.sources.load();
        // get content of a merged files
        this.output = this.sources.combine();
        // parse variables
        for(let key in this.variables) {
            this.parseVariable(key, this.variables[key]);
        }
        // save
        if(this.outputPath) {
            fs.writeFileSync(this.outputPath, this.output);
        } else console.log(this.output);
    }

    parseVariable(name, value) {
        const needle = new RegExp(`{combiner:${name}}`, 'g');
        this.output = this.output.replace(needle, value.toString().replace('$', '$$$$'));
    }

}

module.exports = Collection;
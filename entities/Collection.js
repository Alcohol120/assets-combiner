'use strict';

const fs = require('fs');
const path = require('path');

const Folder = require('./Folder');

class Collection {

    constructor(config) {
        this.types = {
            included: [],
            excluded: []
        };
        this.vars = config.hasOwnProperty('var') ? require(fs.realpathSync(config['var'])) : {};
        if(config.hasOwnProperty('ext')) this.configureTypes(config['ext']);
        this.sources = new Folder(config['src'], this.types);
        this.outputPath = fs.realpathSync(path.dirname(config['out'])) + path.sep + path.basename(config['out']);
        this.output = '';
    }

    configureTypes(conf) {
        if(conf.indexOf('*') >= 0) {
            this.types.excluded = conf.split('|');
            this.types.excluded.splice(this.types.excluded.indexOf('*'), 1);
        } else {
            this.types.included = conf.split('|');
        }
    }

    combine() {
        // load all files and folders
        this.sources.load();
        // get content of a merged files
        this.output = this.sources.combine();
        // parse variables
        for(let key in this.vars) {
            this.parseVariable(key, this.vars[key]);
        }
        // save
        fs.writeFileSync(this.outputPath, this.output);
    }

    parseVariable(name, value) {
        this.output = this.output.replace(new RegExp('\{combiner:' + name.toString() + '\}', 'g'), value.toString());
    }

}

module.exports = Collection;
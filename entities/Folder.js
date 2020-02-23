'use strict';

const fs = require('fs');
const path = require('path');

const Item = require('./Item');
const File = require('./File');

class Folder extends Item {

    constructor(fullPath, types) {
        super(fullPath);
        this.type = 'folder';
        this.types = types;
        this.config = [];
        this.items = [];
        this.names = [];
    }

    load() {
        let items = fs.readdirSync(this.fullPath);
        // find config file
        for(let i = 0; i < items.length; i++) {
            if(items[i] !== 'combine.json') continue;
            this.config = require(fs.realpathSync(this.fullPath + path.sep + items[i]));
        }
        // collect first ordered items
        if(this.config.hasOwnProperty('includingOrder') && this.config.includingOrder.length > 0) {
            for(let i = 0; i < this.config.includingOrder.length; i++) {
                if(items.indexOf(this.config.includingOrder[i]) >= 0) this.collect(this.config.includingOrder[i]);
            }
        }
        // collect all files
        for(let i = 0; i < items.length; i++) this.collect(items[i], true);
        // collect all folders
        for(let i = 0; i < items.length; i++) this.collect(items[i]);
        return this;
    }

    collect(name, filesOnly=false) {
        if(path.extname(name) === '.json') return;
        if(this.config.hasOwnProperty('excluded') && this.config.excluded.indexOf(name) >= 0) return;
        if(this.names.indexOf(name) >= 0) return;
        let fullPath = fs.realpathSync(this.fullPath + path.sep + name);
        let isFolder = fs.lstatSync(fullPath).isDirectory();
        if(isFolder && filesOnly) return;
        this.names.push(name);
        if(isFolder) {
            this.items.push(new Folder(fullPath, this.types).load());
        } else {
            if(!this.config.hasOwnProperty('allowed') || this.config.allowed.indexOf(name) < 0) {
                if(this.types.included.length > 0 && this.types.included.indexOf(path.extname(name).slice(1)) < 0) return;
                if(this.types.excluded.length > 0 && this.types.excluded.indexOf(path.extname(name).slice(1)) >= 0) return;
            }
            this.items.push(new File(fullPath));
        }
    }

    combine() {
        let output = '';
        for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            output += '\n';
            if(item.type === 'folder') {
                output += item.combine();
            } else {
                output += fs.readFileSync(item.fullPath).toString();
            }
        }
        return output;
    }

}

module.exports = Folder;
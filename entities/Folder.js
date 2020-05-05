'use strict';

const fs = require('fs');
const path = require('path');

const Item = require('./Item');
const File = require('./File');

class Folder extends Item {

    constructor(fullPath, including) {
        super(fullPath);
        this.type = 'folder';
        this.including = including;
        this.config = [];
        this.items = [];
        this.names = [];
    }

    load() {
        let items = fs.readdirSync(this.fullPath);
        // load configs
        if(fs.existsSync(this.fullPath + path.sep + 'combiner.json')) {
            this.config = require(this.fullPath + path.sep + 'combiner.json');
        }
        // collect first ordered items
        if(this.config.hasOwnProperty('order') && this.config.order.length > 0) {
            for(let i = 0; i < this.config.order.length; i++) {
                if(this.config.hasOwnProperty('layout') && this.config.order[i] === this.config.layout) continue;
                if(items.indexOf(this.config.order[i]) >= 0) this.collect(this.config.order[i]);
            }
        }
        // collect all files
        for(let i = 0; i < items.length; i++) this.collect(items[i], 'files');
        // collect all folders
        for(let i = 0; i < items.length; i++) this.collect(items[i], 'folders');
        return this;
    }

    collect(name, type='') {
        if(path.extname(name) === '.json') return;
        if(this.config.hasOwnProperty('excluded') && this.config.excluded.indexOf(name) >= 0) return;
        if(this.names.indexOf(name) >= 0) return;
        let fullPath = fs.realpathSync(this.fullPath + path.sep + name);
        let isFolder = fs.lstatSync(fullPath).isDirectory();
        if(isFolder && type && type !== 'folders') return;
        this.names.push(name);
        if(isFolder) {
            this.items.push(new Folder(fullPath, this.including).load());
        } else {
            let isLayout = this.config.hasOwnProperty('layout') && this.config.layout === name;
            if(!this.config.hasOwnProperty('allowed') || this.config.allowed.indexOf(name) < 0) {
                if(!this.isFileAllowed(name)) return;
            }
            this.items.push(new File(fullPath, isLayout));
        }
    }

    isFileAllowed(filename) {
        if(this.including.include.length > 0) {
            for(let i = 0; i < this.including.include.length; i++) {
                const pattern = '^' + this.including.include[i].replace(/\*/g, '.*?') + '$';
                if(!filename.match(new RegExp(pattern, 'i'))) return false;
            }
        }
        if(this.including.exclude.length > 0) {
            for(let i = 0; i < this.including.exclude.length; i++) {
                const pattern = '^' + this.including.exclude[i].replace(/\*/g, '.*?') + '$';
                if(filename.match(new RegExp(pattern, 'i'))) return false;
            }
        }
        return true;
    }

    combine() {
        let output = '';
        let layout = '';
        for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if(item.type === 'folder') {
                output += item.combine();
            } else if(item.isLayout) {
                layout = fs.readFileSync(item.fullPath).toString();
            } else {
                let content = fs.readFileSync(item.fullPath).toString();
                output += content;
                if(content.length > 0) output += '\n';
            }
        }
        if(layout) output = layout.replace('{combiner:layout}', output.replace('$', '$$$$'));
        return output;
    }

}

module.exports = Folder;
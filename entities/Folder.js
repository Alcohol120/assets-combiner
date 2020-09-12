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
        const items = fs.readdirSync(this.fullPath);
        // load configs
        const configPath = `${this.fullPath}${path.sep}combiner.json`;
        if(fs.existsSync(configPath)) {
            this.config = require(configPath);
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
            const isLayout = this.config.hasOwnProperty('layout') && this.config.layout === name;
            if(!this.config.hasOwnProperty('allowed') || this.config.allowed.indexOf(name) < 0) {
                if(!this.isFileAllowed(name)) return;
            }
            this.items.push(new File(fullPath, isLayout));
        }
    }

    isFileAllowed(filename) {
        let valid = false;
        if(this.including.include.length > 0) {
            for(let i = 0; i < this.including.include.length; i++) {
                const pattern = '^' + this.including.include[i].replace(/\*/g, '.*?') + '$';
                if(!filename.match(new RegExp(pattern, 'i'))) continue;
                valid =  true;
                break;
            }
        }
        if(this.including.exclude.length > 0) {
            for(let i = 0; i < this.including.exclude.length; i++) {
                const pattern = '^' + this.including.exclude[i].replace(/\*/g, '.*?') + '$';
                if(!filename.match(new RegExp(pattern, 'i'))) continue;
                valid = false;
                break;
            }
        }
        return valid;
    }

    combine() {
        let output = '';
        let layout = '';
        for(let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if(item.type === 'folder') {
                output += item.combine();
            } else if(item.isLayout) {
                layout = item.getContent();
            } else {
                let content = item.getContent();
                output += content;
                if(content.length > 0) output += '\n';
            }
        }
        if(layout) output = layout.replace('{combiner:layout}', output.replace('$', '$$$$'));
        return output;
    }

}

module.exports = Folder;
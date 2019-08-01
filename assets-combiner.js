#!/usr/bin/env node
'use strict';

const fs = require('fs');
const crypt = require('crypto');

class Collection {

    constructor(assets_type, source_path, output_path) {
        this.assets_type = assets_type;
        this.source_path = Collection.fixPath(fs.realpathSync(source_path));
        this.output_path = Collection.fixPath(fs.realpathSync(output_path));
        this.files = {};
    }

    combine() {
        this.files = Collection.loadAllFiles(this.source_path);
        for(let filename in this.files) {
            this.combineFile(filename);
        }
        for(let filename in this.files) {
            if(this.files[filename].included < 1) {
                let new_path = filename.replace(this.source_path, '');
                let path = Collection.getFilePath(new_path);
                if(!fs.existsSync(this.output_path + path)) {
                    fs.mkdirSync(this.output_path + path);
                } else if(fs.existsSync(this.output_path + new_path)) {
                    let content = fs.readFileSync(this.output_path + new_path);
                    let hash = crypt.createHash('sha256').update(content).digest('hex');
                    let new_hash = crypt.createHash('sha256').update(this.files[filename].content).digest('hex');
                    if(hash === new_hash) continue;
                }
                fs.writeFileSync(this.output_path + new_path, this.files[filename].content);
            }
        }
    }

    combineFile(filename, count=0) {
        if(count >= 1000) throw new Error('Cyclic embedding detected!');
        count++;
        let includes = null;
        if(this.assets_type === 'html') {
            includes = this.files[filename].content.match(/<!--@include\(.*?\)-->/ig);
        } else if(this.assets_type === 'js') {
            includes = this.files[filename].content.match(/(\/\*@include\(.*?\)\*\/)|(\/\/@include\(.*?\))/ig);
        } else {
            includes = this.files[filename].content.match(/\/\*@include\(.*?\)\*\//ig);
        }
        if(includes)
            for(let matched in includes) {
                let path = includes[matched].match(/\((.*?)\)/i);
                if(!path || !path.hasOwnProperty(1) || !path[1]) continue;
                path = Collection.fixPath(fs.realpathSync(Collection.getFilePath(filename) + path[1]), true);
                let content = this.files[filename].content;
                content = content.replace(includes[matched], this.combineFile(path, count));
                this.files[filename].content = content;
                this.files[path].included++;
            }
        return this.files[filename].content;
    }

    static loadAllFiles(path='', files={}) {
        let catalog = fs.readdirSync(path);
        for(let i in catalog) {
            if(fs.lstatSync(path + '/' + catalog[i]).isDirectory()) {
                files = this.loadAllFiles(path + catalog[i] + '/', files);
            } else {
                files[path + catalog[i]] = {
                    'content': fs.readFileSync(path + '/' + catalog[i]).toString(),
                    'included': 0
                };
            }
        }
        return files;
    }

    static isValidPath(path) {
        return !!path.match(/([a-z]+:\/)?(.*?\/)+/i);
    }

    static fixPath(path, file=false) {
        if(!path) return '';
        path = path.replace(/\\/g, '/');
        if(path.slice(path.length - 1) !== '/' && !file) path += '/';
        return path;
    }

    static getFilePath(path) {
        path = path.split('/');
        path.splice(path.length - 1);
        return path.join('/') + '/';
    }

}

let options = process.argv;
options.splice(0, 2);

for(let d = 0; d < Math.floor(options.length / 3); d++) {
    let i = d * 3;
    let assets_type = options[i];
    let source_path = options[i + 1];
    let output_path = options[i + 2];
    if(['js', 'css', 'html'].indexOf(assets_type) < 0) throw new Error('Invalid assets type: ' + assets_type);
    if(!Collection.isValidPath(source_path)) throw new Error('Invalid source path: ' + source_path);
    if(!Collection.isValidPath(output_path)) throw new Error('Invalid output path: ' + output_path);
    if(!fs.existsSync(source_path)) throw new Error('Source directory is not exists: ' + source_path);
    if(!fs.existsSync(output_path)) throw new Error('Output directory is not exists: ' + output_path);
    new Collection(assets_type, source_path, output_path).combine();
}
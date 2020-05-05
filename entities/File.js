'use strict';

const fs = require('fs');
const Item = require('./Item');

class File extends Item {

    constructor(fullPath, isLayout=false) {
        super(fullPath);
        this.type = 'file';
        this.isLayout = isLayout;
    }

    getContent() {
        return fs.readFileSync(this.fullPath).toString();
    }

}

module.exports = File;
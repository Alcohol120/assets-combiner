'use strict';

const Item = require('./Item');

class File extends Item {

    constructor(fullPath, isLayout=false) {
        super(fullPath);
        this.type = 'file';
        this.isLayout = isLayout;
    }

}

module.exports = File;
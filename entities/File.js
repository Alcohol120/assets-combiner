'use strict';

const Item = require('./Item');

class File extends Item {

    constructor(fullPath) {
        super(fullPath);
        this.type = 'file';
    }

}

module.exports = File;
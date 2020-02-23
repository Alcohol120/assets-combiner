'use strict';

const fs = require('fs');
const path = require('path');

class Item {

    constructor(fullPath) {
        this.fullPath = fs.realpathSync(fullPath);
        this.name = this.fullPath.split(path.sep).reverse()[0];
        this.type = '';
    }

}

module.exports = Item;
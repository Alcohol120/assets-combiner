Assets Combiner
===
A FileWatcher for merging JS/CSS/HTML files.

Install
---
    npm install assets-combiner -g

Usage
---
###Command line:

    node assets-combiner file_type /path/to/sources/ /path/to/output/
    
Parameter `file_type` allows `js`, `css` and `html` mode.

**Important:** source and output directories should be different to avoid file naming conflicts!

###Include tags

JS files:

    /*@include(path/to/file.js)*/
    
CSS files:
    
    /*@include(path/to/file.css)*/
    
HTML files:

    <!--@include(path/to/file.html)-->

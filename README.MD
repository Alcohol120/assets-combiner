Assets Combiner
===
A FileWatcher for merging JS/CSS/HTML files.

Install
---
    npm install assets-combiner -g

Usage
---
###Command line:

    node assets-combiner file_type /path/to/sources/ /path/to/output/ /path/to/config/file
    
Parameter `file_type` allows `js`, `css` and `html` mode.

`/path/to/config/file` is a path to text file. Use `-` to ignore this parameter.

**Config file** is a file witch contain one variable per line, for example:

    app_name=Test app
    app_version=1.8.5

**Important:** source and output directories should be different to avoid file naming conflicts!

AssetsCombiner supports both relative and absolute paths.

You can use AssetsCombiner for different collections at the same time, for example:

    node assets-combiner html /src/html /out my.cfg js /src/js /out/js my.cfg css /src/css /out/css -

###Include tags

JS files:

    /*@include(path/to/file.js)*/
    
or

    //@include(path/to/file.js)
    
CSS files:
    
    /*@include(path/to/file.css)*/
    
HTML files:

    <!--@include(path/to/file.html)-->
    
Including all files in directory and sub-directories recursively

**Warning:** This will include files with alphabetical sorting. Don't use it if including order is important for you.

    @include(path/to/catalog/*)
    
###Variable tags

JS files:

    /*@var(app_version)*/
    
or

    //@var(app_version)
    
CSS files:

    /*@var(app_version)*/
    
HTML files

    <!--@var(app_version)-->

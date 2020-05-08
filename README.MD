Assets Combiner
===
A simple tool for merging your source files into one file

Install
---
    npm install assets-combiner -g

Usage
---

    node assets-combiner ./path/to/my-config.json
    
If you have configuration file in your working directory and it is called `assets-combiner.json` you can execute assets-combiner without parameters

    node assets-combiner
    
Multiple configuration files

    node assets-combiner build-js.json build-css.json

Example of configuration file

    {
      "sourceDir": "src/js",
      "outputFile": "dist/compiled.js",
      "include": [
        "*.js"
      ],
      "exclude": [
        "*.test.js"
      ],
      "variables": {
        "name": "Test JS combining"
      }
    }
    
Multiple configurations:

    [
      {
        "sourceDir": "src/js",
        "outputFile": "dist/compiled.js",
        "include": [
          "*.js"
        ]
      },
      {
        "sourceDir": "src/css",
        "outputFile": "dist/compiled.css",
        "include": [
          "*.css"
        ]
      }
    ]
    
Multiple configurations with shared variables:

    {
      "collections": [
        {
          "sourceDir": "src/js",
          "outputFile": "dist/compiled.js",
          "variables": {
            "title": "override shared variable"
          }
        },
        ...
      ]
      "variables": {
        "name": "Test JS combining",
        "title": "test title"
      }
    }
    
**sourceDir** - relative or absolute path to a sources folder.

**outputFile** - relative or absolute path to an output file.

**include** - array of filename patterns what can be merged.

**exclude** - array of filename patterns what not be merged.

**variables** - array of variables. Those variables can be included in output file with the following tag: `{combiner:my_variable_name}`

Including order
---
All sources including recursively. Files first, sub-folders second. For example the following files structure:

    src
    ├── sub_dir
    │   └── file_2.js
    └── file_1.js
    
Will be merged with this order:

    file_1.js
    file_2.js

combiner.json file
---
combiner.json is an optional, config file witch can be placed in any sources directory.

combiner.json provides you options to define merging order, including files witch not allowed by `include` parameter and exclude allowed files.

#### Basic combiner.json structure

    {
        "order": [],
        "excluded": [],
        "allowed": []
    }
    
#### order

Example files structure:

    src
    ├── sub_dir
    │   └── combine.json
    │   └── file_2.js
    │   └── file_3.js
    │   └── file_4.js
    │   └── file_5.js
    └── file_1.js
    
Example `order` of `src/sub_dir/combine.json`:

    {
        "includingOrder": [
            "file_4.js",
            "file_3.js"
        ]
    }
    
Files will be merged with following order:

    file_1.js
    file_4.js
    file_3.js
    file_2.js
    file_5.js
    
By default sub-directories includes after files. We can use `order` to include directory first, like this:

    {
        "includingOrder": [
            "my_sub_directory"
        ]
    }
    
#### excluded
Files or folders witch will not be included in output file even though these allowed by `include` parameter.

#### allowed
Files witch will be included in output file even though these is not allowed by `include` parameter.

#### layout
If this property isset all files content will be inserted into layout file. Layout file should contain a `{combiner:layout}` tag. It will be replaced with merged content from other files.

It can be useful if you need, for example, embed some HTML inside certain part of other HTML.

##### Example:

Files structure

    src
    └── combine.json
    └── index.html
    └── embed.html
    
index.html

    <html>
        <head>
            <title>Layout</title>
        </head>
        <body>
            {combiner:layout}
        </body>
    </html>
    
embed.html

    <div>
        <h1>Embed</h1>
    </div>
    
combine.json

    {
        "layout": "index.html"
    }
    
Output:

    <html>
        <head>
            <title>Layout</title>
        </head>
        <body>
            <div>
                <h1>Embed</h1>
            </div>
        </body>
    </html>
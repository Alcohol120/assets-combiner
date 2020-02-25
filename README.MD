Assets Combiner
===
A simple tool for merging your source files into one file

Install
---
    npm install assets-combiner -g

Usage
---
Merge content of all JS files located in ./source/folder directory into a file ./dist.js

    node assets-combiner (src=./source/folder&out=./dist.js&ext=js)
    
Multiple configurations

    node assets-combiner (src=./src/js&out=./dist1.js&ext=js) (src=./src/html&out=./index.html&ext=html)
    
Parameters
---
#### src
relative or absolute path to a sources folder

#### out
relative or absolute path to a output file

#### ext
file extensions for including

`ext=js` - means only files with .js extensions can be included

`ext=html|htm` - .html and .htm files can be included

`ext=*` - include files with any extension (except .json)

`ext=*|css` - include all files except .css

#### vars
relative or absolute path to variables file
`var=./my_vars.json`

this is a JSON file witch can contain some variables. Those variables can be included in output file with following tag: `{combiner:my_variable_name}`

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

combine.json file
---
combine.json is an optional, config file witch can be placed in any sources directory.

combine.json provides you options to define merging order, including files witch not allowed by `ext` parameter and exclude allowed files.

#### Basic combine.json structure

    {
        "includingOrder": [],
        "excluded": [],
        "allowed": []
    }
    
#### includingOrder

Example files structure:

    src
    ├── sub_dir
    │   └── combine.json
    │   └── file_2.js
    │   └── file_3.js
    │   └── file_4.js
    │   └── file_5.js
    └── file_1.js
    
Example `includingOrder` of `src/sub_dir/combine.json`:

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
    
By default sub-directories includes after files. We can use `includingOrder` to include directory first, like this:

    {
        "includingOrder": [
            "my_sub_directory"
        ]
    }
    
#### excluded
Files or folders witch will not be included in output file even though these allowed by `ext` parameter.

#### allowed
Files witch will be included in output file even though these is not allowed by `ext` parameter.

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
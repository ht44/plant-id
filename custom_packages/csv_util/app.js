'use strict';

const TRUE_DIMENSIONS = '640x480'

const fs = require('fs');
const output = new Array();
const pattern = /160x120(.*?)JPG/ig;
let normal = new Array();

// cURL for each page, write to ./raw_html, run the following:
fs.readdir('./raw_html', 'utf8', (err, files) => {
  files.forEach(filename => {
    let contents = fs.readFileSync(`./raw_html/${filename}`, 'utf8');
    let result = contents.match(pattern).join(',');
    output.push(result);
  })

  output.join(',').split(',').forEach(key => {
    key = key.replace('160x120', TRUE_DIMENSIONS);
    normal.push(key.substring(0, key.length - 4));
  })

// then glob the output with cURL
  console.log(normal.join(','));
  fs.writeFile('./output.txt', normal.join(','), (err) => {
    if (err) console.error(err);
    // console.log(output);
  });
});

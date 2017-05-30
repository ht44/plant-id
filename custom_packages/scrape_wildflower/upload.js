'use strict';
const fs = require('fs');
const request = require('request');
let counter = 0;

const output = fs.readFileSync('./temp.json');

slowWrite(JSON.parse(output));

function slowWrite(arr) {
    setTimeout(() => {
        request({
          uri: 'https://aa9b789f-b131-4bda-b585-912ff49352c8-bluemix:d9b31194f2bcc43c8c5205fba618330c90bd113feb22095d1faa3c6cfaea2791@aa9b789f-b131-4bda-b585-912ff49352c8-bluemix.cloudant.com/observations',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(arr[counter])
        }, (err, response) => {
          console.log(response);
          if (arr[(counter + 1)] != undefined) {
            counter = counter + 1;
            slowWrite(arr);
          }
        });
    }, 101);
}

'use strict';
const fs = require('fs');
const request = require('request');
let counter = 0;

class GeoJson {

    constructor(vectorType, obsId, date, symbol, species, lat, lng, abundence, validName) {
        this.type = "Feature";
        this.geometry = {
            type: vectorType,
            coordinates: [lat, lng]
        };

        this.properties = {
            obs_id: obsId,
            date: date,
            symbol: symbol,
            species: species,
            abundence: abundence,
            valid_name: validName
        };
    }

};

function slowWrite(arr) {
    setTimeout(() => {
        console.log('RAN');
        request({
          uri: 'https://aa9b789f-b131-4bda-b585-912ff49352c8-bluemix:d9b31194f2bcc43c8c5205fba618330c90bd113feb22095d1faa3c6cfaea2791@aa9b789f-b131-4bda-b585-912ff49352c8-bluemix.cloudant.com/observations',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(arr[counter])
        });
        if ((arr[counter + 1]) !== undefined) {
            ++counter;
            slowWrite(arr);
        }
    }, 151);
}

fs.readdir('./csv_files/', 'utf8', (err, files) => {
    let output = [];
    files.forEach(filename => {
        let contents = fs.readFileSync(`./csv_files/${filename}`, 'utf8');
        let result;

        contents.split('\n').forEach(record => {
            if (/^\d+$/.test((record.split(',')[0]))) {
                let arr = record.split(',');
                result = new GeoJson('Point', arr[0], arr[1], arr[2], arr[3], arr[7], arr[8], arr[13], arr[15]);
                output.push(result);
                result = null;
            }
        });
    });
    fs.writeFile('./temp.json', JSON.stringify(output), (err, data) => {
      console.log('done');
    })
    // slowWrite(output);
});

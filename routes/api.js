//
'use strict';
require('dotenv').load();
const fs = require('fs');
const express = require('express');
const request = require('request');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const bodyParser = require('body-parser');

// MINI-APP
const router = express.Router();
const geoJson = require('../custom_modules/geotagging');
///////////////////////////////////////////////////////////////////////////////
// WATSON
///////////////////////////////////////////////////////////////////////////////

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const visual_recognition = new VisualRecognitionV3({
    api_key: process.env.API_KEY,
    version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
});

///////////////////////////////////////////////////////////////////////////////
// STORAGE
///////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});

const upload = multer({
    storage: storage
});

///////////////////////////////////////////////////////////////////////////////
// DATABASE
///////////////////////////////////////////////////////////////////////////////

let db_obs,
    db_class,
    db_test,
    cloudant;
const dbCredentials = {

    classDB: 'classes',
    obsDB: 'observations',
    testDB: 'test'
};

// custom exports
const util = require('../custom_modules/util');
const dbInit = require('../custom_modules/db_init');

// functions
const sanitizeInput = util.sanitizeInput;
const initDBConnection = dbInit.initDBConnection;
const getDBCredentialsUrl = dbInit.getDBCredentialsUrl;
dbCredentials.url = initDBConnection(getDBCredentialsUrl);
cloudant = require('cloudant')(dbCredentials.url);
// check if DB exists if not create
cloudant.db.create(dbCredentials.dbName, (err, res) => {
    if (err)
        console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
});

db_class = cloudant.use(dbCredentials.classDB);
db_obs = cloudant.use(dbCredentials.obsDB);
db_test = cloudant.use(dbCredentials.testDB);
///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

router.post('/classify', upload.single('file'), (req, res) => {
    const temp = {
      "custom_classes": 24,
      "images": [
        {
          "classifiers": [
            {
              "classes": [
                {
                  "class": "Ligustrum lucidum",
                  "score": 0.992155
                }, {
                  "class": "Ligustrum quihoui",
                  "score": 0.664165
                }, {
                  "class": "Melia azedarach",
                  "score": 0.560582
                }, {
                  "class": "Rapistrum rugosum",
                  "score": 0.986212
                }, {
                  "class": "Torilis arvensis",
                  "score": 0.989952
                }
              ],
              "classifier_id": "TexasInvasives_190947980",
              "name": "Texas Invasives"
            }
          ],
          "image": "b8772d41b377800b9769ba4deb22b5921496212536439.jpeg"
        }
      ],
      "images_processed": 1
    }
    const params = {
        image_file: fs.createReadStream(req.file.path),
        classifier_ids: 'TexasInvasives_190947980'
    }

    let extraction = geoJson.extractData(req.file.path).then((data) => {
        let coordinates;
        if (data.gps.GPSLongitude) {
            coordinates = geoJson.extractLatLng(data);
        }
        let match;
        // visual_recognition.classify(params, (error, results) => {
            // if (error) {
            //     console.error(error);
            // } else {
                match = util.calcMatch(temp);
                db_class.get(match.class.replace(' ', '_'), (err, body) => {
                    res.json({coordinates: coordinates, properties: body.data, confidence: match.score});
                });
            // }
        // });
    }).catch((error) => {
        res.json(error);
    });
});

router.post('/store', upload.single('file'), (req, res) => {
    console.log('got thereeee');
    let file = fs.createReadStream(req.file.path);
    let results;
    request({
        url: `https://dal.objectstorage.open.softlayer.com/v1/AUTH_7defd160d60c4e43b5f9dd6691e7e1a0/images/${req.file.filename}`,
        method: 'PUT',
        headers: {
            'X-Auth-Token': req.app.get('storageToken'),
            'Content-type': 'application/octet-stream',
            'Content-length': req.file.size
        },
        body: file
    }, (err, response) => {
        console.log(err);
    });

    db_test.insert({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [req.body.lng, req.body.lat]
        },
        "properties": {
            'date': new Date(),
            'species': req.body.name,
            'confidence': req.body.confidence,
            'valid_name': 'user_verified'
        }
    }, function(err, body) {
        console.log(err);
        if (!err)
            res.json(body);
    })
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

module.exports = router;

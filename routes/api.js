//
'use strict';
require('dotenv').load();
//

const fs = require('fs');
const express = require('express');
const request = require('request');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const bodyParser = require('body-parser');

const util = require('../custom_modules/util');
const geoJson = require('../custom_modules/geotagging');
const connect = require('../custom_modules/connect');

const credentials = connect.getCredentials();
const sanitizeInput = util.sanitizeInput;
const dbUrl = credentials.cloudantNoSQLDB[0].credentials.url;

const cloudant = require('cloudant')(dbUrl);
const db_class = cloudant.use('classes');
const db_obs = cloudant.use('observations');
const db_test = cloudant.use('test');

const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json());

const VR3 = require('watson-developer-cloud/visual-recognition/v3');
const vr = new VR3({
  api_key: credentials.watson_vision_combined[0].credentials.api_key,
  version_date: VR3.VERSION_DATE_2016_05_20
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

const upload = multer({storage: storage});

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

router.post('/classify', upload.single('file'), (req, res) => {

    const params = {
        image_file: fs.createReadStream(req.file.path),
        classifier_ids: 'TexasInvasives_190947980'
    }
    geoJson.extractData('./' + req.file.path).then((data) => {
        let match;
        let coordinates = geoJson.extractLatLng(data) || '';
        vr.classify(params, (error, results) => {
            if (error) {
                console.error(error);
            } else {
                match = util.calcMatch(results);
                db_class.get(match.class.replace(' ', '_'), (err, body) => {
                    res.json({
                      coordinates: coordinates,
                      properties: body.data,
                      confidence: match.score,
                      path: req.file.path,
                      filename: req.file.filename,
                      size: req.file.size
                    });
                });
            }
        });
    }).catch((error) => {
        let coordinates = '';
        let match;
        vr.classify(params, (error, results) => {
            if (error) {
                console.error(error);
            } else {
                match = util.calcMatch(results);
                db_class.get(match.class.replace(' ', '_'), (err, body) => {
                    res.json({
                      coordinates: coordinates,
                      properties: body.data,
                      confidence: match.score,
                      path: req.file.path,
                      filename: req.file.filename,
                      size: req.file.size
                    });
                });
            }
        });
    });
});

router.delete('/store', (req, res) => {
  fs.unlink('./' + req.body.path, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.json(200);
    }
  });
});

router.post('/store', (req, res) => {
    console.log(req.body);
    let file = fs.createReadStream('./' + req.body.path);
    let results;
    request({
        url: `https://dal.objectstorage.open.softlayer.com/v1/AUTH_7defd160d60c4e43b5f9dd6691e7e1a0/images/${req.body.filename}`,
        method: 'PUT',
        headers: {
            'X-Auth-Token': req.app.get('storageToken'),
            'Content-type': 'application/octet-stream',
            'Content-length': req.body.size
        },
        body: file
    }, (err, response) => {
        if (err) {
          console.error(err);
          fs.unlink('./' + req.body.path);
        } else {
          fs.unlink('./' + req.body.path);
        }
    });
    if (req.body.lng) {
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
            }
        )
    } else {
        db_test.insert({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": ""
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
            }
        )
    }
});

///////////////////////////////////////////////////////////////////////////////
// FIN
module.exports = router;
///////////////////////////////////////////////////////////////////////////////

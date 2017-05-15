'use strict';

const fs = require('fs');
const express = require('express');
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart();

const router = express.Router();

let db,
    cloudant;
const dbCredentials = {
    dbName: 'my_sample_db'
};

// custom exports
const util = require('../modules/util');
const dbInit = require('../modules/db_init');
const attach = require('../modules/attach');

// functions
const insertAttachment = attach.insertAttachment;
const createResponseData = util.createResponseData;
const sanitizeInput = util.sanitizeInput;
const saveDocument = util.saveDocument;
const initDBConnection = dbInit.initDBConnection;
const getDBCredentialsUrl = dbInit.getDBCredentialsUrl;

dbCredentials.url = initDBConnection(getDBCredentialsUrl);
cloudant = require('cloudant')(dbCredentials.url);

// check if DB exists if not create
cloudant.db.create(dbCredentials.dbName, (err, res) => {
    if (err)
        console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
});

db = cloudant.use(dbCredentials.dbName);

///////////////////////////////////////////////////////////////////////////////

router.get('/attach', (request, response) => {
    var doc = request.query.id;
    var key = request.query.key;

    db.attachment.get(doc, key, (err, body) => {
        if (err) {
            response.status(500);
            response.setHeader('Content-Type', 'text/plain');
            response.write('Error: ' + err);
            response.end();
            return;
        }

        response.status(200);
        response.setHeader("Content-Disposition", 'inline; filename="' + key + '"');
        response.write(body);
        response.end();
        return;
    });
});

router.post('/attach', multipartMiddleware, (request, response) => {
    console.log("Upload File Invoked..");
    let id;

    db.get(request.query.id, (err, doc) => {
        let name;
        let value;
        let file;
        let newPath;

        if (!doc) {
            id = '-1';
        } else {
            id = doc.id;
        }

        name = sanitizeInput(request.query.name);
        value = sanitizeInput(request.query.value);

        file = request.files.file;
        newPath = './public/uploads/' + file.name;

        insertAttachment(db, file, doc._id, doc._rev, name, value, response);
    });

});

module.exports = router;

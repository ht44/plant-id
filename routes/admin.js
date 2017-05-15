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

// functions
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

router.get('/favorites/attach', function(request, response) {
    var doc = request.query.id;
    var key = request.query.key;

    db.attachment.get(doc, key, function(err, body) {
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

router.post('/favorites/attach', multipartMiddleware, function(request, response) {

    console.log("Upload File Invoked..");
    console.log('Request: ' + JSON.stringify(request.headers));

    var id;

    db.get(request.query.id, function(err, existingdoc) {

        var isExistingDoc = false;
        if (!existingdoc) {
            id = '-1';
        } else {
            id = existingdoc.id;
            isExistingDoc = true;
        }

        var name = sanitizeInput(request.query.name);
        var value = sanitizeInput(request.query.value);

        var file = request.files.file;
        var newPath = './public/uploads/' + file.name;
        var insertAttachment = function(file, id, rev, name, value, response) {

            fs.readFile(file.path, function(err, data) {
                if (!err) {

                    if (file) {

                        db.attachment.insert(id, file.name, data, file.type, {
                            rev: rev
                        }, function(err, document) {
                            if (!err) {
                                console.log('Attachment saved successfully.. ');

                                db.get(document.id, function(err, doc) {
                                    console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));

                                    var attachements = [];
                                    var attachData;
                                    for (var attachment in doc._attachments) {
                                        if (attachment == value) {
                                            attachData = {
                                                "key": attachment,
                                                "type": file.type
                                            };
                                        } else {
                                            attachData = {
                                                "key": attachment,
                                                "type": doc._attachments[attachment]['content_type']
                                            };
                                        }
                                        attachements.push(attachData);
                                    }
                                    var responseData = createResponseData(
                                        id,
                                        name,
                                        value,
                                        attachements);
                                    console.log('Response after attachment: \n' + JSON.stringify(responseData));
                                    response.write(JSON.stringify(responseData));
                                    response.end();
                                    return;
                                });
                            } else {
                                console.log(err);
                            }
                        });
                    }
                }
            });
        }
        if (!isExistingDoc) {
            existingdoc = {
                name: name,
                value: value,
                create_date: new Date()
            };

            // save doc
            db.insert({
                name: name,
                value: value
            }, '', function(err, doc) {
                if (err) {
                    console.log(err);
                } else {

                    existingdoc = doc;
                    console.log("New doc created ..");
                    console.log(existingdoc);
                    insertAttachment(file, existingdoc.id, existingdoc.rev, name, value, response);

                }
            });
///////////////////////////////////////////////////////////////////////////////
        } else {
            console.log('Adding attachment to existing doc.');
            console.log(existingdoc);
            insertAttachment(file, existingdoc._id, existingdoc._rev, name, value, response);
        }
///////////////////////////////////////////////////////////////////////////////
    });

});

router.post('/favorites', function(request, response) {

    console.log("Create Invoked..");
    console.log("Name: " + request.body.name);
    console.log("Value: " + request.body.value);

    // var id = request.body.id;
    var name = sanitizeInput(request.body.name);
    var value = sanitizeInput(request.body.value);

    saveDocument(null, name, value, response);

});

router.delete('/favorites', function(request, response) {

    console.log("Delete Invoked..");
    var id = request.query.id;
    // var rev = request.query.rev; // Rev can be fetched from request. if
    // needed, send the rev from client
    console.log("Removing document of ID: " + id);
    console.log('Request Query: ' + JSON.stringify(request.query));

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            db.destroy(doc._id, doc._rev, function(err, res) {
                // Handle response
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
            });
        }
    });

});

router.put('/favorites', function(request, response) {

    console.log("Update Invoked..");

    var id = request.body.id;
    var name = sanitizeInput(request.body.name);
    var value = sanitizeInput(request.body.value);

    console.log("ID: " + id);

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            console.log(doc);
            doc.name = name;
            doc.value = value;
            db.insert(doc, doc.id, function(err, doc) {
                if (err) {
                    console.log('Error inserting data\n' + err);
                    return 500;
                }
                return 200;
            });
        }
    });
});

router.get('/favorites', function(request, response) {

    console.log("Get method invoked.. ")

    // db = cloudant.use(dbCredentials.dbName);
    var docList = [];
    var i = 0;
    db.list(function(err, body) {
        if (!err) {
            var len = body.rows.length;
            body.rows.forEach(function(document) {

                db.get(document.id, {
                    revs_info: true
                }, function(err, doc) {
                    if (!err) {
                        if (doc['_attachments']) {

                            var attachments = [];
                            for (var attribute in doc['_attachments']) {

                                if (doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
                                    attachments.push({
                                        "key": attribute,
                                        "type": doc['_attachments'][attribute]['content_type']
                                    });
                                }
                                // console.log(attribute + ": " + JSON.stringify(doc['_attachments'][attribute]));
                            }
                            var responseData = createResponseData(
                                doc._id,
                                doc.name,
                                doc.value,
                                attachments);

                        } else {
                            var responseData = createResponseData(
                                doc._id,
                                doc.name,
                                doc.value, []);
                        }

                        docList.push(responseData);
                        i++;
                        if (i >= len) {
                            response.write(JSON.stringify(docList));
                            console.log('ending response...');
                            response.end();
                        }
                    } else {
                        console.log(err);
                    }
                });

            });

        } else {
            console.log(err);
        }
    });

});

module.exports = router;

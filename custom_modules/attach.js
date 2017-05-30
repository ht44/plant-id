const attach = module.exports = (() => {

  'use strict';
  const fs = require('fs');
  const util = require('../custom_modules/util');
  const createResponseData = util.createResponseData;

  return {
    insertAttachment: insertAttachment
  };

  /////////////////////////////////////////////////////////////////////////////

  function insertAttachment (db, file, id, rev, name, value, response) {

    if (!file) return;

    fs.readFile(file.path, (err, data) => {

      if (err) return;

      db.attachment.insert(id, file.name, data, file.type, {
        rev: rev
      }, (err, document) => {

        if (err) {
          console.log(err);
          return;
        }

        console.log('Attachment saved successfully.. ');

        db.get(document.id, (err, doc) => {
          let attachements = [];
          let attachData;
          let responseData;

          for (let attachment in doc._attachments) {
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

          responseData = createResponseData(
            id,
            name,
            value,
            attachements
          );

          response.write(JSON.stringify(responseData));
          response.end();
          return;
        });
      });
    });
  };

})();

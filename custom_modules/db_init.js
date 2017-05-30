const dbInit = module.exports = (() => {

  'use strict';
  const fs = require('fs');

  return {
    initDBConnection: initDBConnection,
    getDBCredentialsUrl: getDBCredentialsUrl
  };

  /////////////////////////////////////////////////////////////////////////////

  function initDBConnection(getDBCredentialsUrl) {
      if (process.env.VCAP_SERVICES) {
          return getDBCredentialsUrl(process.env.VCAP_SERVICES);
      } else {
          // Alternately you could point to a local database here instead of Bluemix
          // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
          return getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
      }
  }

  function getDBCredentialsUrl(jsonData) {
      var vcapServices = JSON.parse(jsonData);
      return vcapServices.cloudantNoSQLDB[0].credentials.url;
  }
})();

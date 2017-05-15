const dbInit = module.exports = (() => {

  'use strict';
  const fs = require('fs');

  return {
    initDBConnection: initDBConnection,
    getDBCredentialsUrl: getDBCredentialsUrl
  };

  function initDBConnection(getDBCredentialsUrl) {
      if (process.env.VCAP_SERVICES) {
          return getDBCredentialsUrl(process.env.VCAP_SERVICES);
      } else {
          // When running this app locally you can get your Cloudant credentials
          // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
          // Variables section for an app in the Bluemix console dashboard).
          // Once you have the credentials, paste them into a file called vcap-local.json.
          // Alternately you could point to a local database here instead of Bluemix
          // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
          return getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
      }
  }

  function getDBCredentialsUrl(jsonData) {
      var vcapServices = JSON.parse(jsonData);
      // Pattern match to find the first instance of a Cloudant service in
      // VCAP_SERVICES. If you know your service key, you can access the
      // service credentials directly by using the vcapServices object.
      for (var vcapService in vcapServices) {
          if (vcapService.match(/cloudant/i)) {
              return vcapServices[vcapService][0].credentials.url;
          }
      }
  }
})();

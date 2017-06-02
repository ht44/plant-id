const createGeoJson = module.exports = (() => {
  'use strict';
  const ExifImage = require('exif').ExifImage;

  return {
    extractData: extractData,
    extractLatLng: extractLatLng
  };

  function dmToDD(latLng) {
    let deger = (((latLng[2] / 60) + latLng[1]) / 60);
    return latLng[0] + deger
  }

  function extractData(userImagePath) {
    let extract = new Promise((resolve, reject) => {
      new ExifImage({
        image: userImagePath
      }, (error, exifData) => {
        if (error){
            reject(error)
        }
        else{
            resolve(exifData)
        }
      });
    })
    return extract;
  }

  function extractLatLng(data) {
    console.log(data);
    let rawLng = data.gps.GPSLongitude;
    let rawLat = data.gps.GPSLatitude;
    let latDD;
    let lngDD;
    latDD = dmToDD(rawLat);
    if (data.gps.GPSLongitudeRef === 'W') {
      lngDD = dmToDD(rawLng) * -1;
    } else {
      lngDD = dmToDD(rawLng);
    }
    return [latDD, lngDD];
  }

})();

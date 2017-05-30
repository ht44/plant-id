// npm install exif
// https://www.npmjs.com/package/exif

var ExifImage = require('exif').ExifImage;
try {
    new ExifImage({
        image: '/Users/jamesproett/Desktop/20170120_152451.jpg'
    }, function(error, exifData) {
        if (error) {
            console.log(error);
        } else {
            rawLng = exifData.gps.GPSLongitude
            rawLat = exifData.gps.GPSLatitude
            latDD = dmtToDD(rawLat)
            if (exifData.gps.GPSLongitudeRef === 'W') {
                lngDD = dmtToDD(rawLng) * -1
            } else {
                lngDD = dmtToDD(rawLng);
            }

            geoJson = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [latDD, lngDD]
                },
                "properties": {
                    "name": "obs",
                    "date": new Date(),
                    "species": "placeholder"
                }
            }
            console.log(geoJson);
        }

    });
} catch (error) {
    console.log('Error: ' + error.message);
}

function dmtToDD(latLgn) {
    let deger = (((latLgn[2] / 60) + latLgn[1]) / 60);
    return latLgn[0] + deger

}

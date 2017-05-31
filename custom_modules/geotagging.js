function createGeoJson (userImagePath, userImageSpecies) {
    var ExifImage = require('exif').ExifImage;
    try {
        new ExifImage({
            image: userImagePath
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
                let geoJson = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [latDD, lngDD]
                    },
                    "properties": {
                        "date": new Date(),
                        "symbol": "ULPU",
                        "species": userImageSpecies,
                        "valid_name": 'userVarified'
                    }
                }
                return geoJson
            }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
    function dmtToDD(latLgn) {
        let deger = (((latLgn[2] / 60) + latLgn[1]) / 60);
        return latLgn[0] + deger
    }
}

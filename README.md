# Plant ID (Galvanize q3 Project)
### by Hayden Turek and James Proett

![Technologies](./public/images/bestone.png?raw=true)


[https://plant-id.mybluemix.net/](https://plant-id.mybluemix.net/)

If you couldn't tell by the name, "Plant ID" did not originate as an idea; it began simply as a desire to use IBM Watson Visual Recognition for plant taxonomy. The idea itself - train an instance of the service to identify invasive plant species prolific in the state of Texas - was derived from much research.

It was the kind of research that gets inspired by constraint and creativity. Unless you are willing to incur overhead, which we were not, IBM limits Bluemix developers to one Watson Visual Recognition custom classifier and a maximum of 5,000 training images for that classifier.

Having found the default classifier lacking and wishing to train our own, limiting the scope was thus mission critical, and so we two laypeople set out in search of education.

Our initial thought was to approach the University of Texas, but it was made clear early on that they would not help us. Though this was disheartening, we did not give up, deciding then to visit a number of government buildings in downtown Austin where we met and talked with a whole host of wonderful civil servants.

Special thanks to Louis René Barrera (Environmental Conservation Information Specialist, City of Austin Natural Resources Division), Christopher Ryan Sanchez (Culture and Arts Education Specialist, Austin Parks & Recreation Natural Resources Management - Zilker Botanical Gardens), Cynthia D. Klemmer, Ph.D. (Environmental Conservation Program Manager, Austin Parks & Recreation Nature Based Programs), Kayla Miloy (Environmental Specialist, Travis County Transportation and Natural Resources), Allison Hardy (Senior IT Geospatial Analyst, Austin Parks & Recreation) and Kimberly McNeeley (Acting Director, Austin Parks & Recreation Office of the Director) for their help, time and kindness.

Ultimately, we, drawing on things learned from those friendly folks, decided to go with invasive plant species in Texas, mostly because it checked every box important to us: relevant, useful, and feasible. Since there are only a few species actively threatening the state ecosystem at a given time, we were able to provide a greater number of training examples for each species, making each respective class highly accurate.

### A Novel Solution

Perhaps the most interesting facet of this admittedly overly ambitious undertaking was the solution by which we solved the problem of the data.

Those familiar with cognitive will know that the type of images needed for high confidence are not the kind typically kept by governments or universities. The image set for each class needed to be large and visibly diverse for us to have any hope of developing an application halfway usable.

After days scouring the web for publicly available datasets and finding none, we came across something interesting: a website called TexasInvasives.org and the "Invaders of Texas" program.

According to the site, "The Invaders of Texas Program is an innovative campaign whereby volunteer 'citizen scientists' are trained to detect the arrival and dispersal of invasive species in their own local areas. That information is delivered into a statewide mapping database and to those who can do something about it. The premise is simple. The more trained eyes watching for invasive species, the better our chances of lessening or avoiding damage to our native landscape."

"That information" **included images:** crowd-collected, expert-validated images shot with different cameras, in different locations, with different lighting, from different angles, by different people - *all* hosted at TexasInvasives.org. It wasn't a coherent dataset, but we knew almost instantly that if we could mine and organize it, it wouldn't just be a dataset; it would be the *ultimate* dataset.

Faced with the management of such a large dataset (60,000 images), we quickly realized that small "helper" programs would need to be written in order to automate as much of the process as possible.

For example, here is a python module we wrote to handle our image processing and training calls. Notice that although we were entirely unfamiliar with the language, we nevertheless implemented advanced object-oriented programming concepts such as classical inheritance and modular REPL compatibility.

```python
import os
import math
import shutil
from PIL import Image
from watson_developer_cloud import VisualRecognitionV3
watson = VisualRecognitionV3('2016-05-20',
                             api_key=os.environ['API_KEY'])
def api():
    return dir(watson)
def docs():
    help(VisualRecognitionV3)

class DataSet:
    def __init__(self, path):
        self.memory = []
        self.children = []
        self.path = os.path.abspath(path)
        self.basename = os.path.basename(self.path)

    def populate(self):
        for root, dirs, files in os.walk(self.path):
            if (root == self.path):
                self.children.extend(list(map(
                    lambda ch: os.path.join(self.path, ch), dirs)))
                continue
            self.memory.append(ImageSet(root, files))
        return self

    def get_names(self):
        return list(map(lambda s: os.path.basename(s).replace('_', ' '),
                        self.children))

class ImageSet(DataSet):
    def __init__(self, root, files):
        super().__init__(root)
        self.children.extend(list(map(
            lambda f: os.path.join(root, f), files[1:])))

    def populate(self):
        for f in self.children:
            image = Image.open(f)
            self.memory.append(image)
        del image
        return self

class ImageProcessor:
    def __init__(self, data_set, output_path):
        self.memory = []
        self.data_set = data_set[:]
        self.output_path = output_path

    def gen_tree(self):
        os.mkdir(self.output_path)
        for image_set in self.data_set:
            os.mkdir(os.path.join(self.output_path,
                                  image_set.basename))
        os.mkdir(os.path.join(self.output_path, 'zips'))

    def conform(self, image, max_w):
        w, h = image.size
        if w >= max_w:
            new_size = max_w, math.floor(h * (max_w / w))
            return image.resize(new_size)
        else:
            return image

    def read_dimensions(self):
        result = []
        for image_set in self.data_set:
            for child in image_set.children:
                image = Image.open(child)
                result.append(image.size)
                image.close()
        return sorted(result)

    def batch_conform(self, max_w, kind='jpeg'):
        for image_set in self.data_set:
            destination = os.path.join(self.output_path,
                                       image_set.basename)
            for child in image_set.children:
                image = Image.open(child)
                filename = os.path.basename(image.filename)
                self.conform(image, max_w).save(os.path.join(destination, filename), kind)
                image.close()

    def batch_compress(self):
        for image_set in self.data_set:
            base = os.path.join(self.output_path,
                                'zips', image_set.basename)
            root = os.path.join(self.output_path,
                                image_set.basename)
            shutil.make_archive(base, 'zip', root)

# Plans to make the module executable
if __name__ == '__main__':
    import sys
#
```

This is the script we wrote to collect the identification strings necessary for scraping TexasInvasives.org and to recreate that database in Cloudant. Some noteworthy features here include a recursive throttle designed to beat the throughput limitation imposed by Cloudant Lite as well as GeoJson object construction thru JavaScript "classes".

```javascript
'use strict';
const fs = require('fs');
const request = require('request');

class GeoJson {
    constructor(vectorType, obsId, date, symbol, species, lat, lng, abundence, validName) {
        this.type = "Feature";
        this.geometry = {
            type: vectorType,
            coordinates: [lat, lng]
        };
        this.properties = {
            obs_id: obsId,
            date: date,
            symbol: symbol,
            species: species,
            abundence: abundence,
            valid_name: validName
        };
    }
};

// recursive throttle to beat Cloudant throughput limitation
let counter = 0;
function slowWrite(arr) {
    setTimeout(() => {
        request({
          uri: 'https://aa9b789f-b131-4bda-b585-912ff49352c8-bluemix:d9b31194f2bcc43c8c5205fba618330c90bd113feb22095d1faa3c6cfaea2791@aa9b789f-b131-4bda-b585-912ff49352c8-bluemix.cloudant.com/observations',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(arr[counter])
        });
        if ((arr[counter + 1]) !== undefined) {
            ++counter;
            slowWrite(arr);
        }
    }, 151);
}

// collect ids for cURL scraping, write GeoJson to Cloudant
fs.readdir('./csv_files/', 'utf8', (err, files) => {
    let output = [];
    files.forEach(filename => {
        let contents = fs.readFileSync(`./csv_files/${filename}`, 'utf8');
        let result;

        contents.split('\n').forEach(record => {
            if (/^\d+$/.test((record.split(',')[0]))) {
                let arr = record.split(',');
                result = new GeoJson('Point', arr[0], arr[1], arr[2], arr[3], arr[7], arr[8], arr[13], arr[15]);
                output.push(result);
                result = null;
            }
        });
    });
    fs.writeFile('./temp.json', JSON.stringify(output), (err, data) => {
      console.log('done');
    })
    slowWrite(output);
});
```

While TexasInvasives.org opened themselves to web indexing by exposing sequential, public-facing ids for every image on their site (making things easy for us), Wildflower.org featured no such vulnerability. The helper program below exploits a pattern we discovered that says the path for each of their true image files can be derived by altering the dimensions in the path to the associated thumbnail.

```javascript
'use strict';

const TRUE_DIMENSIONS = '640x480'

const fs = require('fs');
const output = new Array();
const pattern = /160x120(.*?)JPG/ig;
let normal = new Array();

// cURL for each page, write to ./raw_html, run the following:
fs.readdir('./raw_html', 'utf8', (err, files) => {
  files.forEach(filename => {
    let contents = fs.readFileSync(`./raw_html/${filename}`, 'utf8');
    let result = contents.match(pattern).join(',');
    output.push(result);
  })

  output.join(',').split(',').forEach(key => {
    key = key.replace('160x120', TRUE_DIMENSIONS);
    normal.push(key.substring(0, key.length - 4));
  })

// then glob the stdout with cURL
  console.log(normal.join(','));
  fs.writeFile('./output.txt', normal.join(','), (err) => {
    if (err) console.error(err);
  });
});
```

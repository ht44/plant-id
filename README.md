# Plant ID (Galvanize q3 Project)
### by Hayden Turek and James Proett

![Technologies](./public/images/withexpress.png?raw=true)


[https://plant-id.mybluemix.net/](https://plant-id.mybluemix.net/)

### Abstract

The intention of "Plant ID" is to classify and map instances of invasive plant species in the Austin area (and more broadly the entire state of Texas). The current effort to mitigate non-native plant species is a task limited to specialists who have an understanding of native/non-native plants and their diverse morphology at different developmental as well as seasonal stages. This project seeks lower the barrier of entry for contributing to mitigation efforts by incorporating image recognition technology. A layperson can now go out and run an image of a plant trough Plant-ID and with relative confidence classify an instance of an invasive plant. If the description and image provided match the field observation, the user can submit their photo where the location, species name, and confidence of the match is stored in our database, where it can later be accessed and validated by experts. We belive that this crowdsourced approach to identifying and chronicling instances of invasive plants can take a great deal of strain off the Parks Department resources.

### Background

"Plant ID" did not originate as an idea; it began simply as a desire to use IBM Watson Visual Recognition for plant taxonomy. The idea itself - train an instance of the service to identify invasive plant species prolific in the state of Texas - was derived from much research. It was the kind of research that gets inspired by constraint and creativity. Unless you are willing to incur overhead, which we were not, IBM limits Bluemix developers to one Watson Visual Recognition custom classifier and a maximum of 5,000 training images for that classifier. Having found the default classifier lacking and wishing to train our own, limiting the scope was thus mission critical, and so we set out in search of education.

Our initial thought was to approach the University of Texas, but it was made clear early on that they would not help us. Though this was disheartening, we did not give up, deciding then to visit a number of government buildings in downtown Austin where we met and talked with a whole host of helpful civil servants.

Special thanks to Louis René Barrera (Environmental Conservation Information Specialist, City of Austin Natural Resources Division), Christopher Ryan Sanchez (Culture and Arts Education Specialist, Austin Parks & Recreation Natural Resources Management - Zilker Botanical Gardens), Cynthia D. Klemmer, Ph.D. (Environmental Conservation Program Manager, Austin Parks & Recreation Nature Based Programs), Kayla Miloy (Environmental Specialist, Travis County Transportation and Natural Resources), Allison Hardy (Senior IT Geospatial Analyst, Austin Parks & Recreation) and Kimberly McNeeley (Acting Director, Austin Parks & Recreation Office of the Director) for their help, time and kindness.

Drawing on the things learned, we ultimately decided to go with invasive plant species in Texas, mostly because it checked every box important to us: relevant, useful, and feasible. Since there are only a few species actively threatening the state ecosystem at a given time, we were able to provide a greater number of training examples for each species, making each respective class highly accurate.

### A Novel Solution

Perhaps the most interesting facet of this admittedly overly ambitious undertaking was the solution by which we solved the problem of the data.

Those familiar with cognitive will know that the type of images needed for high confidence are not the kind typically kept by governments or universities. The image set for each class needed to be large and visibly diverse for us to have any hope of developing an application halfway usable.

After days scouring the web for publicly available datasets and finding none, we came across something interesting: a website called TexasInvasives.org and the "Invaders of Texas" program...

According to the site, "The Invaders of Texas Program is an innovative campaign whereby volunteer 'citizen scientists' are trained to detect the arrival and dispersal of invasive species in their own local areas. That information is delivered into a statewide mapping database and to those who can do something about it. The premise is simple. The more trained eyes watching for invasive species, the better our chances of lessening or avoiding damage to our native landscape."

Then it hit us: "That information" **included images:** crowd-collected, expert-validated images shot with different cameras, in different locations, with different lighting, from different angles, by different people - *all* hosted at TexasInvasives.org. It wasn't a coherent dataset, but we knew almost instantly that if we could only mine and organize it, it wouldn't just be a dataset; it would be the *ultimate* dataset.

It was off to the races at this point, and before long we had scraped 15,000 images as well as associated metadata that included the location of each observation (which we would later use to compile an insight map). Not only that, but we did the same @ Wildflower.org for a total haul of 60,000 images: 15,000 positive examples and 45,000 negative. * We did not have time to train negative examples, but it is important to note that we took it into thought and collected all the data necessary to do so in the future.

That said, from our 15,000-image harvest, we were able to hand-select just enough (2,400) examples to train an instance of Watson Visual Recognition Version 3 to quite accurately identify **Ailanthus altissima, Albizia julibrissin, Arundo donax, Bothriochloa ischaemum var. songarica, Cynodon dactylon, Lantana camara, Ligustrum lucidum, Ligustrum quihoui, Ligustrum sinense, Lonicera japonica, Macfadyena unguis cati, Melia azedarach, Paspalum dilatatum, Paspalum notatum, Paspalum urvillei, Photinia serratifolia, Phyllostachys aurea, Pistacia chinensis, Pyracantha coccinea, Rapistrum rugosum, Sorghum halepense, Tamarex ramosissima, Torilis arvensis, and Triadica sebifera.**

As was mentioned, we did not have time to train negative examples (we only had one week to develop the software) and so if you want to test it out, try grabbing a picture of, say, **Ailanthus altissima** off of Google images, put it through and see if you get a match! Or, take a picture of one of the plants in the wild, just know that if the plant you photograph is not one of the species outlined above it will still register as the invasive species it most resembles. When we do find the time to retrain the instance with negative examples (there's room for 2,600) we intend to have the program make decisions based on threshold such that harmless plants are not mistaken for their invasive counterparts.

### A New Bearing

The discovery of TexasInvasives.org and the Invaders of Texas program not only saved our project; it made our project what it is.

As we worked, we began to view our project more and more as an extension of the effort. We started to imagine how much money, how many man-hours it must require, to validate 15,000 amateur plant observations, because that's how TexasInvasives.org works: users - amateur "citizen scientists" - sign up and get a pamphlet to help them identify the plants. They go around and report invasive plant occurrences by taking pictures and uploading them to the site. Then, an expert looks at the pictures and determines whether or not the plant is what it was thought to have been, and it is dealt with accordingly.

Well, what if those volunteers could spend their finite and valuable time confirming observcations that are already more likely to be accurate? What if observations that were likely to be false never made it to a human's desk?

This thought in its conclusive form motivated us to willingly undertake one of the most challenging, rewarding, yet tragically inconspicuous components of our project: we engineered a conduit for storing the user-supplied images.

If a user so decides, the image they submitted in order to identify the plant they came accross in the wild gets placed in unstructured object storage, and a reference to that storage address is written (along with the date of photography, suggested species name, cognitive confidence, and the latitude and longitude of the sighting, if the image was geotagged) to our NoSQL database.

The reason why we didn't just store the images as attachments in Cloudant was because we wanted to be able to say, at the end of all this, that we developed our application with an eye towards improving the dataset. Storing the images without structure as large binary objects is cost-effective, and we wanted to pursue a scaleable model, such that, on the off chance someone with real resources did take an interest in our application, they could retrain our instance of Watson Visual Recognition with greater than 5,000 examples, using the images submitted by our users. 

We take pride in the fact that we gave this kind of consideration to the future, and that we were less interested in making an application that presents well than we were in producing something truly special.

### Helper Programs

Faced with the management of such a large dataset (60,000 images), we quickly realized that small "helper" programs would need to be written in order to automate as much of the process as possible.

For example, here is a python module we wrote to handle our image processing and training calls. Notice that although we were entirely unfamiliar with the language, we nevertheless implemented advanced object-oriented programming concepts such as classical inheritance and modularity.

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

### Draft Intro
The intention of Plant-ID is to classify and map instances of invasive plant species in the Austin area (and more broadly the entire state of Texas). Currently efforts to mitigate non-native plant species is a task limited to specialists who have an understanding of native/non-native plants and their diverse morphology at different developmental as well as seasonal stages. This project seeks lower the barrier of entry for contributing to mitigation efforts by incorporating image recognition technology. A layperson can now go out and run an image of a plant trough Plant-ID and with relative confidence classify an instance of an invasive plant. If the description and image provided match the field observation, the user can submit their photo where the location, species name, and confidence of the match is stored in our database. This crowd sourced approach to identifying and chronicling instances of invasive plants can take a great deal of strain off the Parks Department resources, by having a single database of verified citing’s of invasive plants that every citizen can easily use.

A key challenge in creating this service was having a robust image classifier. IBM’s Watson Visual Recognition software is utilized for this project. In order to yield accurate responses from this service on such a specific desired output, training a custom classifier is necessary. In order to train a classifier, numerous images of each class are required (IBM suggests a minimum of 50 images per class). In the case of this project each class represents an individual plant species. It is also advantageous to train the classifier with negative images of native plants in order to reduce the occurrence of false positives.

In order to accomplish the goal of training a robust classifier, the problem arises of how one can get a diverse set of images, that is numerous enough to distinguish between (in many cases) similar plants. An invaluable resource to this project was TexasInvasives.org. This website is a collection of ~20,000 verified images of ~70 different invasive plant species common to Texas. Each species has downloadable CSV file with each image’s: location (in latitude, longitude), specie’s common name, scientific name, date each recording was made, abundance a crucially an index corresponding to each image file. The CSV files for each species were parsed and converted into geoJSON format, so they could be stored in our database for mapping purposes (explained in greater detail in the “Mini apps” section). The indexes of each image file for a particular species is used to construct a cURL script that writes every image to a file. All ~20,000 images were stored and saved for processing. Additionally, several other available government resources were exploited to get the desired negative images (40,000 native images were collected using similar cURL requests for that of the invasive images).

Based on the quality and quantity of invasive images for each of the ~70 species the list is shorted to 24 of the best quality image sets, where the number of images is over 100. The species the classifier will recognize are as follows:

Ailanthus altissima
Albizia julibrissin
Arundo donax
Bothriochloa ischaemum var. songarica
Cynodon dactylon
Lantana camara
Ligustrum lucidum
Ligustrum quihoui
Ligustrum sinense
Lonicera japonica
Macfadyena unguis cati
Melia azedarach
Paspalum dilatatum
Paspalum notatum
Paspalum urvillei
Photinia serratifolia
Phyllostachys aurea
Pistacia chinensis
Pyracantha coccinea
Rapistrum rugosum
Sorghum halepense
Tamarex ramosissima
Torilis arvensis
Triadica sebifera

### Walk through

![Home/DOCS](./public/images/Presentation1/Slide1.jpg?raw=true)
![Classify](./public/images/Presentation1/Slide2.jpg?raw=true)
![Click Upload](./public/images/Presentation1/Slide3.jpg?raw=true)
![Upload](./public/images/Presentation1/Slide4.jpg?raw=true)
![Returns guess](./public/images/Presentation1/Slide5.jpg?raw=true)
![Add to DB](./public/images/Presentation1/Slide6.jpg?raw=true)
![Visualize](./public/images/Presentation1/Slide7.jpg?raw=true)

### Refrences 

Elias, T. 1980. The Complete Trees of North America: Field Guide and Natural History. Book Division, Times Mirror Magazines, Inc. New York. 

Gleason, H.A., and A. Cronquist. 1991. Manual of Vascular Plants of Northeastern United States and Adjacent Canada. New York Botanical Garden. Bronx, New York. 

Hu, S.Y. 1979. Ailanthus. Arnoldia 39(2): 29-50. 

Mergen, F. 1959. A toxic principle in the leaves of Ailanthus. Bot. Gazette 121: 32-36. 

Pannill, Philip. 1995. Tree-of-Heaven Control. Maryland Department of Natural Resources Forest Service Stewardship Bulletin. 8 pp. 

Randall, J.M. and J. Marinelli. 1996. Invasive Plants: Weeds of the Global Garden. Brooklyn Botanic Garden, Handbook #149. 111 pp. 

Stipes, J. And M. Daughtery. 1998. Personal communication. 

Tennessee Exotic Pest Plant Council. Tree of Heaven. Tennessee Exotic Plant Management Manual. 1996 

The Nature Conservancy, California Regional Office. November 1988. Ailanthus altissima Element Stewardship Abstract Report (prepared by Marc Hoshovsky). Arlington, Virginia. 

Virginia Department of Conservation and Recreation and Virginia Native Plant Society. 1996. Invasive Alien Plant Species of Virginia: Tree-of-Heaven (Ailanthus altissima (Miller) Swingle).

Bonner, F.T., M.S. Hooda, D.P. Singh. 1992. Moisture determination on seeds of honey locust and mimosa. Tree Plant Note, USDA Forest Service 43(3):72-75. 

Bransby, D.I., S.E. Sladden, G.E. Aiken. 1992. Mimosa as a forage plant: a preliminary evaluation. Proceedings of the Forage Grasslands Conference. Georgetown, Texas; American Forage and Grassland Council 1:28-31. 

Gleason, H.A., A. Cronquist. 1991. Manual of vascular plants of northeastern United States and adjacent Canada. 2nd ed. The New York Botanical Garden, 910. 

Hartel, P.G., B.L. Haines. 1992. Effects of potential plant CO2 emissions of bacterial growth in the rhizosphere. Journal of Soil Biological Biochemistry and Science 24(3). 

Panizzi, A.R., F. Slansky, Jr. 1991. Suitability of selected legumes and the effect of nymphal and adult nutrition in the southern green stink bug (Hemiptera: Heteroptera: Pentatomidea). Journal of Econ-Entomology 84(1):103-113.

Miller, J.H. 2003. Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp

Hoshovsky, Marc. 1996. Element Stewardship Abstract: Arundo donax. The Nature Conservancy, Arlington, Virginia. 

Perdue, R.E. 1958. Arundo donax - source of musical reeds and industrial cellulose. Economic Botany 12(4):368-404. 

The Nature Conservancy. Giant Reed: Element Stewardship Abstract. In: Wildland Weeds Management & Research Program, Weeds on the Web. 

Tidwell, B. 1995. Native Habitat Restoration: Controlling Arundo donax. Monsanto Company.

Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp

USDA, NRCS. 2006. The PLANTS Database (http://plants.usda.gov, 7 November 2006). National Plant Data Center, Baton Rouge, LA 70874-4490 USA. (http://plants.usda.gov/java/profile?symbol=BOISS)

Langeland, K.A., et al. 2008. Identification and Biology of Nonnative Plants in Florida’s Natural Areas, Second Edition. University of Florida-IFAS Pub SP 257. 

University of Florida: Center for Aquatic and Invasive Plants (http://plants.ifas.ufl.edu/node/223)

Auckland Regional Council (ARC) 2002. Auckland Regional Pest Management Strategy 2002-2007

Henderson State University. Ligustrum quihoui. Accessed 19 August 2010 (http://www.hsu.edu/default.aspx?id=47318). 

Alfred Rehder, Manual of Cultivated Trees and Shrubs: Hardy in North America, The MacMillan Co., New York (1967), Bailey, L.H. and E.Z. Bailey, Hortus Third: A Concise Dictionary of Plants Cultivated in the United States and Canada, MacMillan Publishing Co., Inc., New York , (1977).)

Miller, James H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 

Swearingen, J., K. Reshetiloff, B. Slattery, and S. Zwicker. 2002. Plant Invaders of Mid-Atlantic Natural Areas. National Park Service and U.S. Fish & Wildlife Service, 82 pp.

Barden, L. S. and J. F. Matthews. 1980. Change in abundance of honeysuckle (Lonicera japonica) and other ground flora after prescribed burning of a piedmont pine forest. Castanea 45: 257-260. 

Dillenberg L.R., D.F. Whigham, A.H. Teramura, I.N. Forseth. 1993. Effects of below- and aboveground competition from the vines Lonicera japonica and Parthenocissus quinquefolia on the growth of the tree host Liquadambar stryraciflua. Oecologia 93:48-54. 

Fernald, M. L. 1989. Grays Manual of Botany. Biosystematics, Floristic and Phylogeny Series. Volume 2. T. R. Dudley, Editor. Dioscorides Press. Portland, OR. 1,632 pp. 

Gleason H. A. and A. Cronquist. The Illustrated Companion to Gleason and Cronquist's Manual of Vascular Plants of Northeastern United States and adjacent Canada. New York Botanic Garden, New York, NY. 937 pp. 

Kartesz, J. and C. Meacham Synthesis of the North American Flora. 

Nuzzo, V. Japanese honeysuckle. Element stewardship abstract for Lonicera japonica. The Nature Conservancy. 1815 North Lynn Street, Arlington VA, 22209. www.tncweeds.ucdavis.edu/esadocs.documnts/lonijap.html. Last updated April 15, 1997. 

Regehr, D. L. and D. R. Frey. 1988. Selective control of Japanese honeysuckle (Lonicera japonica). Weed Technology 2:139-143. 

Rhoads, A. F. and T. H. Block. 2002. The Plants of Pennsylvania, An Illustrated Manual. Morris Arboretum of the University of Pennsylvania. University of Pennsylvania Press, Philadelphia, PA. 1060 pp. 

Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp (USDA SRS).

Florida Exotic Pest and Plant Council. Macfadyena unguis-cati (L.) A. Gentry. Accessed 5 December 2008: http://www.fleppc.org/ID_book/Macfadyena%20unguis-cati.pdf. 

MacDonald, G., B. Sellers, K. Langeland, T. Duperron-Bond, and E. Ketterer-Guest. 2008. Cats Claw Vine. Center for Aquatic and Invasive Plants, University of Florida. Accessed 5 December 2008: http://aquat1.ifas.ufl.edu/node/259.

The Quiet Invasion: A Guide to Invasive Plants of the Galveston Bay Area (www.galvbayinvasives.org). Lisa Gonzalez and Jeff DallaRosa. Houston Advanced Research Center, 2006.

Lorence, David/Flynn, Tim. 1999. New naturalized plant records for the Hawaiian Islands. In: Evenhuis, Neal L. and Eldredge, Lucius G., eds. Records of the Hawaii Biological Survey for 1998. Part 2: Notes. Bishop Museum Occasional Papers. 59:3-6. 

Wagner, Warren L./Herbst, Derral R./Sohmer, S. H. 1999. Manual of the flowering plants of Hawaii. Revised edition. Bernice P. Bishop Museum special publication. University of Hawaii Press/Bishop Museum Press, Honolulu. 1919 pp. (two volumes).

USDA PLANTS Database. Accessed Dec. 2009: http://plants.usda.gov/java/profile?symbol=PHSE17.

The Quiet Invasion: A Guide to Invasive Plants of the Galveston Bay Area. Lisa Gonzalez and Jeff DallaRosa. Houston Advanced Research Center, 2006.

Swearingen, J., K. Reshetiloff, B. Slattery, and S. Zwicker. 2002. Plant Invaders of Mid-Atlantic Natural Areas. National Park Service and U.S. Fish & Wildlife Service, 82 pp.

Diggs, Jr., G. M., Lipscomb, B.L., and O'Kennon, R. J. Shinners and Mahler's Illustrated Flora of North Central Texas. Fort Worth, TX: Botanical Research Institute; 1999; p. 476. 

Hashem, A., Bowran, D., Piper, T. and Dhammu, H. 2001. Resistance of wild radish (Raphanus raphanistrum) to acetolacetate synthase-inhibiting herbicides in the Western Australia wheat belt. Weed Technology 15:68-74. 

Kartesz, J.T. and C.A. Meacham. 1999. Synthesis of the North American Flora. North Carolina Botanical Garden, University of North Carolina at Chapel Hill. Chapel Hill, NC. [CD] 

Lemke, David E. and Worthington, Richard D. Brassica and Rapistrum (Brassicaceae) in Texas. The Southwestern Naturalist; June, 1991: pp. 194-196. 

Neiman, Bill*. Personal conversation 4/9/2000. *President, Native American Seed. 

Rollins, Reed C. The Cruciferae of Continental North America. Stanford, CA: Stanford University Press; 1993; p. 722. 

USDA, ARS, National Genetic Resources Program. Germplasm Resources Information Network - (GRIN). [Online Database] National Germplasm Resources Laboratory, Beltsville, Maryland. (http://www.ars-grin.gov/var/apache/cgi-bin/npgs/html) 

Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp (USDA SRS).

Baum, B.R. 1978. The genus Tamarix. The Israel Academy of Sciences and Humanities, Jerusalem.
Carman, J.G. and J.D. Brotherson. 1982. Comparisons of sites infested and not infested with saltcedar and Russian olive. Weed Science 30:360-364.
DeLoach, C.J., M.J. Pitcairn, and D. Woods. 1996. Biological control of saltcedar in Southern California. In: Joe DiTomaso and Carl E. Bell, eds., Proceedings of the Saltcedar Management Workshop, Rancho Mirage, California, pp. 30-31.
Howe, W.H. and F.L. Knopf. 1991. On the imminent decline of Rio Grande cottonwoods in central New Mexico. Southwestern Naturalist 36(2):218-224.
Hudson, Laura E. 1999. Climatic and hydrologic effects on the establishment of Tamarix ramosissima in the cold desert of northern Wyoming (Bighorn Lake). M.S. Thesis, University of Montana, Missoula.
Jackson, N.E. 1996. Chemical control of saltcedar (Tamarix ramosissima). In: Joe DiTomaso and Carl E. Bell, eds., Proceedings of the Saltcedar Management Workshop, Rancho Mirage, California, pp. 21-27.
The Nature Conservancy. Tamarisk: Element Stewardship Abstract. In: Wildland Weeds Management & Research Program, Weeds on the Web.

Brusati, E. and J.M. DiTomaso. 2005. Plant Assessment Form for Torilis arvensis. California Invasive Plant Inventory, California Invasive Plant Council. http://www.cal-ipc.org/paf/site/paf/440. [Accessed Dec 6 2014] 

Constance, Lincoln and Margriet Wetherwax. 2013. Torilis, in Jepson Flora Project (eds.) Jepson eFlora, http://ucjeps.berkeley.edu/cgi-bin/get_IJM.pl?tid=46743 [Accessed on Dec 5 2014] 

Dixon, Kiersten. July 2011. Hedge Parsley. Ninnescah Biology Field Station, Wichita State University. http://ninnescahlife.wichita.edu/node/323, [Accessed Dec 5 2014] 

DiTomaso, J.M., G.B. Kyser et al. 2013. Hedgeparsley. In: Weed Control in Natural Areas in the Western United States. Weed Research and Information Center, University of California. 544 pp. http://wric.ucdavis.edu/information/natural%20areas/wr_T/Torilis.pdf. [Accessed Dec 6 2014] 

Hilty, John. 2012. Common Hedge Parsley. In: Illinois Wildflowers, http://www.illinoiswildflowers.info/weeds/plants/hdg_parsley.htm. [Accessed Dec 6 2014] 

DiTomaso, J.M., G.B. Kyser et al. 2013. Weed Control in Natural Areas in the Western United States.Weed Research and Information Center, University of California. 544 pp.

Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp (USDA SRS). 

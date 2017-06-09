(function() {
    'use strict'

    angular.module('app').component('console', {
        require: {
            layout: '^app'
        },
        templateUrl: '/js/console/console.template.html',
        controller: controller
    });
    controller.$inject = ['$http', '$stateParams',
                          '$state', '$scope', '$rootScope'];

    function controller($http, $stateParams, $state, $scope, $rootScope) {
        const vm = this;
        this.$onInit = () => {
            // this.response = undefined;
            this.payload = {
                size: '',
                path: '',
                filename: '',
                confidence: 99,
                properties: {
                    "head": {
                        "name": "Triadica sebifera",
                        "common": "Chinese tallow tree",
                        "family": "Euphorbiaceae (Spurge Family)",
                        "synonyms": [
                            "Croton sebiferum", "Sapium sebiferum"
                        ],
                        "duration": "Perennial",
                        "habit": "Tree",
                        "listed_by": ["TDA Noxious Weed", "Invasive Plant Atlas of the US"]
                    },
                    "description": {
                        "main": "Deciduous tree to 60 feet (18 m) in height and 3 feet (90 cm) in diameter, with ovalish- to rhomboid-shaped leaves, dangling yellowish spikes in spring yielding small clusters of three-lobed fruit that split to reveal popcorn-like seeds in fall and winter.",
                        "ecological_threat": "Chinese tallow will transform native habitats into monospecific (single species) tallow forests in the absence of land management practices. Chinese tallow alters light availability for other plant species. Fallen tallow leaves contain toxins that create unfavorable soil conditions for native plant species. Chinese tallow will outcompete native plant species, reducing habitat for wildlife as well as forage areas for livestock.",
                        "biology_and_spread": "Can reach reproductive age in as little as three years and prolifically produces seeds, which are readily transported by water and birds. Flowers mature March through May and fruit ripens August through November. Also propagates via cuttings, stumps, and roots.",
                        "history": "Chinese tallowtree is native to China and Japan. It was introduced into the United States in the 1700?s in South Carolina. It was distributed in the Gulf Coast in the 1900?s by the U.S. Department of Agriculture in an attempt to establish a soap making industry.",
                        "us_habitat": "Invades stream banks, riverbanks, and wet areas like ditches as well as upland sites. Thrives in both freshwater and saline soils. Shade tolerant, flood tolerant, and allelopathic. Increasing widely through ornamental plantings. Spreading by bird- and water-dispersed seeds and colonizing by prolific surface root sprouts."
                    },
                    "distribution": {
                        "us_nativity": "Introduced to U.S.",
                        "native_origin": "Temp. Asia-China & Taiwan (Germplasm Resources Information Network); Kartesz, J.T., and C.A. Meacham. Synthesis of the North American Flora, Version 1.0.",
                        "us_present": "AL, AR, FL, GA, LA, MS, NC, SC, TX",
                        "distribution": "Current distribution includes all of the Southeastern United States from Texas to Florida, North Carolina to Arkansas, and it was recently discovered in California."
                    },
                    "resembles": {
                        "main": "",
                        "alternatives": [
                            "Cercis canadensis (eastern redbud)",
                            "Cercis canadensis var. mexicana (Mexican redbud)",
                            "Cercis canadensis var. texensis (Texas redbud)",
                            "Acer grandidentatum (bigtooth maple)",
                            "Acer negundo (boxelder)",
                            "Ulmus crassifolia (cedar elm)"
                        ]
                    },
                    "management": {
                        "main": "Apply a triclopyr herbicide to basal bark in late summer or early fall (such as 20% Garlon 4 in oil) or, for large trees, apply directly to the stump after cutting down the tree (use Rodeo for trees growing in water). Pull up seedlings by hand. Large land areas can be managed by mowing and the careful use of controlled burns."
                    },
                    "text_references": [],
                    "online_resources": ["Miller, J.H. 2003. Nonnative invasive plants of southern forests: a field guide for identification and control. Gen. Tech. Rep. SRS-62. Asheville, NC: U.S. Department of Agriculture, Forest Service, Southern Research Station. 93 pp (USDA SRS).", "The Quiet Invasion:A Guide to Invasive Plants of the Galveston Bay Area"]
                }
            };
            this.displayed = true;
        }

        this.togglePost = () => {
            document.getElementById('file').value = null;
            this.displayed = !this.displayed;
        };

        // POST /api/classify
        this.submitFile = () => {
            let file = document.getElementById('file').files[0];
            if (!file) {
                return;
            }
            this.togglePost()
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);
            xhr.open('POST', '/api/classify');
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        this.payload = JSON.parse(xhr.response);
                        $scope.$apply();
                        console.log(xhr.status);
                    }
                }
            };
            xhr.send(formData);
            return false;
        };

        // DELETE /api/store

        this.deleteFile = () => {
          this.togglePost();
          const xhr = new XMLHttpRequest();
          xhr.open('DELETE', '/api/store');
          xhr.setRequestHeader("Content-type", "application/json");
          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      console.log(xhr.status);
                  }
              }
          };
          xhr.send(JSON.stringify({
              path: this.payload.path
          }));
          return false;
        }

        // POST /api/store
        this.uploadFile = () => {
            this.togglePost();
            const xhr = new XMLHttpRequest();

            // if (this.payload.coordinates !== '') {
            //   let lat = this.payload.coordinates[0];
            //   let lng = this.payload.coordinates[1];
            //   formData.append('lat', lat);
            //   formData.append('lng', lng);
            // }

            xhr.open('POST', '/api/store');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log(xhr.status);
                    }
                }
            };
            xhr.send(JSON.stringify({
                path: this.payload.path,
                confidence: this.payload.confidence,
                name: this.payload.properties.head.name,
                filename: this.payload.filename,
                size: this.payload.size,
                lat: this.payload.coordinates[0],
                lng: this.payload.coordinates[1]
            }));
            return false;
        };
    }
}());

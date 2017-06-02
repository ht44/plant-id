(function() {
    'use strict'

    angular.module('app').component('console', {
        require: {
            layout: '^app'
        },
        templateUrl: '/js/console/console.template.html',
        controller: controller
    })

    controller.$inject = ['$http', '$stateParams', '$state', '$scope', 'myService', '$rootScope']
    function controller($http, $stateParams, $state, $scope, myService, $rootScope) {
        const vm = this;
        this.$onInit = () => {
            this.response = undefined;
            this.payload = {
              properties: {
                head: {
                  name: "Triadica sebifera"
                }
              }
            };
            this.displayed = true;
            // console.log('initttt');
        }

        this.togglePost = () => {
            this.displayed = !this.displayed;
        };

        this.weenar = () => {
            console.log('weenar ran');
            console.log(this);
            console.log($scope);
        };

        this.update = (payload) => {
          this.fuck = payload.confidence;
        }

        // POST /api/classify
        this.submitFile = () => {
          this.togglePost()
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          const file = document.getElementById('file').files[0];
          formData.append('file', file);
          xhr.open('POST', '/api/classify');
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                let payload = JSON.parse(xhr.response);
                this.payload = payload;
                console.log(payload);
                $scope.$apply();
                console.log(xhr.response);
              }
            }
          };
          xhr.send(formData);
          return false;
        };

        // POST /api/store
        this.uploadFile = () => {
            this.togglePost()
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            const file = document.getElementById('file').files[0];
            // const lat = this.responseObj.coordinates[0];
            // const lng = this.responseObj.coordinates[1];
            // const confidence = this.responseObj.confidence;
            // const resHead = this.responseObj;
            // console.log(JSON.parse(resHead));
            // const species = resHead;
            console.log(this.payload);
            if (this.payload.coordinates) {
              let lat = this.payload.coordinates[0];
              let lng = this.payload.coordinates[1];
              formData.append('lat', lat);
              formData.append('lng', lng);
            }

            let confidence = this.payload.confidence;
            let name = this.payload.properties.head.name;
            // console.log(this.payload.properties.head.common);
            // console.log(this.payload.confidence);
            // console.log(this.payload.coordinates);
            formData.append('file', file);

            formData.append('confidence', confidence);
            formData.append('name', name);
            xhr.open('POST', '/api/store');
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        handleResponse(xhr.response);
                    }
                }
            };

            xhr.send(formData);
            return false;
        };


        function handleResponse(response) {
            // let payload = JSON.parse(response);
            console.log(response);
        }
    }
}());

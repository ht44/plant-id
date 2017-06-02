(function() {
    'use strict'

    angular.module('app').component('console', {
        require: {
            layout: '^app'
        },
        templateUrl: '/js/console/console.template.html',
        controller: controller
    })

    controller.$inject = ['$http', '$stateParams', '$state', '$scope', '$rootScope']
    function controller($http, $stateParams, $state, $scope, $rootScope) {
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

        // POST /api/classify
        this.submitFile = () => {
          const file = document.getElementById('file').files[0];
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
        this.uploadFile = (event) => {
            this.togglePost();
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            const file = document.getElementById('file').files[0];
            document.getElementById('file').value = null;
            console.log('WINNNNNNNN');
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

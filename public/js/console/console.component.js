(function() {
    'use strict'

    angular.module('app').component('console', {
        require: {
            layout: '^app'
        },
        templateUrl: '/js/console/console.template.html',
        controller: controller
    })

    controller.$inject = ['$http', '$stateParams', '$state', 'service']
    function controller($http, $stateParams, $state, service) {
        this.$onInit = () => {
            this.response = undefined;
            this.parsedRes = undefined;
            this.displayed = true;
            console.log('initttt');
        }

        this.togglePost = () => {
            this.displayed = !this.displayed;
        };
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
            let lat = this.parsedRes.coordinates[0];
            let lng = this.parsedRes.coordinates[1];
            let confidence = this.parsedRes.confidence;
            let name = this.parsedRes.properties.name;
            // console.log(this.parsedRes.properties.head.common);
            // console.log(this.parsedRes.confidence);
            // console.log(this.parsedRes.coordinates);
            formData.append('file', file);
            formData.append('lat', lat);
            formData.append('lng', lng);
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
                        this.parsedRes = JSON.parse(xhr.response);
                    }
                }
            };
            xhr.send(formData);
            return false;
        };

        function handleResponse(response) {
            let parsedRes = JSON.parse(response);
            console.log(parsedRes);
        }
    }
}());

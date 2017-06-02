(function() {
    'use strict'

    angular.module('app').component('app', {
        templateUrl: '/js/app/app.template.html',
        controller: controller
    }).service('myService', myService);

    function myService($rootScope) {
        var parsedRes = new Object();
        this.getData = function() {
          return
        }
    }

    function controller() {
        this.$onInit = () => {

        };
    }

}());

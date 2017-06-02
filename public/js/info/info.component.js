(function() {
    'use strict'

    angular.module('app').component('info', {
        require: {
            parent: '^identify'
        },
        bindings: {
            fuck: '<'
        },
        templateUrl: '/js/info/info.template.html',
        controller: controller
    })

    controller.$inject = ['$scope', 'myService', '$rootScope'];
    function controller($scope, myService, $rootScope) {
        this.parsedRes = myService.parsedRes;
        this.$onInit = () => {
            this.confidence = 'weeeee';
        };
        this.update = () => {
            this.confidence = myService.parsedRes.confidence;
        }
    }
}());

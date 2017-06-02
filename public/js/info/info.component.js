(function() {
    'use strict'

    angular.module('app').component('info', {
        require: {
          parent: '^console'
        },
        bindings: {
            parsed: '<'
        },
        templateUrl: '/js/info/info.template.html',
        controller: controller
    })

    controller.$inject = ['$scope', '$rootScope'];
    function controller($scope, $rootScope) {
        this.$onInit = () => {
            this.confidence = 'weeeee';
            this.parsed = JSON.stringify({name: 'hayden'});
        };
        this.test = () => {
            console.log(this);
            console.log($scope);
        };



    }
}());

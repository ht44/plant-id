(function() {
    'use strict'

    angular.module('app').component('app', {
        templateUrl: '/js/app/app.template.html',
        controller: controller
    })

    // controller.$inject = ['$http']
    function controller() {
        this.$onInit = () => {
            this.hayden = 'hayden';
        };
    }

}());

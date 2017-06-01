(function() {
    'use strict'

    angular.module('app').component('info', {
        // require: {
        //   appConsole: '^console'
        // },
        templateUrl: '/js/info/info.template.html',
        controller: controller
    })

    controller.$inject = ['service'];
    function controller(service) {
        this.$onInit = () => {
          console.log(service);
        }
    }

}());

(function() {
    'use strict'

    angular.module('app').component('info', {
        // require: {
        //   appConsole: '^console'
        // },
        templateUrl: '/js/info/info.template.html',
        controller: controller
    })

    controller.$inject = ['haydenService'];
    function controller(haydenService) {
        this.$onInit = () => {
          console.log(haydenService);
        }
    }

}());

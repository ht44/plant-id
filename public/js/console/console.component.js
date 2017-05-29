(function() {
  'use strict'

  angular.module('app')
    .component('console', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/console/console.template.html',
      controller: controller
    })

    // controller.$inject = ['$http']

    function controller() {
    const vm = this
    vm.$onInit = onInit

    function onInit($http) {
      console.log('connecteddddddd');
    }
  }

}());

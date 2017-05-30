(function() {
  'use strict'

  angular.module('app')
    .component('visualize', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/visualize/visualize.template.html',
      controller: controller
    })

    // controller.$inject = ['$http']

    function controller() {
    const vm = this
    vm.$onInit = onInit

    function onInit($http) {
      console.log('conected info');
    }
  }

}());

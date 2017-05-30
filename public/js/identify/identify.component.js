(function() {
  'use strict'

  angular.module('app')
    .component('identify', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/identify/identify.template.html',
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

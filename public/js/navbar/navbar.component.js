(function() {
  'use strict'

  angular.module('app')
    .component('navBar', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/navbar/navbar.template.html',
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

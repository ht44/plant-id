(function() {
  'use strict'

  angular.module('app')
    .component('docs', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/docs/docs.template.html',
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

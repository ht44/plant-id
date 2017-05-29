(function() {
  'use strict'

  angular.module('app')
    .component('info', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/info/info.template.html',
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

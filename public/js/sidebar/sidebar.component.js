(function() {
  'use strict'

  angular.module('app')
    .component('sideBar', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/sidebar/sidebar.template.html',
      controller: controller
    })

    // controller.$inject = ['$http']

    function controller() {
    const vm = this
    vm.$onInit = onInit
    vm.addToList = addToList

    function onInit($http) {
      console.log('connecteddddddd');
    }

    function addToList() {
        console.log(vm.email.userEmail)
    }
  }

}());

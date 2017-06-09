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

  function controller() {
      this.$onInit = () => {
        console.log('sidebar loaded');
      }
  }

}());

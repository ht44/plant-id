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
    function controller() {
    }

}());

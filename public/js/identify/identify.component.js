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

    // controller.$inject = ['$scope', '$http', 'myService']
    function controller($scope, $http, myService) {

    }

}());

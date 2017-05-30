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
    controller.$inject = ['$http', '$stateParams', '$state']
    function controller($http, $stateParams, $state) {
    // this.$onInit = onInit;
    // this.myTest = myTest;
    this.$onInit = () => {
    }

    this.upload = (ev) => {
      ev.preventDefault();
      $http.get('/api').then(response => {
        console.log(response);
      })
    }
  }


}());

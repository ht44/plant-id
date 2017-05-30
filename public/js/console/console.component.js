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
      console.log('initttt');
    }

    this.upload = (ev) => {
      ev.preventDefault();
      let browse = document.querySelector('input[type=file]');
      let upload = document.querySelector('input[type=submit]');
      let file = browse.files[0];
      let form = new FormData();
      form.append("file", file);
      $http.post('/api/classify', form, (response) => {
        console.log('posted');
      })
    }
  }
}());

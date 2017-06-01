(function() {
  'use strict'

  angular.module('app', ['ui.router']).service('service', service);

  function service() {
      this.name = 'HAYDEN';
  }

}());

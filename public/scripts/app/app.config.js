(function() {
    'use strict'

    angular.module('app')
        .config(config)

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true)

        $stateProvider
            .state({
                name: 'app',
                component: 'app',
                abstract: true
            })
            .state({
              name: 'posts',
              parent: 'app',
              url: '/',
              component: 'postList'
            })
            .state({
              name: 'editPost',
              parent: 'app',
              url: '/posts/:id/edit',
              component: 'editPost'
            })
    }

}());

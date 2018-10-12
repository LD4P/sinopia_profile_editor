
// Module Namespace Defintions
angular.module('locApp.modules.profile.services', ['ngResource']);
angular.module('locApp.modules.profile.directives', ['locApp.modules.profile.services']);
angular.module('locApp.modules.profile.controllers', ['locApp.modules.profile.services']);

// Module Definition
angular.module('locApp.modules.profile', [
    'locApp',
    'locApp.modules.profile.controllers',
    'ui.router',
    'ui.sortable',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload'
])

    .config(function($stateProvider, $urlRouterProvider) {

        // Reroute root of module to list controller, with Sinopia customizations
        $urlRouterProvider
            .when('/profile', '/profile/sinopia');

        // Define various states of module
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'html/profile.html'
            })
            .state('profile.sinopia', {
                parent: 'profile',
                url: '/sinopia',
                templateUrl: 'html/sinopia.html',
                controller: 'sinopiaController'
            })
            .state('profile.list', {
                parent: 'profile',
                url: '/list',
                templateUrl: 'html/profileList.html',
                controller: 'profileListController'
            })
            // we want the profileController to use the sinopia templateUrl and
                // to include the parameter used to show/hide the import modal
            // .state('profile.create', {
            //     parent: 'profile',
            //     url: '/create',
            //     templateUrl: 'html/profileForm.html',
            //     controller: 'profileController'
            // })
            .state('profile.create', {
                parent: 'profile',
                url: '/create/:showImport',
                templateUrl: 'html/sinopiaProfileForm.html',
                controller: 'profileController'
            })
            .state('profile.ontologies', {
                parent: 'profile',
                url: '/ontologies',
                templateUrl: 'html/ontologies.html',
                controller: 'ontologiesController'
            })
            .state('profile.ontologies.edit', {
                parent: 'profile',
                url: '/ontologies/{id}',
                templateUrl: 'html/ontologiesForm.html',
                controller: 'ontologiesController'
            })
            .state('profile.ontologies.create', {
                parent: 'profile',
                url: '/ontologies/create',
                templateUrl: 'html/ontologiesForm.html',
                controller: 'ontologiesController'
            })
            .state('profile.edit', {
                parent: 'profile',
                url: '/{id}',
                templateUrl: 'html/profileForm.html',
                controller: 'profileController'
            });
    });
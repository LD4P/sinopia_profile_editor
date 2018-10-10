angular.module('locApp.modules.profile.controllers')

    .controller('sinopiaController', ['$scope', '$state', function($scope, $state) {

      //adds the parameter used to show/hide the import modal
      $scope.showImport = function () {
        $state.go('profile.create', {
          'showImport' : 'true'
        })
      };

    }]);
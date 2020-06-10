/**
 * @ngdoc controller
 * @name MarcConstraintController
 * @description
 * Handles the scope variable for subfield constraints
 */
angular.module('locApp.modules.profile.controllers')
    .controller('MarcConstraintController', function($scope) {
        $scope.subfields = [];

        // Method to check for import
        if($scope.importy){
          // override fields
          $scope.subfields = $scope.marcTemplate.subfields;

          // checked to see if subfields are defined
          if($scope.subfields) {
              $scope.importCascade([], $scope.subfields);
          }
          else {
              // create an empty one if none exists
              $scope.marcTemplate.subfields = [];
          }

          $scope.loadCount++;
        } else {
          $scope.marcTemplate.subfields = $scope.subfields;
        }

        /**
         * @ngdoc function
         * @name addSubfield
         * @description
         * Adds a row to defaults
         */
        $scope.addSubfield = function() {
          var subfields = {"code":"", "propertyURI":"", "repeatable":""};
          $scope.subfields.push(subfields);
        };

        /**
         * @ngdoc function
         * @name deleteSubfield
         * @description
         * Deletes a defaults row
         */
        $scope.deleteSubfield = function(index) {
            $scope.subfields.splice(index,1);
        };
    });

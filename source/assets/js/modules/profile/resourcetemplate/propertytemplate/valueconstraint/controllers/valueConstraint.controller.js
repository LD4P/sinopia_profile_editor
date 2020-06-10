/**
 * @ngdoc controller
 * @name ValueConstraintController
 * @description
 * Handles the scope variable for value constraints
 */
angular.module('locApp.modules.profile.controllers')
    .controller('ValueConstraintController', function($scope, Server, localStorageService) {
        $scope.selectList = localStorageService.get('templateRefs');
        $scope.constraintFields = [];
        $scope.templateFields = [];
        $scope.valueFields = [];
        // Add valueDataType array to the ValueConstraint Controller so it can be added and removed like the other valueConstraints
        $scope.valueDataType = [];

        $scope.valueConstraint = {};

        // Method to check for import
        if($scope.importy){
            // override fields
            $scope.valueConstraint = $scope.propertyTemplate.valueConstraint;

            // checked to see if a value constraint is defined
            if($scope.valueConstraint) {
                $scope.importCascade($scope.templateFields, $scope.valueConstraint.valueTemplateRefs);
                $scope.importCascade($scope.valueFields, $scope.valueConstraint.useValuesFrom);
                // Add valueDataType scope so it can be added and removed like the other valueConstraints
                $scope.importCascade($scope.valueDataType, $scope.valueConstraint.valueDataType);

                if($scope.valueConstraint.useValuesFrom == null) {
                    $scope.valueConstraint.useValuesFrom = [];
                }
                if($scope.valueConstraint.valueTemplateRefs == null) {
                    $scope.valueConstraint.valueTemplateRefs = [];
                }
                // Add valueDataType scope so it can be added and removed like the other valueConstraints
                if($scope.valueConstraint.valueDataType == null) {
                  $scope.valueConstraint.valueDataType = [];
                }
            }
            else {
                // create an empty one if none exists
                $scope.valueConstraint = {};
                $scope.valueConstraint.valueTemplateRefs = [];
                $scope.valueConstraint.useValuesFrom = [];
                // Add valueDataType scope so it can be added and removed like the other valueConstraints
                $scope.valueConstraint.valueDataType = [];
                $scope.propertyTemplate.valueConstraint = $scope.valueConstraint;
            }

            $scope.constraintFields.push("");
            $scope.loadCount++;
        }
        else {
            $scope.valueConstraint.valueTemplateRefs = [];
            $scope.valueConstraint.useValuesFrom = [];
            // Add valueDataType scope so it can be added and removed like the other valueConstraints
            $scope.valueConstraint.valueDataType = [];

            $scope.propertyTemplate.valueConstraint = $scope.valueConstraint;

            $scope.constraintFields.push("");
            $scope.loadCount++;
        }

        // create new defaults array if it doesn't exist
        if ($scope.valueConstraint.defaults === undefined) {
            $scope.valueConstraint.defaults = [];
        }

        // we better move the defaults data to the old model to the new one.
        if ($scope.valueConstraint.defaultURI || $scope.valueConstraint.defaultLiteral) {
            var defObject = { "defaultURI" : $scope.valueConstraint.defaultURI, "defaultLiteral" : $scope.valueConstraint.defaultLiteral };
            $scope.valueConstraint.defaults[0] = defObject;
            delete $scope.valueConstraint.defaultURI;
            delete $scope.valueConstraint.defaultLiteral
        }
        // Method to get the template references
        if(!$scope.selectList) {
            var rts = [];
            Server.get('/verso/api/configs?filter[where][configType]=profile', {})
                .then(function(response) {
                    response.forEach(function(prof) {
                        prof.json.Profile.resourceTemplates.forEach(function(rt){
                            rts.push(rt.id);
                        });
                    });
                    rts.sort();
                    $scope.selectList = rts;
                    localStorageService.set('templateRefs', $scope.selectList);
                });
        }

        /**
         * @ngdoc function
         * @name addTemplate
         * @description
         * Adds a template reference to the value constraint
         */
        $scope.addTemplate = function() {
            $scope.importy = false;
            $scope.valueConstraint.valueTemplateRefs.push("");
            $scope.templateFields.push($scope.valueConstraint.valueTemplateRefs.length - 1);
        };

        /**
         * @ngdoc function
         * @name deleteTemplate
         * @description
         * Deletes a template reference from the list.
         */
        $scope.deleteTemplate = function() {
            $scope.deleteItem($scope.parentId, $scope.templateFields);
            $scope.deleteItem($scope.parentId, $scope.valueConstraint.valueTemplateRefs);
        };

        /**
         * @ngdoc function
         * @name addValue
         * @description
         * Adds a value data type to the value constraint
         */
        $scope.addValue = function() {
            $scope.importy = false;
            $scope.valueConstraint.useValuesFrom.push("");
            $scope.valueFields.push($scope.valueConstraint.useValuesFrom.length - 1);
        };

        /**
         * @ngdoc function
         * @name deleteValue
         * @description
         * Deletes a value reference from the list
         */
        $scope.deleteValue = function() {
            $scope.deleteItem($scope.parentId, $scope.valueFields);
            $scope.deleteItem($scope.parentId, $scope.valueConstraint.useValuesFrom);
        };

        /**
         * @ngdoc function
         * @name addDefault
         * @description
         * Adds a row to defaults
         */
        $scope.addDefault = function() {
            var defaults = {"defaultURI":"", "defaultLiteral":""};
            $scope.valueConstraint.defaults.push(defaults);
        };

        /**
         * @ngdoc function
         * @name deleteDefault
         * @description
         * Deletes a defaults row
         */
        $scope.deleteDefault = function(index) {
            $scope.valueConstraint.defaults.splice(index,1);
        };

      // Add valueDataType add and delete functions
      /**
       * @ngdoc function
       * @name addValueDataType
       * @description
       * Adds a value data type to the value constraint
       */
      $scope.addValueDataType = function() {
        $scope.importy = false;
        $scope.valueDataType.push("");
      };

      /**
       * @ngdoc function
       * @name deleteValueDataType
       * @description
       * Deletes the value data type reference from the list
       */
      $scope.deleteValueDataType = function() {
        $scope.valueDataType = [];
        $scope.valueConstraint.valueDataType = [];
      };
    });

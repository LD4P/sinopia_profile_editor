/**
 * @ngdoc controller
 * @name marcTemplateController
 * @description
 * Handles the scope variable for marc mapping templates
*/
angular.module('locApp.modules.profile.controllers')
    .controller('marcTemplateController', function($scope, $state, $stateParams, Scrub, $http) {
        $scope.marcFields = [];
        $scope.marcTemplate = { repeatable: 'true' };
        $scope.item = Scrub.getIndex();

        $scope.resources = [];
        $scope.marcResourceBase = [];
        $scope.addIndexMarc = 0;

        // if we are importing then we done need to do worry about
        // the floating point numbers.
        if($scope.importy){
            // Loop through the data and add the values in it.
            $scope.marcTemplate = $scope.resourceTemplate.marcTemplates[$scope.parentId];

            $scope.importCascade($scope.resources, $scope.marcTemplate.subfields);
            $scope.addIndexMarc = $scope.marcTemplate.subfields ? $scope.marcTemplate.subfields.length : 0;
            $scope.marcFields.push(-1);

            if(!$scope.marcTemplate.subfields) {
                $scope.marcTemplate.subfields = [];
            }

            //only add to the base templates once
            if(($scope.item / 0.5) % 2 === 1) {
                $scope.marcTemplatesBase.push($scope.marcTemplate);
            }

            // item item a floating number, floor it to get the nearest whole number.
            $scope.item = Math.floor($scope.item);
        }
        // if this is the second instance of this item appearing then reference it from the resource's array.
        else if(($scope.item / 0.5) % 2 === 1) {
            $scope.item = Math.floor($scope.item);
            $scope.marcTemplate = $scope.resourceTemplate.marcTemplates[$scope.resourceTemplate.marcTemplates.length -1];
            $scope.marcFields.push(-1);
        }
        // default case: first instance of the controller.
        else {
            $scope.item = Math.floor($scope.item);
            $scope.resourceTemplate.marcTemplates.push($scope.marcTemplate);
            $scope.marcTemplatesBase.push($scope.marcTemplate);
        }

      /**
       * @ngdoc function
       * @name addConstraint
       * @description
       * Adds a new value constraint to the property template
       */
        $scope.addMarcResource = function() {
            $scope.importy = false;
            $scope.resources.push($scope.addIndexMarc);
            $scope.addIndexMarc++;
        };

        /**
         * @ngdoc function
         * @name delete
         * @description
         * Deletes this property template
         */
        $scope.deleteMarcMapping = function() {
            $scope.deleteItem($scope.parentId, $scope.resourceFieldsMarc);
            $scope.deleteItem($scope.marcTemplate, $scope.resourceTemplate.marcTemplates);
        };


        $scope.marcResourceSortOption = {
            stop: function() {
                $scope.marcTemplate.resourceTemplates = $scope.rearrangeData($scope.resources, $scope.marcResourceBase);
            },
            distance: '10'
        };
    });

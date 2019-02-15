/**
 * @ngdoc service
 * @name FormHandler
 * @description
 * Turns the information in the form into data angular can handle
 */
angular.module('locApp.modules.profile.services')
    .factory('FormHandler', function() {
        var handler = {};

        var removeDefaults = function(profile) {
            // TODO: add things
            angular.forEach(profile.resourceTemplates, function(resource){
                angular.forEach(resource.propertyTemplates, function(properties){
                    if(properties.mandatory === 'false'){
                        delete properties.mandatory;
                    }
                    if(properties.repeatable === 'true') {
                        delete properties.repeatable;
                    }
                    if(properties.type === 'literal') {
                        delete properties.type;
                    }
                });
            });
        };

        var addSchemaUrls = function(profile) {
          profile.schema = 'https://ld4p.github.io/sinopia/schemas/0.0.9/profile.json'
          angular.forEach(profile.resourceTemplates, function(resource){
              resource.schema = 'https://ld4p.github.io/sinopia/schemas/0.0.9/resource-template.json'
          })
        }

        /**
         * @ngdoc function
         * @name getFormData
         * @description
         * Returns the data held in the profile form as a javascript object
         * @param {type} profile - the profile from which to grab the data
         * @returns {obj} - a javascript object representing the profile
         */
        handler.getFormData = function(profile, removeDefault) {
            // TODO: add things here
            if(removeDefault) removeDefaults(profile);
            addSchemaUrls(profile)

            obj = {};
            obj.Profile = profile;
            return obj;
        };

        return handler;
    });

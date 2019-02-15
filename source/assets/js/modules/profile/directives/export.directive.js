/**
 * @ngdoc directive
 * @name sssExport
 * @description
 * Handles profile exports
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssExport', function(ProfileHandler, FormHandler, Alert) {
        return {
            link: function(scope, element, attrs) {
                element.on('click', function() {

                    if(scope.validateProfile()) {
                        scope.validateDate();
                        // Sinopia: adds an ID to the anchor tag and checks for it's prior existence
                        // in order to remove it if already exists to support subsequent downloads.
                        // This is because we need to run an integration test on the JSON produced,
                        // so the node cannot be immediately removed after it is clicked below...
                        var existingAnchorNode = document.getElementById('downloadAnchorNode');
                        if (existingAnchorNode != null) {
                          existingAnchorNode.remove();
                        }
                        var raw = FormHandler.getFormData(scope.profile, attrs.sssExport === "brief");
                        var name = ProfileHandler.getName(raw) + ".json";
                        var json = angular.toJson(raw);
                        // var dataStr = "data:text/json; charset=utf-8," + json;
                        // Need to URI encode for any '#' chars in, e.g. propertyURI, o.w. downloaded json truncated
                        var dataStr = "data:text/json; charset=utf-8," + encodeURIComponent(json);
                        var downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("id", 'downloadAnchorNode');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", name);
                        document.body.appendChild(downloadAnchorNode); // required for firefox
                        downloadAnchorNode.click();
                        //downloadAnchorNode.remove();
                    }
                    //Make sure the alert dialogs appear
                    scope.$digest();
                });
            }
        };
});

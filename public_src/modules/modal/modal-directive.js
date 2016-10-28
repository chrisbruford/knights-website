(function(angular){
    "use strict";
    module.exports = function() {

        function link(scope,element,attrs,controller) {
            element.foundation();
        }

        return {
            replace: true,
            transclude: true,
            restrict: "E",
            templateUrl: "modules/modal/modal-template.html",
            controller: "modalCtrl",
            controllerAs: "modalCtrl",
            scope: {
                "modalId": "@"
            },
            link
        }
    }
})(window.angular)
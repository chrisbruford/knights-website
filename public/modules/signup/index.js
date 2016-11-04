(function(angular){
    angular.module('kokApp')
        .directive('kokSignup',[require('./signup-directive')])
        .controller('signupCtrl',['gameRoles','platforms','continents',require('./signup-controller')]);
})(window.angular);

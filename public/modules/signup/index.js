(function(angular){
    angular.module('kokApp')
        .directive('kokSignup',[require('./signup-directive')])
        .controller('signupCtrl',['gameRoles','platforms','continents','AuthService',require('./signup-controller')]);
})(window.angular);

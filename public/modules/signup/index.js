(function(angular){
    angular.module('kokApp')
        .directive('kokSignup',[require('./signup-directive')])
        .directive('kokPassword',[require('./password-directive')])
        .directive('kokEmail',[require('./email-directive')])
        .directive('kokCmdrName',['DataService','$q',require('./cmdrName-directive')])
        .controller('signupCtrl',['gameRoles','platforms','continents','AuthService',require('./signup-controller')]);
})(window.angular);

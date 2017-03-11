(function (angular) {
    angular.module('kokApp')
        .directive('kokSignup', [require('./signup-directive')])
        .controller('signupCtrl', ['$window', 'gameRoles', 'platforms', 'continents', 'AuthService', require('./signup-controller')]);
})(window.angular);

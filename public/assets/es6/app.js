(function () {
    "use strict";
    global.$ = global.jQuery = require('jquery');
    require('foundation-sites');

    let angular = require('angular');
    require('angular-route');
    require('angular-messages');

    angular.module('kokApp', ['ngRoute','ngMessages'])
        .run(['$document','$rootScope',function ($document,$rootScope) {
                $($document).foundation();
        }])
        .config(['$routeProvider',function($routeProvider){
            $routeProvider.when('/',{
                templateUrl: 'routes/home.html'
            })
            .when('/contact',{
                templateUrl: 'routes/contact.html'
            })
            .when('/roster',{
                templateUrl: 'routes/roster.html'
            })
            .when('/gallery',{
                templateUrl: 'routes/gallery.html'
            })
            .when('/wings',{
                templateUrl: 'routes/wings.html'
            })
            .when('/account',{
                templateUrl: 'routes/account.html'
            })
            .when('/admin',{
                templateUrl: 'routes/admin.html'
            })
            .when('/activate/:token',{
                templateUrl: 'routes/activate.html'
            })
        }]);
})();

require('../../modules');
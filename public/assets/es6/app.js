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
                templateUrl: 'routes/home.html',
                routePage: 'Home'
            })
            .when('/contact',{
                templateUrl: 'routes/contact.html',
                routePage: 'Contact'
            })
            .when('/roster',{
                templateUrl: 'routes/roster.html',
                routePage: 'Roster'
            })
            .when('/gallery',{
                templateUrl: 'routes/gallery.html',
                routePage: 'Gallery'
            })
            .when('/wings',{
                templateUrl: 'routes/wings.html',
                routePage: 'Wings'
            })
            .when('/account',{
                templateUrl: 'routes/account.html',
                routePage: 'Account'
            })
            .when('/admin',{
                templateUrl: 'routes/admin.html',
                routePage: 'Admin'
            })
            .when('/activate/:token',{
                templateUrl: 'routes/activate.html'
            })
            .when('/resetpassword/:token?',{
                templateUrl: 'routes/resetpassword.html'
            })
        }]);
})();

require('../../modules');
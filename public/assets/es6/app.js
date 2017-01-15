(function () {
    "use strict";
    global.$ = global.jQuery = require('jquery');
    require('foundation-sites');

    let angular = require('angular');
    require('angular-route');
    require('angular-messages');
    require('ng-file-upload');

    angular.module('kokApp', ['ngRoute','ngMessages','ngFileUpload'])
        .run(['$document','$rootScope',function ($document,$rootScope) {
                $($document).foundation();
        }])
        .config(['$routeProvider',function($routeProvider){
            $routeProvider.when('/',{
                templateUrl: 'routes/home.html',
                controller: 'RouteCtrl',
                routePage: 'Home'
            })
            .when('/contact',{
                templateUrl: 'routes/contact.html',
                controller: 'RouteCtrl',
                routePage: 'Contact'
            })
            .when('/roster',{
                templateUrl: 'routes/roster.html',
                controller: 'RouteCtrl',
                routePage: 'Roster'
            })
            .when('/gallery',{
                templateUrl: 'routes/gallery.html',
                controller: 'RouteCtrl',
                routePage: 'Gallery'
            })
            .when('/wings',{
                templateUrl: 'routes/wings.html',
                controller: 'RouteCtrl',
                routePage: 'Wings'
            })
            .when('/account',{
                templateUrl: 'routes/account.html',
                controller: 'RouteCtrl',
                routePage: 'Account'
            })
            .when('/admin',{
                templateUrl: 'routes/admin.html',
                controller: 'RouteCtrl',
                routePage: 'Admin'
            })
            .when('/activate/:token',{
                templateUrl: 'routes/activate.html'
            })
            .when('/resetpassword/:token',{
                templateUrl: 'routes/resetpassword.html'
            })
        }]);
})();

require('../../modules');
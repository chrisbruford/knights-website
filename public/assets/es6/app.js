(function () {
    "use strict";
    global.$ = global.jQuery = require('jquery');
    require('foundation-sites');

    let angular = require('angular');
    require('angular-route');

    angular.module('kokApp', ['ngRoute'])
        .run(['$document','$rootScope',function ($document,$rootScope) {

            $rootScope.$on('$viewContentLoaded', function () {
                $($document).foundation();
            });

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
        }]);
})();

require('../../modules');



// (function() {
//     "use strict";
//     let getCoursesBtn = document.querySelector('#getCourses');
//     let getInstructorsBtn = document.querySelector('#getInstructors');
//     let getRoomsBtn = document.querySelector('#getRooms');

//     getCoursesBtn.addEventListener('click', (e) => {
//         let btn = e.target;
//         btn.disabled = true;

//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', '/courses');

//         xhr.onload = (e) => {
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 try {
//                     let data = JSON.parse(xhr.responseText);
//                     console.dir(data);
//                 } catch (e) {
//                     console.dir(xhr.response);
//                 } finally {
//                     btn.disabled = false;
//                 }
//             }
//         }

//         xhr.send();
//     });
// })();
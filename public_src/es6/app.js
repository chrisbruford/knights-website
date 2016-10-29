(function () {
    "use strict";

    let angular = require('angular');
    require('angular-route');

    angular.module('kokApp', ['ngRoute'])
        .run(['$timeout','$document','$rootScope',function ($timeout,$document,$rootScope) {
            $($document).foundation();            
        }])
        .config(['$routeProvider',function($routeProvider){
            $routeProvider.when('/',{
                templateUrl: 'routes/home.html',
            })
            .when('/contact',{
                templateUrl: 'routes/contact.html',
            })
        }]);
})();

require('../modules/video');
require('../modules/modal');
require('../modules/signup');
require('../modules/services');
require('../modules/discord');



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
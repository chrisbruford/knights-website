"use strict";
module.exports = function(){

    let link = (scope, element, attrs, controller) => {
        const canvas = element[0].querySelector('canvas');
        const context = canvas.getContext('2d');
        const video = document.createElement('video');
        const muteBtn = element[0].querySelector('.mute');

        const muted = Symbol('muted');
        video[muted] = true;
        video.volume = 0.0;

        muteBtn.addEventListener('click',()=>{
            muteBtn.classList.toggle('fi-volume-strike');
            muteBtn.classList.toggle('fi-volume');
            video[muted] = !video[muted];
            video.volume = video[muted] ? 0.0:1.0;
        });

        video.src = scope.src;
        video.autoplay = true;

        video.addEventListener('loadedmetadata', function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        video.addEventListener('play',() => {
            (function draw(){
                if (video.paused || video.ended) {
                    return;
                }
                context.drawImage(video,0,0);

                requestAnimationFrame(draw);
            })();
        })
    }

    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'modules/video/video-template.html',
        controller: 'videoCtrl',
        controllerAs: 'VideoCtrl',
        scope: {
            src: "@"
        },
        link
    }
}
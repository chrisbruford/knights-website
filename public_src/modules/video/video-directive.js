"use strict";
module.exports = function(){

    function link(scope, element, attrs, controller) {
        
        //setup video
        const video = element[0].querySelector('video');
        video.volume = 0.0;
        video.src = scope.src;

        //buttons
        const muteBtn = element[0].querySelector('.mute');
        const playBtn = element[0].querySelector('.fi-play');
        const stopBtn = element[0].querySelector('.fi-stop');
        const refreshBtn = element[0].querySelector('.fi-refresh');

        //event listeners
        video.addEventListener('play',() => {
            playBtn.style.color = 'grey';
            playBtn.style.transform = 'scale(1.0)';
            stopBtn.style.color = '';
            stopBtn.style.transform = '';
        })

        muteBtn.addEventListener('click',()=>{
            muteBtn.classList.toggle('fi-volume-strike');
            muteBtn.classList.toggle('fi-volume');
            video.volume = (video.volume > 0.0) ? 0.0:1.0;
        });

        playBtn.addEventListener('click',()=>{
            if (video.paused || video.ended) {
                video.play();
            }
        });

        stopBtn.addEventListener('click',()=>{
            if (!video.paused && !video.ended) {
                video.pause();
                playBtn.style.color = '';
                playBtn.style.transform = '';
                stopBtn.style.color = 'grey';
                stopBtn.style.transform = 'scale(1.0)';
            }
        });

        refreshBtn.addEventListener('click',()=>{
            video.currentTime = 0;
            video.play();
        });

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
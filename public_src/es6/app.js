(function() {
    "use strict";
    let getCoursesBtn = document.querySelector('#getCourses');
    let getInstructorsBtn = document.querySelector('#getInstructors');
    let getRoomsBtn = document.querySelector('#getRooms');

    getCoursesBtn.addEventListener('click', (e) => {
        let btn = e.target;
        btn.disabled = true;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/courses');

        xhr.onload = (e) => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let data = JSON.parse(xhr.responseText);
                    console.dir(data);
                } catch (e) {
                    console.dir(xhr.response);
                } finally {
                    btn.disabled = false;
                }
            }
        }

        xhr.send();
    });
})();
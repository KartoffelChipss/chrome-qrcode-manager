const requestVideoPermBtn = document.getElementById('requestVideoPermBtn');
const videoPermlabel = document.getElementById("videoPermlabel");

function testVideoperms() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
            (stream) => {
                videoPermlabel.classList.remove("err");
                videoPermlabel.classList.add("success");
                videoPermlabel.innerHTML = '<svg fill="#14A44D" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark2</title> <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path> </g></svg> Permission granted!'
                console.log('success');
            },
            (err) => {
                if (err.name === "NotAllowedError") {
                    videoPermlabel.classList.remove("success");
                    videoPermlabel.classList.add("err");
                    videoPermlabel.innerHTML = '<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#DC4C64;} </style> <g> <path class="st0" d="M256.007,357.113c-16.784,0-30.411,13.613-30.411,30.397c0,16.791,13.627,30.405,30.411,30.405 s30.397-13.614,30.397-30.405C286.405,370.726,272.792,357.113,256.007,357.113z"></path> <path class="st0" d="M505.097,407.119L300.769,53.209c-9.203-15.944-26.356-25.847-44.777-25.847 c-18.407,0-35.544,9.904-44.747,25.847L6.902,407.104c-9.203,15.943-9.203,35.751,0,51.694c9.204,15.943,26.356,25.84,44.763,25.84 h408.67c18.406,0,35.559-9.897,44.762-25.84C514.301,442.855,514.301,423.047,505.097,407.119z M464.465,432.405 c-2.95,5.103-8.444,8.266-14.35,8.266H61.878c-5.892,0-11.394-3.163-14.329-8.281c-2.964-5.11-2.979-11.445-0.014-16.548 l194.122-336.24c2.943-5.103,8.436-8.274,14.35-8.274c5.9,0,11.386,3.171,14.336,8.282l194.122,336.226 C467.415,420.945,467.415,427.295,464.465,432.405z"></path> <path class="st0" d="M256.007,152.719c-16.784,0-30.411,13.613-30.411,30.405l11.68,137.487c0,10.346,8.378,18.724,18.731,18.724 c10.338,0,18.731-8.378,18.731-18.724l11.666-137.487C286.405,166.331,272.792,152.719,256.007,152.719z"></path> </g> </g></svg> Permission denied'
                }

                console.error(`The following error occurred: ${err.name}`);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }
}

testVideoperms()

requestVideoPermBtn.onclick = () => {
    testVideoperms();
};

document.querySelectorAll('[data-locale]').forEach(elem => {
    elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
});

/*--- Collapsible ---*/
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
import QrScanner from "../scripts/qr-scanner.min.js";
const scanOutput = document.getElementById("scan-output");
const imagepreview = document.getElementById("imagepreview");
const imageUpload = document.getElementById("image-upload");

const scan_from_image = document.getElementById("scan_from_image");
const scan_from_video = document.getElementById("scan_from_video");
const scan_from_screenshot= document.getElementById("scan_from_screenshot");

const video = document.getElementById('qr-video');
const videoContainer = document.getElementById('video-container');
const camList = document.getElementById('cam-list');

const screenshotBtn = document.getElementById("screenshotBtn");
const screenshotpreview = document.getElementById("screenshotpreview");

let currentTab = "image";
let lastScreenshot = 0;

document.getElementById("decodeQRCodeBtn").addEventListener("click", (event) => {
    if (activeModule.innerHTML !== "scan") {
        if (!decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.add("blue");
        if (gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.remove("blue");
        if (!qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.add("shown");
        if (qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.remove("shown");


        setTimeout(() => {
            if (scanner && !scanner._active && currentTab === "webcam") {
                scanner.start().catch(err => {
                    if (err === "Camera not found.") {
                        document.getElementById("noCamAccessBanner").style.display = "block";
                        videoContainer.style.display = "none";
                        console.log("YOU NEED TO MAKE CAMERA!")
                    } else {
                        console.log(err)
                    }
                })
            }
        }, 50)

        activeModule.innerHTML = "scan";
    } else {
        if (decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.remove("blue");
        if (gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.remove("blue");
        if (qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.remove("shown");
        if (qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.remove("shown");

        if (scanner && scanner._active) {
            scanner.stop();
        }

        activeModule.innerHTML = "none";
    }
});

document.getElementById("gnerateQRCodeBtn").addEventListener("click", (event) => {
    if (scanner && scanner._active) {
        scanner.stop();
    }
})

document.getElementById("scan_image_btn").addEventListener("click", (event) => {
    scan_from_image.classList.add("shown");
    scan_from_screenshot.classList.remove("shown");
    scan_from_video.classList.remove("shown");

    document.getElementById("scan_image_btn").classList.add("selected");
    document.getElementById("scan_screenshot_btn").classList.remove("selected");
    document.getElementById("scan_webcam_btn").classList.remove("selected");

    if (scanner && scanner._active) {
        scanner.stop();
    }

    currentTab = "image";
});

document.getElementById("scan_screenshot_btn").addEventListener("click", (event) => {
    scan_from_image.classList.remove("shown");
    scan_from_screenshot.classList.add("shown");
    scan_from_video.classList.remove("shown");

    document.getElementById("scan_image_btn").classList.remove("selected");
    document.getElementById("scan_screenshot_btn").classList.add("selected");
    document.getElementById("scan_webcam_btn").classList.remove("selected");

    if (scanner && scanner._active) {
        scanner.stop();
    }

    currentTab = "screenshot";
});

document.getElementById("scan_webcam_btn").addEventListener("click", (event) => {
    scan_from_image.classList.remove("shown");
    scan_from_screenshot.classList.remove("shown");
    scan_from_video.classList.add("shown");

    document.getElementById("scan_image_btn").classList.remove("selected");
    document.getElementById("scan_screenshot_btn").classList.remove("selected");
    document.getElementById("scan_webcam_btn").classList.add("selected");

    currentTab = "webcam";

    if (scanner && !scanner._active) {
        scanner.start().catch(err => {
            if (err === "Camera not found.") {
                document.getElementById("noCamAccessBanner").style.display = "block";
                videoContainer.style.display = "none";
                console.log("YOU NEED TO MAKE CAMERA!")
            } else {
                console.log(err)
            }
        })
    }
});

document.getElementById("noCamAccessBtn").addEventListener("click", (event) => {
    chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/options/options.html` });
});

function setResult(label, result) {
    //console.log(result.data);
    label.innerHTML = result.data;
    //camQrResultTimestamp.textContent = new Date().toString();
    //label.style.color = 'teal';
    //clearTimeout(label.highlightTimeout);
    //label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
}

imageUpload.addEventListener('change', event => {
    const file = imageUpload.files[0];
    if (!file) {
        return;
    }

    imagepreview.src = URL.createObjectURL(file);
    imagepreview.style.display = "block";

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => setResult(scanOutput, result))
        .catch(e => setResult(scanOutput, { data: e || getLocale("noqrfound") }));
});

scanOutput.addEventListener("click", (event) => {
    navigator.clipboard.writeText(scanOutput.innerText);
    showBanner(getLocale("copiedtoclip"), 3 * 1000);
});

QrScanner.hasCamera().then(hasCamera => console.log(hasCamera))

const scanner = new QrScanner(video, result => setResult(scanOutput, result), {
    onDecodeError: error => {
        scanOutput.innerText = error;
        //console.log(error)
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
});

scanner.start().then(() => {
    QrScanner.listCameras(true).then(cameras => cameras.forEach(camera => {
        const option = document.createElement('option');
        option.value = camera.id;
        option.text = camera.label;
        camList.add(option);
    }));

    scanner.stop();
});

camList.addEventListener('change', event => {
    scanner.setCamera(event.target.value);
});


/* --- Screenshot --- */

screenshotBtn.addEventListener("click", () => {
    let now = new Date().getTime();
    if (lastScreenshot > now - 500) return;
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        lastScreenshot = now;
        screenshotpreview.src = image;
        screenshotpreview.style.display = "block";

        QrScanner.scanImage(image, { returnDetailedScanResult: true })
            .then(result => setResult(scanOutput, result))
            .catch(e => setResult(scanOutput, { data: e || getLocale("noqrfound") }));
    });
});
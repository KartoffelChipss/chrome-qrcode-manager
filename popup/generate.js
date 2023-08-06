const qrCode = document.getElementById("qrCode");
const qr_url = document.getElementById("qr_url");
const qr_color_main = document.getElementById("qr_color_main");
const qr_color_second = document.getElementById("qr_color_second");

const gnerateQRCodeBtn = document.getElementById("gnerateQRCodeBtn");
const decodeQRCodeBtn = document.getElementById("decodeQRCodeBtn");
const qrCodeGenSec = document.getElementById("qrCodeGenSec");
const qrCodeScanSec = document.getElementById("qrCodeScanSec");
const activeModule = document.getElementById("activeModule");

const qr_copyUrlBtn = document.getElementById("qr_copyUrlBtn");
const qr_savePNGBtn = document.getElementById("qr_savePNGBtn");

const banner = document.getElementById("banner");

let copyLink = "none";

function showBanner(text, showTime) {
    banner.innerText = text;
    banner.classList.add("active");

    setTimeout(() => {
        banner.classList.remove("active");
    }, showTime)
}

chrome.storage.session.get(["qr_maincolor"]).then((result) => {
    if (!result || !result.qr_maincolor) return;

    qr_color_main.value = result.qr_maincolor;
})

chrome.storage.session.get(["qr_seccolor"]).then((result) => {
    if (!result || !result.qr_seccolor) return;
    console.log(result.qr_seccolor)

    qr_color_second.value = result.qr_seccolor;
})

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function updateQRCode() {
    QRCode.toDataURL(qr_url.value, {
        type: 'image/png',
        margin: 1,
        color: {
            dark: qr_color_main.value,
            light: qr_color_second.value
        }
    }, function (err, url) {
        if (err) {
            console.log(err)
            return;
        }

        qrCode.src = url;

        qr_savePNGBtn.setAttribute("href", url);
        copyLink = `https://link.strassburger.org/qrCode?resulution=4&margin=10&colorOne=${qr_color_main.value.slice(1)}&colorTwo=${qr_color_second.value.slice(1)}&link=${encodeURIComponent(qr_url.value)}`;
    });
}

function generateQRCode() {
    chrome.tabs.query({ active: true }, tabs => {
        if (tabs.length <= 0) {
            console.log("Could not find active Tab!");
            return;
        }

        let tabUrl = tabs[0].url;

        console.log(tabUrl)

        qr_url.value = tabUrl;

        updateQRCode();
    });
}

document.getElementById("gnerateQRCodeBtn").addEventListener("click", (event) => {
    if (activeModule.innerHTML !== "generate") {
        if (decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.remove("blue");
        if (!gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.add("blue");
        if (!qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.add("shown");
        if (qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.remove("shown");
        generateQRCode();
        activeModule.innerHTML = "generate";
    } else {
        if (decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.remove("blue");
        if (gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.remove("blue");
        if (qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.remove("shown");
        if (qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.remove("shown");
        generateQRCode();
        activeModule.innerHTML = "none";
    }
});

qr_url.addEventListener("input", (event) => {
    updateQRCode();
});

qr_color_main.addEventListener("input", (event) => {
    updateQRCode();
    chrome.storage.session.set({ qr_maincolor: event.srcElement.value })
});

qr_color_second.addEventListener("input", (event) => {
    updateQRCode();
    chrome.storage.session.set({ qr_seccolor: event.srcElement.value })
});

qr_copyUrlBtn.addEventListener("click", (event) => {
    console.log(copyLink)
    navigator.clipboard.writeText(copyLink);
    showBanner("Copied URL to clipboard!", 2 * 1000);
});

document.querySelector(".topBar").querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
        chrome.tabs.create({ url: icon.getAttribute("href") });
    });
})

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
document.getElementById("decodeQRCodeBtn").addEventListener("click", (event) => {
    if (activeModule.innerHTML !== "scan") {
        if (!decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.add("blue");
        if (gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.remove("blue");
        if (!qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.add("shown");
        if (qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.remove("shown");
        
        activeModule.innerHTML = "scan";
    } else {
        if (decodeQRCodeBtn.classList.contains("blue")) decodeQRCodeBtn.classList.remove("blue");
        if (gnerateQRCodeBtn.classList.contains("blue")) gnerateQRCodeBtn.classList.remove("blue");
        if (qrCodeScanSec.classList.contains("shown")) qrCodeScanSec.classList.remove("shown");
        if (qrCodeGenSec.classList.contains("shown")) qrCodeGenSec.classList.remove("shown");
        
        activeModule.innerHTML = "none";
    }
});
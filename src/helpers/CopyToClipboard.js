import toast from "react-hot-toast";

const UnSecuredCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        toast.success("Copied.");
    } catch (err) {
        toast.error("Unable to copy to clipboard.");
    }
    document.body.removeChild(textArea);
}

const CopyToClipboard = (text) => {
    if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        toast.success("Copied.");
    } else {
        UnSecuredCopyToClipboard(text);
    }
};

export default CopyToClipboard;
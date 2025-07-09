import toast from "react-hot-toast";

export const downloadQr = async (url) => {
  try {
    const imgUrl = url?.qr;
    const fileName = `${url?.title || "qr-code"}.jpeg`;

    // Fetch the image as a blob to bypass CORS
    const response = await fetch(imgUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create and trigger download
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    toast.success("Initiated download of QR code");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download QR code");
  }
};

// Your utility function converts SVG → Canvas → PNG Blob
export async function svgToPngBlob(svgElement, size = 256) {
  // Serialize SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  // Create image from SVG
  const img = new Image();
  const svgBase64 = btoa(
    encodeURIComponent(svgString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode("0x" + p1)
    )
  );
  img.src = `data:image/svg+xml;base64,${svgBase64}`;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  //enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Fill with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  //draw the image
  ctx.drawImage(img, 0, 0, size, size);

  // Convert to PNG blob
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 1.0);
  });
}

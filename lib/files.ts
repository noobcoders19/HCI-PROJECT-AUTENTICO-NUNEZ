export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024;
export const MAX_PDF_UPLOAD_SIZE = 2 * 1024 * 1024;

export async function compressImage(file: File, maxDimension = 1400): Promise<string> {
  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error(`${file.name} is too large to upload.`);
  }

  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error(`Could not read ${file.name} as an image.`));
    element.src = source;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error(`Could not process ${file.name}.`);
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.68);
}

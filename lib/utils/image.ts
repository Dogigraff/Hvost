import imageCompression from 'browser-image-compression';

const MAX_SIZE_MB = 5;
const MAX_WIDTH_PX = 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Допустимые форматы: JPEG, PNG, WEBP';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return 'Фото не должно превышать 5 МБ';
  }
  return null;
}

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_PX,
    useWebWorker: true,
    fileType: file.type,
    initialQuality: 0.85,
  });
}

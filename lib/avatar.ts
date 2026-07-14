import { createClient } from "@/lib/supabase/client";

export const AVATAR_BUCKET = "avatars";
const MAX_EDGE = 256;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export class AvatarError extends Error {}

/**
 * Squares, downscales, and re-encodes a picked image to a small WebP.
 *
 * Phones hand us 3–12 MB HEIC/JPEG originals. Storing those verbatim would blow
 * the localStorage quota on the fallback path and make every feed query drag a
 * multi-megabyte column around, so normalize before anything else sees the file.
 */
async function normalize(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new AvatarError("Pick an image file (PNG, JPG, or WebP).");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new AvatarError("That image is over 5 MB. Try a smaller one.");
  }

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new AvatarError("That image couldn't be read. Try a different file.");
  });

  // Center-crop to a square so circular avatars never stretch the subject.
  const edge = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - edge) / 2;
  const sy = (bitmap.height - edge) / 2;
  const size = Math.min(edge, MAX_EDGE);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new AvatarError("Your browser couldn't process that image.");
  ctx.drawImage(bitmap, sx, sy, edge, edge, 0, 0, size, size);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (!blob) throw new AvatarError("Your browser couldn't process that image.");
  return blob;
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new AvatarError("Couldn't read that image."));
    reader.readAsDataURL(blob);
  });
}

/**
 * Returns a URL for the user's new avatar.
 *
 * Uploads to Supabase Storage when it's reachable. If the bucket doesn't exist
 * yet (or there's no backend at all) it degrades to an inline data URL, so
 * picking a picture always works even before storage is provisioned.
 */
export async function uploadAvatar(file: File, userId?: string): Promise<string> {
  const blob = await normalize(file);

  const supabase = createClient();
  if (!supabase || !userId) return toDataUrl(blob);

  // RLS keys the object path on the user id; see supabase/setup.sql.
  const path = `${userId}/avatar.webp`;
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, blob, { contentType: "image/webp", upsert: true });

  if (error) {
    console.warn("[avatar] storage upload failed, inlining instead:", error.message);
    return toDataUrl(blob);
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  // Bust the CDN cache; the path is stable across re-uploads because of `upsert`.
  return `${data.publicUrl}?v=${Date.now()}`;
}

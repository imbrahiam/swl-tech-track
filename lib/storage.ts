import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const BUCKET = process.env.MINIO_BUCKET!
const ENDPOINT = process.env.MINIO_ENDPOINT!
const USE_SSL = process.env.MINIO_USE_SSL === "true"

export const storage = new S3Client({
  endpoint: `${USE_SSL ? "https" : "http"}://${ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: false, // MinIO with custom domain uses virtual-hosted style
})

/**
 * Generates a presigned URL for direct client-side upload.
 * Expires in 5 minutes.
 *
 * @param key - Object key, e.g. "orders/123/photo.jpg"
 * @param contentType - MIME type of the file
 */
export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(storage, command, { expiresIn: 300 })
}

/**
 * Generates a presigned download URL. Use for private files.
 * For public images, use getPublicUrl() instead (served via imgproxy CDN).
 */
export async function getDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(storage, command, { expiresIn })
}

/**
 * Returns the imgproxy CDN URL for an image stored in MinIO.
 * Handles resizing via imgproxy transforms.
 *
 * @param key - Object key in MinIO
 * @param width - Target width (0 = auto)
 * @param height - Target height (0 = auto)
 */
export function getImageUrl(key: string, width = 0, height = 0) {
  const base = process.env.NEXT_PUBLIC_IMGPROXY_URL!
  // imgproxy plain URL format: /insecure/resize:fill:w:h/plain/s3://bucket/key
  return `${base}/insecure/resize:fill:${width}:${height}/plain/s3://${BUCKET}/${key}`
}

/**
 * Deletes an object from storage.
 */
export async function deleteObject(key: string) {
  await storage.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

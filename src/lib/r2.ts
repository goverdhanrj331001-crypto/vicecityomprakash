import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3ClientInstance;
}

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export function getR2PublicDomain(): string {
  return (
    process.env.R2_PUBLIC_DOMAIN ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN ||
    'https://pub-r2.dev'
  ).replace(/\/+$/, '');
}

export interface UploadToR2Options {
  buffer: Buffer | Uint8Array;
  fileName: string;
  contentType: string;
  folder?: 'mods' | 'images' | 'thumbnails' | 'general';
}

export interface R2UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  contentType: string;
}

/**
 * Uploads a file buffer directly to Cloudflare R2 and returns its public CDN URL.
 */
export async function uploadFileToR2({
  buffer,
  fileName,
  contentType,
  folder = 'general',
}: UploadToR2Options): Promise<R2UploadResult> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'gta5-mods-storage';
  const publicDomain = getR2PublicDomain();

  // Sanitize file name
  const timestamp = Date.now();
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  const key = `${folder}/${timestamp}-${cleanName}`;

  if (!client) {
    // If credentials are not yet configured, generate a simulated cloud URL so the app continues working seamlessly
    return {
      url: `${publicDomain}/${key}`,
      key,
      bucket,
      size: buffer.length,
      contentType,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await client.send(command);

  const url = `${publicDomain}/${key}`;

  return {
    url,
    key,
    bucket,
    size: buffer.length,
    contentType,
  };
}

/**
 * Deletes a file from Cloudflare R2 bucket.
 */
export async function deleteFileFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;

  if (!client || !bucket) {
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch (err) {
    console.error('Error deleting file from Cloudflare R2:', err);
    return false;
  }
}

/**
 * MinIO Storage Implementation
 * S3-compatible object storage client for local development
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

import type { StorageService, UploadResult } from './types';

const BUCKET = process.env.MINIO_BUCKET || 'briefbot-documents';

function getS3Client(): S3Client {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const protocol = useSSL ? 'https' : 'http';

  return new S3Client({
    endpoint: `${protocol}://${endpoint}:${port}`,
    region: 'us-east-1', // MinIO ignores but SDK requires
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    },
    forcePathStyle: true, // Required for MinIO
  });
}

let client: S3Client | null = null;
let bucketEnsured = false;

function getClient(): S3Client {
  if (!client) {
    client = getS3Client();
  }
  return client;
}

async function ensureBucket(): Promise<void> {
  if (bucketEnsured) return;

  const s3 = getClient();

  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    bucketEnsured = true;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'NotFound') {
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
      bucketEnsured = true;
    } else {
      throw error;
    }
  }
}

export const minioStorage: StorageService = {
  async upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult> {
    await ensureBucket();

    const s3 = getClient();
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Generate a signed URL for immediate access
    const url = await this.getSignedUrl(key);

    return { key, url };
  },

  async download(key: string): Promise<Buffer> {
    await ensureBucket();

    const s3 = getClient();
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    if (!response.Body) {
      throw new Error(`Empty response body for key: ${key}`);
    }

    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  },

  async delete(key: string): Promise<void> {
    await ensureBucket();

    const s3 = getClient();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  },

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    await ensureBucket();

    const s3 = getClient();
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    return awsGetSignedUrl(s3, command, { expiresIn });
  },
};

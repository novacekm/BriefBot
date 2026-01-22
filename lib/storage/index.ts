/**
 * Storage Service
 * Exports the active storage implementation based on environment
 */

export type { StorageService, UploadResult } from './types';
export { minioStorage } from './minio';

// Default export for convenience - MinIO for local dev, can be swapped for AWS S3 in production
export { minioStorage as storage } from './minio';

/**
 * Storage Service Types
 * Defines interfaces for S3-compatible object storage (MinIO/AWS S3)
 */

export interface UploadResult {
  /** The storage key (object key) for the uploaded file */
  key: string;
  /** The URL to access the uploaded file (may be presigned) */
  url: string;
}

export interface StorageService {
  /**
   * Upload a file to storage
   * @param buffer - The file content as a Buffer
   * @param key - The storage key (path) for the file
   * @param contentType - The MIME type of the file
   * @returns Upload result with key and URL
   */
  upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult>;

  /**
   * Download a file from storage
   * @param key - The storage key of the file
   * @returns The file content as a Buffer
   */
  download(key: string): Promise<Buffer>;

  /**
   * Delete a file from storage
   * @param key - The storage key of the file to delete
   */
  delete(key: string): Promise<void>;

  /**
   * Generate a presigned URL for temporary access to a file
   * @param key - The storage key of the file
   * @param expiresIn - URL expiration time in seconds (default: 3600)
   * @returns A presigned URL string
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

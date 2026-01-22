/**
 * Storage Integration Tests
 * Requires Docker services running: npm run docker:up
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { minioStorage } from '@/lib/storage';

// Test data
const TEST_USER_ID = 'test-user-123';
const TEST_DOC_ID = 'test-doc-456';
const TEST_FILENAME = 'test-document.txt';
const TEST_KEY = `${TEST_USER_ID}/${TEST_DOC_ID}/${TEST_FILENAME}`;
const TEST_CONTENT = 'Hello, this is test content for MinIO storage!';
const TEST_CONTENT_TYPE = 'text/plain';

// Track keys for cleanup
const createdKeys: string[] = [];

async function isMinioAvailable(): Promise<boolean> {
  try {
    // Try a simple operation to check if MinIO is available
    const testKey = `health-check-${Date.now()}`;
    const buffer = Buffer.from('health check');
    await minioStorage.upload(buffer, testKey, 'text/plain');
    await minioStorage.delete(testKey);
    return true;
  } catch {
    return false;
  }
}

describe('MinIO Storage Integration', () => {
  let minioAvailable = false;

  beforeAll(async () => {
    minioAvailable = await isMinioAvailable();
    if (!minioAvailable) {
      console.warn(
        'MinIO is not available. Skipping integration tests. Run `npm run docker:up` to start services.'
      );
    }
  });

  afterAll(async () => {
    // Cleanup all created test files
    for (const key of createdKeys) {
      try {
        await minioStorage.delete(key);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('upload', () => {
    it('should upload a file and return key and url', async () => {
      if (!minioAvailable) {
        return;
      }

      const buffer = Buffer.from(TEST_CONTENT);
      const result = await minioStorage.upload(buffer, TEST_KEY, TEST_CONTENT_TYPE);
      createdKeys.push(TEST_KEY);

      expect(result.key).toBe(TEST_KEY);
      expect(result.url).toContain(TEST_KEY);
      expect(result.url).toMatch(/^http/);
    });
  });

  describe('download', () => {
    it('should download a file and return matching content', async () => {
      if (!minioAvailable) {
        return;
      }

      const uploadKey = `${TEST_USER_ID}/${TEST_DOC_ID}/download-test.txt`;
      const buffer = Buffer.from(TEST_CONTENT);
      await minioStorage.upload(buffer, uploadKey, TEST_CONTENT_TYPE);
      createdKeys.push(uploadKey);

      const downloaded = await minioStorage.download(uploadKey);
      expect(downloaded.toString()).toBe(TEST_CONTENT);
    });

    it('should throw error for non-existent file', async () => {
      if (!minioAvailable) {
        return;
      }

      const nonExistentKey = 'non-existent/file/path.txt';
      await expect(minioStorage.download(nonExistentKey)).rejects.toThrow();
    });
  });

  describe('getSignedUrl', () => {
    it('should return a signed URL that provides access to the file', async () => {
      if (!minioAvailable) {
        return;
      }

      const uploadKey = `${TEST_USER_ID}/${TEST_DOC_ID}/signed-url-test.txt`;
      const buffer = Buffer.from(TEST_CONTENT);
      await minioStorage.upload(buffer, uploadKey, TEST_CONTENT_TYPE);
      createdKeys.push(uploadKey);

      const signedUrl = await minioStorage.getSignedUrl(uploadKey);
      expect(signedUrl).toMatch(/^http/);
      expect(signedUrl).toContain(uploadKey);
      expect(signedUrl).toContain('X-Amz-Signature');

      // Fetch the signed URL to verify access
      const response = await fetch(signedUrl);
      expect(response.ok).toBe(true);
      const content = await response.text();
      expect(content).toBe(TEST_CONTENT);
    });

    it('should accept custom expiration time', async () => {
      if (!minioAvailable) {
        return;
      }

      const uploadKey = `${TEST_USER_ID}/${TEST_DOC_ID}/custom-expiry-test.txt`;
      const buffer = Buffer.from(TEST_CONTENT);
      await minioStorage.upload(buffer, uploadKey, TEST_CONTENT_TYPE);
      createdKeys.push(uploadKey);

      const signedUrl = await minioStorage.getSignedUrl(uploadKey, 300); // 5 minutes
      expect(signedUrl).toMatch(/X-Amz-Expires=300/);
    });
  });

  describe('delete', () => {
    it('should delete a file so it cannot be downloaded', async () => {
      if (!minioAvailable) {
        return;
      }

      const uploadKey = `${TEST_USER_ID}/${TEST_DOC_ID}/delete-test.txt`;
      const buffer = Buffer.from(TEST_CONTENT);
      await minioStorage.upload(buffer, uploadKey, TEST_CONTENT_TYPE);

      // Verify it exists
      const downloaded = await minioStorage.download(uploadKey);
      expect(downloaded.toString()).toBe(TEST_CONTENT);

      // Delete it
      await minioStorage.delete(uploadKey);

      // Verify it's gone
      await expect(minioStorage.download(uploadKey)).rejects.toThrow();
    });

    it('should not throw when deleting non-existent file', async () => {
      if (!minioAvailable) {
        return;
      }

      // S3/MinIO delete is idempotent - doesn't error on missing files
      const nonExistentKey = 'non-existent/to-delete.txt';
      await expect(minioStorage.delete(nonExistentKey)).resolves.not.toThrow();
    });
  });

  describe('full workflow', () => {
    it('should complete upload → download → verify → delete cycle', async () => {
      if (!minioAvailable) {
        return;
      }

      const workflowKey = `${TEST_USER_ID}/${TEST_DOC_ID}/workflow-test.txt`;
      const workflowContent = 'Full workflow test content';
      const buffer = Buffer.from(workflowContent);

      // Upload
      const uploadResult = await minioStorage.upload(buffer, workflowKey, TEST_CONTENT_TYPE);
      expect(uploadResult.key).toBe(workflowKey);

      // Download and verify
      const downloaded = await minioStorage.download(workflowKey);
      expect(downloaded.toString()).toBe(workflowContent);

      // Get signed URL and verify
      const signedUrl = await minioStorage.getSignedUrl(workflowKey);
      const response = await fetch(signedUrl);
      expect(response.ok).toBe(true);
      const fetchedContent = await response.text();
      expect(fetchedContent).toBe(workflowContent);

      // Delete
      await minioStorage.delete(workflowKey);

      // Verify deleted
      await expect(minioStorage.download(workflowKey)).rejects.toThrow();
    });
  });
});

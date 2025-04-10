import type * as Airtop from '../api';
import { Files as FilesClass, type Files as FilesNamespace } from '../api/resources/files/client/Client';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { Transform } from 'readable-stream';

export class AirtopFiles extends FilesClass {
  constructor(readonly _options: FilesNamespace.Options) {
    super(_options);
  }

  /**
   * Uploads a file to Airtop by first creating a file entry and then uploading the contents
   * If @options is not provided, the fileName will be calculated from the filePath.
   * @options.fileType defaults to `customer_upload`
   *
   * @param filePath - Path to the local file to upload
   * @param options - Optional API request configuration
   * @returns The created file entry response
   *
   * @example
   *     const result = await client.files.upload("/path/to/file.pdf")
   */
  async upload(
    filePath: string,
    options?: Airtop.CreateFileRestInputV1,
  ): Promise<Airtop.EnvelopeGetFileV1EnvelopeDefaultMeta> {
    const fileName = options?.fileName ?? path.basename(filePath);
    const fileType = options?.fileType ?? 'customer_upload';

    const fileEntry = await this.create({
      ...options,
      fileName,
      fileType,
    });

    const fileContent = fs.readFileSync(filePath);

    const uploadResponse = await fetch(fileEntry.data.uploadUrl, {
      method: 'PUT',
      body: fileContent,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file content: ${uploadResponse.statusText}`);
    }

    const updatedFileEntry = await this.get(fileEntry.data.id);
    return updatedFileEntry;
  }

  /**
   * Downloads a file from Airtop to a local path
   *
   * @param fileId - The ID of the file to download
   * @param destinationPath - Local path where the file should be saved
   * @param options - Optional API request configuration
   * @param onProgress - Optional callback to monitor download progress
   *
   * @example
   *     await client.files.download(
   *       "123e4567-e89b-12d3-a456-426614174000",
   *       "/path/to/save/file.pdf",
   *       (downloaded, total) => {
   *         const percent = Math.round((downloaded / total) * 100);
   *         console.log(`Downloaded: ${downloaded} / ${total} bytes (${percent}%)`);
   *       }
   *     )
   */
  async download(
    fileId: string,
    destinationPath: string,
    onProgress?: (downloadedBytes: number, totalBytes: number) => void,
    options?: FilesNamespace.RequestOptions,
  ): Promise<void> {
    // Get the file entry to get the download URL
    const fileEntry = await this.get(fileId, options);

    //*****
    //TODO: get file status, and return error if upload not complete
    //*****
    // Download the file content
    const downloadResponse = await fetch(fileEntry.data.downloadUrl);

    if (!downloadResponse.ok) {
      throw new Error(`Failed to download file: ${downloadResponse.statusText}`);
    }

    const totalBytes = Number.parseInt(downloadResponse.headers.get('content-length') ?? '0', 10);
    let downloadedBytes = 0;

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    const fileStream = fs.createWriteStream(destinationPath);

    await new Promise((resolve, reject) => {
      if (onProgress && downloadResponse.body) {
        // Create a transform stream to track progress
        const progressStream = new Transform({
          transform(chunk: Buffer, encoding: string, callback: (error: Error | null, data?: any) => void) {
            downloadedBytes += chunk.length;
            onProgress(downloadedBytes, totalBytes);
            callback(null, chunk);
          },
        });

        downloadResponse.body.pipe(progressStream).pipe(fileStream);

        progressStream.on('error', reject);
      } else {
        // If no progress callback, pipe directly
        downloadResponse.body?.pipe(fileStream);
      }

      downloadResponse.body?.on('error', reject);
      fileStream.on('finish', resolve);
    });
  }

  /**
   * Waits for a file to become available for download.
   *
   * @param fileId - The ID of the file to wait for
   * @param options - Optional request configuration including timeout
   * @returns The file entry once it becomes available
   * @throws Error if the file doesn't become available within the timeout period
   *
   * @example
   *     const fileEntry = await client.files.waitForDownloadAvailable("123e4567-e89b-12d3-a456-426614174000")
   */
  async waitForDownloadAvailable(
    fileId: string,
    options?: FilesNamespace.RequestOptions,
  ): Promise<Airtop.EnvelopeGetFileV1EnvelopeDefaultMeta> {
    const timeoutSeconds = options?.timeoutInSeconds || 120;
    const intervalMs = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutSeconds * 1000) {
      const fileEntry = await this.get(fileId, options);

      // Check if the file has a valid download URL and size, which indicates it's available
      if (fileEntry.data.downloadUrl && fileEntry.data.fileBytes > 0) {
        return fileEntry;
      }

      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(`Timeout waiting for file ${fileId} to become available`);
  }
}

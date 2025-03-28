import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly logger = new Logger(StorageService.name);
    private readonly minioClient: Minio.Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        // Initialize the Minio client with configuration from environment variables
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'offer_hub_minio'),
            port: parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10),
            useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'offerhub_minio'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'offerhub_minio_secret'),
        });

        this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'offerhub-invoices');
    }

    /**
     * Verify and create the bucket if it does not exist when initializing the module
     */
    async onModuleInit() {
        try {
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            
            if (!bucketExists) {
                this.logger.log(`Bucket "${this.bucketName}" does not exist. Creating...`);
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                
                // Configure bucket access policies if necessary
                // For example, to make objects publicly accessible:
                // await this.setPublicPolicy();
                
                this.logger.log(`Bucket "${this.bucketName}" created successfully`);
            } else {
                this.logger.log(`Bucket "${this.bucketName}" already exists`);
            }
        } catch (error) {
            this.logger.error(`Error initializing MinIO: ${error.message}`);
            // Do not throw an exception to allow the application to continue running
            // even if MinIO is not available at startup
        }
    }

    /**
     * Upload a file to MinIO
     * @param filePath Local file path
     * @param objectName Object name in MinIO
     * @param metadata Optional object metadata
     * @returns URL of the stored object
     */
    async uploadFile(filePath: string, objectName: string, metadata?: Record<string, string>): Promise<string> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File does not exist: ${filePath}`);
            }

            const fileStream = createReadStream(filePath);
            const fileSize = fs.statSync(filePath).size;
            const fileType = this.getContentType(filePath);

            // Add basic metadata if not provided
            const objectMetadata = {
                'Content-Type': fileType,
                ...metadata,
            };

            // Upload the file to MinIO
            await this.minioClient.putObject(
                this.bucketName,
                objectName,
                fileStream,
                fileSize,
                objectMetadata
            );

            // Generate and return the URL of the object
            return await this.getFileUrl(objectName);
        } catch (error) {
            this.logger.error(`Error uploading file to MinIO: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get the URL of an object stored in MinIO
     * @param objectName Object name
     * @param expiryInSeconds Link expiration time in seconds (default: 7 days)
     * @returns URL to access the object
     */
    async getFileUrl(objectName: string, expiryInSeconds: number = 7 * 24 * 60 * 60): Promise<string> {
        try {
            return await this.minioClient.presignedGetObject(
                this.bucketName,
                objectName,
                expiryInSeconds
            );
        } catch (error) {
            this.logger.error(`Error generating URL for object ${objectName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Download a file from MinIO to a local location
     * @param objectName Object name in MinIO
     * @param destinationPath Local path to save the file
     * @returns Full path of the downloaded file
     */
    async downloadFile(objectName: string, destinationPath: string): Promise<string> {
        try {
            await this.minioClient.fGetObject(
                this.bucketName,
                objectName,
                destinationPath
            );
            return destinationPath;
        } catch (error) {
            this.logger.error(`Error downloading object ${objectName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Delete an object from MinIO
     * @param objectName Object name to delete
     */
    async deleteFile(objectName: string): Promise<void> {
        try {
            await this.minioClient.removeObject(this.bucketName, objectName);
        } catch (error) {
            this.logger.error(`Error deleting object ${objectName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if an object exists in MinIO
     * @param objectName Object name
     * @returns true if the object exists, false otherwise
     */
    async fileExists(objectName: string): Promise<boolean> {
        try {
            await this.minioClient.statObject(this.bucketName, objectName);
            return true;
        } catch (error) {
            if (error.code === 'NotFound') {
                return false;
            }
            throw error;
        }
    }

    /**
     * Determine the content type based on the file extension
     * @param filePath File path
     * @returns MIME type of the file
     */
    private getContentType(filePath: string): string {
        const extension = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
            '.csv': 'text/csv',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.zip': 'application/zip',
        };

        return mimeTypes[extension] || 'application/octet-stream';
    }

    /**
     * Configure a public policy for the bucket (optional)
     * Allows public read access to all objects
     */
    private async setPublicPolicy(): Promise<void> {
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                },
            ],
        };

        await this.minioClient.setBucketPolicy(
            this.bucketName,
            JSON.stringify(policy)
        );
    }
}

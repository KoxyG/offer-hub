import { Injectable, Logger, BadRequestException, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { S3 } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import type { Express } from "express"

@Injectable()
export class StorageService {
  private s3: S3 | null = null
  private bucket: string | undefined = undefined
  private region: string | undefined = undefined
  private baseUrl: string | null = null
  private logger = new Logger(StorageService.name)

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.logger.log("Initializing StorageService")

    try {
      // Ensure AWS S3 configurations are available
      this.bucket = this.configService.get<string>("AWS_S3_BUCKET")
      this.region = this.configService.get<string>("AWS_REGION")

      if (!this.bucket || !this.region) {
        this.logger.warn("AWS S3 configuration is missing. Using mock storage service.")
        return
      }

      const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID")
      const secretAccessKey = this.configService.get<string>("AWS_SECRET_ACCESS_KEY")

      if (!accessKeyId || !secretAccessKey) {
        this.logger.warn("AWS credentials are missing. Using mock storage service.")
        return
      }

      // Initialize the S3 client
      this.s3 = new S3({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })

      // Set the base URL for the bucket
      this.baseUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/`
      this.logger.log("Storage service initialized with AWS S3")
    } catch (error) {
      this.logger.error(`Error initializing storage service: ${error.message}`, error.stack)
      // Continue with null values - we'll use mock implementations
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // If S3 is not configured, use a mock implementation for development
    if (!this.s3 || !this.bucket || !this.baseUrl) {
      this.logger.warn("Using mock storage service for file upload")
      const mockUrl = `mock-s3://${folder}/${uuidv4()}-${file.originalname}`
      return mockUrl
    }

    try {
      const fileExtension = file.originalname.split(".").pop()
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`

      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: this.bucket,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "private",
          Metadata: {
            originalName: file.originalname,
            uploadedAt: new Date().toISOString(),
          },
        },
      })

      await upload.done()
      const fileUrl = `${this.baseUrl}${fileName}`

      this.logger.log(`File uploaded successfully: ${fileName}`)
      return fileUrl
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to upload file: ${error.message}`)
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // If S3 is not configured, use a mock implementation for development
    if (!this.s3 || !this.bucket || !this.baseUrl) {
      this.logger.warn(`Using mock storage service for file deletion: ${fileUrl}`)
      return
    }

    try {
      // Extract the key from the URL
      const key = fileUrl.replace(this.baseUrl, "")

      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: key,
      })

      this.logger.log(`File deleted successfully: ${key}`)
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to delete file: ${error.message}`)
    }
  }

  async getSignedUrl(fileUrl: string, expiresIn = 3600): Promise<string> {
    // If S3 is not configured, return the original URL
    if (!this.s3 || !this.bucket || !this.baseUrl) {
      this.logger.warn(`Using mock storage service for signed URL: ${fileUrl}`)
      return fileUrl
    }

    try {
      // Extract the key from the URL
      const key = fileUrl.replace(this.baseUrl, "")

      // In AWS SDK v3, we need to use the command pattern
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      // Use the getSignedUrl function from @aws-sdk/s3-request-presigner
      const url = await getSignedUrl(this.s3, command, { expiresIn })
      return url
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to generate signed URL: ${error.message}`)
    }
  }
}


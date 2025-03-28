import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpStatus,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UpdateVerificationDto } from "./dto/update-verification.dto"
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger"
import { Express } from "express"
import { VerificationsService } from "./verification.service"
import { Verification } from "./entities/verification.entity"

@ApiTags("verifications")
@Controller("verifications")
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Submit verification document" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Identity document (JPEG, PNG, or PDF, max 5MB)",
        },
      },
      required: ["file"],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Verification request submitted successfully",
    type: Verification,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid file or request" })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "User already has a pending or approved verification" })
  @ApiBearerAuth()
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.verificationsService.submitVerification(req.user.id, file)
  }

  @Get()
  @ApiOperation({ summary: "Get all verification requests (admin only)" })
  @ApiQuery({ name: "page", type: Number, required: false, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", type: Number, required: false, description: "Items per page (default: 10)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of verification requests with pagination",
  })
  @ApiBearerAuth()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.verificationsService.findAll(page, limit)
  }

  @Get('my-verifications')
  @ApiOperation({ summary: 'Get user\'s verification requests' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: "User's verification requests",
    type: [Verification]
  })
  @ApiBearerAuth()
  async findMyVerifications(@Req() req) {
    return this.verificationsService.findAllByUserId(req.user.id);
  }

  @Get('status')
  @ApiOperation({ summary: 'Check if user is verified' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: "User verification status",
    schema: {
      type: "object",
      properties: {
        isVerified: {
          type: "boolean",
          example: true
        }
      }
    }
  })
  @ApiBearerAuth()
  async checkVerificationStatus(@Req() req) {
    return this.verificationsService.getUserVerificationStatus(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get verification request by ID (admin only)' })
  @ApiParam({ name: "id", type: String, description: "Verification ID" })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: "Verification request details",
    type: Verification
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Verification not found" })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.verificationsService.findOne(id);
  }

  @Put(":id/approve")
  @ApiOperation({ summary: "Approve verification request (admin only)" })
  @ApiParam({ name: "id", type: String, description: "Verification ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Verification approved successfully",
    type: Verification,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Verification not found" })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "Verification is not in pending status" })
  @ApiBearerAuth()
  async approveVerification(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.verificationsService.approveVerification(id, req.user.id)
  }

  @Put(":id/reject")
  @ApiOperation({ summary: "Reject verification request (admin only)" })
  @ApiParam({ name: "id", type: String, description: "Verification ID" })
  @ApiBody({
    type: UpdateVerificationDto,
    description: "Rejection details",
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Verification rejected successfully",
    type: Verification,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Verification not found" })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: "Verification is not in pending status" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Rejection reason is required" })
  @ApiBearerAuth()
  async rejectVerification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVerificationDto: UpdateVerificationDto,
    @Req() req,
  ) {
    return this.verificationsService.rejectVerification(id, req.user.id, updateVerificationDto)
  }
}


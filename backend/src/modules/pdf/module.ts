import { Module } from '@nestjs/common';
import { PdfService } from './service';
import { StorageModule } from '../storage/module';

@Module({
  imports: [StorageModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}

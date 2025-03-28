import PDFDocument from 'pdfkit';
import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import { StorageService } from '../storage/service';

// Layout constants
const LAYOUT = {
  PAGE_MARGIN: 50,
  LEFT_COLUMN_X: 50,
  RIGHT_COLUMN_X: 300,
  INVOICE_INFO_LEFT_X: 50,
  INVOICE_INFO_RIGHT_X: 200,
  TABLE_START_X: 50,
  TABLE_WIDTH: 500,
  TABLE_ROW_HEIGHT: 20,
  TABLE_DESCRIPTION_X: 55,
  TABLE_DESCRIPTION_WIDTH: 240,
  TABLE_QUANTITY_X: 300,
  TABLE_QUANTITY_WIDTH: 70,
  TABLE_PRICE_X: 370,
  TABLE_PRICE_WIDTH: 70,
  TABLE_TOTAL_X: 440,
  TABLE_TOTAL_WIDTH: 70,
  SEPARATOR_START_X: 50,
  SEPARATOR_END_X: 550,
  TOTALS_LABEL_X: 400,
  TOTALS_VALUE_X: 500,
  MOVE_DOWN_SECTION: 2,
  TABLE_CELL_PADDING_Y: 5,
};

// Style constants
const STYLE = {
  HEADER_FONT_SIZE: 20,
  BODY_FONT_SIZE: 10,
  FOOTER_FONT_SIZE: 8,
  SMALL_FONT_SIZE: 8,
  TABLE_HEADER_BG_COLOR: '#e6e6e6',
  TABLE_ROW_BG_COLOR: '#f6f6f6',
  SEPARATOR_COLOR: '#aaaaaa',
  LINE_WIDTH: 1,
  TEXT_COLOR: '#000000',
};

// File and path constants
const FILES = {
  TEMP_DIR: join(process.cwd(), 'uploads', 'temp'),
  INVOICE_OBJECT_NAME_TEMPLATE: (transactionId: string, invoiceId: string) => 
    `invoices/${transactionId}/${invoiceId}.pdf`,
};

// Business constants
const BUSINESS = {
  URL_EXPIRATION_SECONDS: 60 * 60, // 1 hour
  CURRENCY_SYMBOLS: {
    USD: '$',
    EUR: '€',
    ETH: 'Ξ',
    BTC: '₿',
  } as Record<string, string>,
  STATUS_DISPLAY_NAMES: {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  } as Record<string, string>,
  FOOTER_TEXT: 'Thank you for using OFFER-HUB - The decentralized freelancer platform',
  BLOCKCHAIN_NOTE: (hash: string) => 
    `This invoice has been recorded on the blockchain with the transaction hash: ${hash}`,
};

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  createdAt: Date;
  dueDate?: Date;
  
  transactionId: string;
  transactionHash: string;
  amount: number;
  currency: string;
  status: string;
  
  client: {
    id: string;
    name: string;
    email: string;
    address?: string;
  };
  
  freelancer: {
    id: string;
    name: string;
    email: string;
    address?: string;
    walletAddress?: string;
  };
  
  project: {
    id: string;
    title: string;
    description: string;
  };
  
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  
  subtotal: number;
  tax?: number;
  taxRate?: number;
  total: number;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(private readonly storageService: StorageService) {}

  /**
   * Generates an invoice in PDF format and stores it in MinIO
   * @param invoiceData Invoice data
   * @returns Promise that resolves with the URL of the invoice in MinIO
   */
  async generateInvoice(invoiceData: InvoiceData): Promise<string> {
    const tempFilePath = this.getTempFilePath(invoiceData.id);
    
    return new Promise<string>(async (resolve, reject) => {
      try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: LAYOUT.PAGE_MARGIN });
        
        // Pipe its output to a temporary file
        doc.pipe(createWriteStream(tempFilePath));
        
        // Add content to the PDF
        this.addHeader(doc, invoiceData);
        this.addPartyInformation(doc, invoiceData);
        this.addInvoiceInformation(doc, invoiceData);
        this.addItems(doc, invoiceData);
        this.addTotals(doc, invoiceData);
        this.addFooter(doc, invoiceData);
        
        // Event for when the PDF writing is finished
        doc.on('end', async () => {
          try {
            // Object name in MinIO
            const objectName = FILES.INVOICE_OBJECT_NAME_TEMPLATE(
              invoiceData.transactionId,
              invoiceData.id
            );
            
            // Metadata for the object
            const metadata = {
              'Transaction-ID': invoiceData.transactionId,
              'Invoice-Number': invoiceData.invoiceNumber,
              'Content-Disposition': `attachment; filename="invoice-${invoiceData.id}.pdf"`,
            };
            
            // Upload the file to MinIO
            const fileUrl = await this.storageService.uploadFile(
              tempFilePath,
              objectName,
              metadata
            );
            
            // Delete the temporary file
            this.cleanupTempFile(tempFilePath);
            
            this.logger.log(`Invoice generated and stored in MinIO: ${fileUrl}`);
            resolve(fileUrl);
          } catch (error) {
            this.logger.error(`Error uploading invoice to MinIO: ${error.message}`);
            reject(error);
          }
        });
        
        // Finalize the PDF
        doc.end();
      } catch (error) {
        this.cleanupTempFile(tempFilePath);
        this.logger.error(`Error generating the invoice: ${error.message}`);
        reject(error);
      }
    });
  }

  /**
   * Generates a temporary path to save the PDF before uploading it to MinIO
   */
  private getTempFilePath(invoiceId: string): string {
    const uploadsDir = FILES.TEMP_DIR;
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    
    return join(uploadsDir, `invoice-${invoiceId}-${Date.now()}.pdf`);
  }

  /**
   * Deletes a temporary file after uploading it to MinIO
   */
  private cleanupTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      this.logger.warn(`Error deleting temporary file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Downloads an invoice from MinIO
   * @param transactionId Transaction ID
   * @param invoiceId Invoice ID
   * @returns Temporary path where the file was downloaded
   */
  async downloadInvoice(transactionId: string, invoiceId: string): Promise<string> {
    const objectName = FILES.INVOICE_OBJECT_NAME_TEMPLATE(transactionId, invoiceId);
    const tempFilePath = this.getTempFilePath(invoiceId);
    
    try {
      // Check if the file exists in MinIO
      const exists = await this.storageService.fileExists(objectName);
      if (!exists) throw new Error(`The invoice does not exist in storage`);
      
      // Download the file from MinIO to a temporary location
      return await this.storageService.downloadFile(objectName, tempFilePath);
    } catch (error) {
      this.logger.error(`Error downloading invoice: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets the public URL of an invoice
   * @param transactionId Transaction ID
   * @param invoiceId Invoice ID
   * @returns URL to access the invoice
   */
  async getInvoiceUrl(transactionId: string, invoiceId: string): Promise<string> {
    const objectName = FILES.INVOICE_OBJECT_NAME_TEMPLATE(transactionId, invoiceId);
    
    try {
      // Check if the file exists in MinIO
      const exists = await this.storageService.fileExists(objectName);
      if (!exists) throw new Error(`The invoice does not exist in storage`);
      
      // Get URL with expiration time
      return await this.storageService.getFileUrl(objectName, BUSINESS.URL_EXPIRATION_SECONDS);
    } catch (error) {
      this.logger.error(`Error getting invoice URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adds the header to the PDF document
   */
  private addHeader(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    // Document title
    doc.fontSize(STYLE.HEADER_FONT_SIZE)
       .font('Helvetica-Bold')
       .text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(STYLE.BODY_FONT_SIZE).font('Helvetica');
  }

  /**
   * Adds the information of the involved parties (client and freelancer)
   */
  private addPartyInformation(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    const startY = doc.y;

    // Freelancer information (issuer)
    doc.font('Helvetica-Bold').text('From:', LAYOUT.LEFT_COLUMN_X, startY);
    doc.font('Helvetica').text(invoiceData.freelancer.name);
    doc.text(invoiceData.freelancer.email);

    if (invoiceData.freelancer.address) doc.text(invoiceData.freelancer.address);

    if (invoiceData.freelancer.walletAddress) doc.text(`Wallet: ${invoiceData.freelancer.walletAddress}`);

    // Client information (receiver)
    doc.font('Helvetica-Bold').text('To:', LAYOUT.RIGHT_COLUMN_X, startY);
    doc.font('Helvetica').text(invoiceData.client.name);
    doc.text(invoiceData.client.email);
    if (invoiceData.client.address) {
      doc.text(invoiceData.client.address);
    }

    doc.moveDown(LAYOUT.MOVE_DOWN_SECTION);
  }

  /**
   * Adds the invoice information (number, dates, etc.)
   */
  private addInvoiceInformation(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    doc.font('Helvetica-Bold').text('Invoice Information:');
    doc.font('Helvetica');
    
    const invoiceInfoY = doc.y;
    
    // Left column
    doc.text('Invoice Number:', LAYOUT.INVOICE_INFO_LEFT_X, invoiceInfoY);
    doc.text('Issue Date:', LAYOUT.INVOICE_INFO_LEFT_X, doc.y + 15);

    if (invoiceData.dueDate) doc.text('Due Date:', LAYOUT.INVOICE_INFO_LEFT_X, doc.y + 15);
    
    doc.text('Transaction ID:', LAYOUT.INVOICE_INFO_LEFT_X, doc.y + 15);
    doc.text('Transaction Hash:', LAYOUT.INVOICE_INFO_LEFT_X, doc.y + 15);
    
    // Right column (values)
    doc.text(invoiceData.invoiceNumber, LAYOUT.INVOICE_INFO_RIGHT_X, invoiceInfoY);
    doc.text(this.formatDate(invoiceData.createdAt), LAYOUT.INVOICE_INFO_RIGHT_X, invoiceInfoY + 15);

    if (invoiceData.dueDate) {
      doc.text(this.formatDate(invoiceData.dueDate), LAYOUT.INVOICE_INFO_RIGHT_X, doc.y);
      doc.moveUp();
    }

    doc.text(invoiceData.transactionId, LAYOUT.INVOICE_INFO_RIGHT_X, doc.y + 15);
    doc.text(invoiceData.transactionHash, LAYOUT.INVOICE_INFO_RIGHT_X, doc.y + 15);
    
    doc.moveDown(LAYOUT.MOVE_DOWN_SECTION);
    
    // Project information
    doc.font('Helvetica-Bold').text('Project:');
    doc.font('Helvetica').text(invoiceData.project.title);
    doc.font('Helvetica').text(invoiceData.project.description, {
      width: LAYOUT.TABLE_WIDTH,
      align: 'left'
    });
    
    doc.moveDown(LAYOUT.MOVE_DOWN_SECTION);
  }

  /**
   * Adds the items/services to the invoice
   */
  private addItems(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    // Table headers
    this.drawTableHeader(doc);

    // Table rows
    const items = invoiceData.items;
    let y = doc.y;
    
    items.forEach((item, index) => {
      // Alternate colors for better readability
      if (index % 2 === 0) {
        doc.fillColor(STYLE.TABLE_ROW_BG_COLOR)
           .rect(LAYOUT.TABLE_START_X, y, LAYOUT.TABLE_WIDTH, LAYOUT.TABLE_ROW_HEIGHT)
           .fill();
      }

      doc.fillColor(STYLE.TEXT_COLOR);
      
      doc.text(item.description, LAYOUT.TABLE_DESCRIPTION_X, y + LAYOUT.TABLE_CELL_PADDING_Y, { 
        width: LAYOUT.TABLE_DESCRIPTION_WIDTH 
      });
      doc.text(item.quantity.toString(), LAYOUT.TABLE_QUANTITY_X, y + LAYOUT.TABLE_CELL_PADDING_Y, { 
        width: LAYOUT.TABLE_QUANTITY_WIDTH, 
        align: 'center' 
      });
      doc.text(
        this.formatCurrency(item.unitPrice, invoiceData.currency), 
        LAYOUT.TABLE_PRICE_X, 
        y + LAYOUT.TABLE_CELL_PADDING_Y, 
        { width: LAYOUT.TABLE_PRICE_WIDTH, align: 'right' }
      );
      doc.text(
        this.formatCurrency(item.total, invoiceData.currency), 
        LAYOUT.TABLE_TOTAL_X, 
        y + LAYOUT.TABLE_CELL_PADDING_Y, 
        { width: LAYOUT.TABLE_TOTAL_WIDTH, align: 'right' }
      );
      
      y += LAYOUT.TABLE_ROW_HEIGHT;
    });
    
    doc.moveDown(LAYOUT.MOVE_DOWN_SECTION);
  }

  /**
   * Draws the table headers for the items
   */
  private drawTableHeader(doc: typeof PDFDocument): void {
    doc.font('Helvetica-Bold');
    
    // Header background
    doc.fillColor(STYLE.TABLE_HEADER_BG_COLOR)
       .rect(LAYOUT.TABLE_START_X, doc.y, LAYOUT.TABLE_WIDTH, LAYOUT.TABLE_ROW_HEIGHT)
       .fill();
    doc.fillColor(STYLE.TEXT_COLOR);
    
    // Header texts
    doc.text('Description', LAYOUT.TABLE_DESCRIPTION_X, doc.y + LAYOUT.TABLE_CELL_PADDING_Y, { 
      width: LAYOUT.TABLE_DESCRIPTION_WIDTH 
    });
    doc.text('Quantity', LAYOUT.TABLE_QUANTITY_X, doc.y + LAYOUT.TABLE_CELL_PADDING_Y, { 
      width: LAYOUT.TABLE_QUANTITY_WIDTH, 
      align: 'center' 
    });
    doc.text('Price', LAYOUT.TABLE_PRICE_X, doc.y + LAYOUT.TABLE_CELL_PADDING_Y, { 
      width: LAYOUT.TABLE_PRICE_WIDTH, 
      align: 'right' 
    });
    doc.text('Total', LAYOUT.TABLE_TOTAL_X, doc.y + LAYOUT.TABLE_CELL_PADDING_Y, { 
      width: LAYOUT.TABLE_TOTAL_WIDTH, 
      align: 'right' 
    });
    
    doc.font('Helvetica');
    doc.moveDown();
  }

  /**
   * Adds the totals to the invoice
   */
  private addTotals(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    // Separator line
    const y = doc.y;
    doc.strokeColor(STYLE.SEPARATOR_COLOR)
       .lineWidth(STYLE.LINE_WIDTH)
       .moveTo(LAYOUT.SEPARATOR_START_X, y)
       .lineTo(LAYOUT.SEPARATOR_END_X, y)
       .stroke();
    doc.moveDown();
    
    // Subtotal
    doc.font('Helvetica').text('Subtotal:', LAYOUT.TOTALS_LABEL_X, doc.y);
    doc.text(
      this.formatCurrency(invoiceData.subtotal, invoiceData.currency),
      LAYOUT.TOTALS_VALUE_X, 
      doc.y, 
      { align: 'right' }
    );
    doc.moveDown(0.5);
    
    // Taxes (if applicable)
    if (invoiceData.tax && invoiceData.taxRate) {
      doc.text(`Tax (${invoiceData.taxRate}%):`, LAYOUT.TOTALS_LABEL_X, doc.y);
      doc.text(
        this.formatCurrency(invoiceData.tax, invoiceData.currency),
        LAYOUT.TOTALS_VALUE_X, 
        doc.y, 
        { align: 'right' }
      );
      doc.moveDown(0.5);
    }
    
    // Total
    doc.font('Helvetica-Bold').text('Total:', LAYOUT.TOTALS_LABEL_X, doc.y);
    doc.text(
      this.formatCurrency(invoiceData.total, invoiceData.currency),
      LAYOUT.TOTALS_VALUE_X, 
      doc.y, 
      { align: 'right' }
    );
    
    doc.moveDown(LAYOUT.MOVE_DOWN_SECTION);
  }

  /**
   * Adds the footer to the invoice
   */
  private addFooter(doc: typeof PDFDocument, invoiceData: InvoiceData): void {
    doc.font('Helvetica');
    
    // Status information
    doc.fontSize(STYLE.BODY_FONT_SIZE)
       .text(`Status: ${this.formatStatus(invoiceData.status)}`, { align: 'center' });
    
    // Thank you note
    doc.moveDown();
    doc.text(BUSINESS.FOOTER_TEXT, { align: 'center' });
    
    // Blockchain note
    doc.moveDown();
    doc.fontSize(STYLE.FOOTER_FONT_SIZE)
       .text(BUSINESS.BLOCKCHAIN_NOTE(invoiceData.transactionHash), { align: 'center' });
  }

  /**
   * Formats the transaction status to display on the invoice
   */
  private formatStatus(status: string): string {
    return BUSINESS.STATUS_DISPLAY_NAMES[status] || status;
  }

  /**
   * Formats dates to display on the invoice
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formats amounts with currency symbol
   */
  private formatCurrency(amount: any, currency: string): string {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) return `${currency}0.00`;

    const symbol = BUSINESS.CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${numericAmount.toFixed(2)}`;
  }
}

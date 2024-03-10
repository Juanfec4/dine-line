import { Injectable } from '@nestjs/common';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Receipt } from 'src/common/interfaces';

@Injectable()
export class PdfService {
  async create(receipt: Receipt): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Add a header
    doc
      .image(this.resolveLogoPath('logo.png'), 50, 45, { width: 50 })
      .fontSize(20)
      .text('Order Receipt', 110, 57)
      .fontSize(10)
      .text('Order Date: ' + receipt.orderDate.toLocaleDateString(), {
        align: 'right',
      })
      .moveDown(2);

    // Horizontal line separator
    doc.moveTo(50, 125).lineTo(550, 125).stroke();

    // Delivery Address Section
    doc.fontSize(12).text('Delivery Address:', 50, 140);
    const fullAddress = `${receipt.address.addressLine1}, ${receipt.address.city}, ${receipt.address.province}, ${receipt.address.country}`;
    doc.fontSize(10).text(fullAddress, 50, 155).moveDown(2);

    // Adding a table-like structure for the Items
    const tableTop = 200;
    doc.fontSize(12);
    this.addTableHeader(doc, tableTop);
    let position = tableTop + 20;

    receipt.items.forEach((item, index) => {
      const y = position + index * 30;
      this.addTableRow(
        doc,
        y,
        item.menuItem.name,
        item.quantity.toString(),
        item.menuItem.price.toFixed(2),
        (item.quantity * item.menuItem.price).toFixed(2),
      );
    });

    // Total Price
    doc
      .fontSize(14)
      .text(
        `Total Price: ${receipt.totalPrice.toFixed(2)}`,
        400,
        position + (receipt.items.length + 1) * 30,
        {
          align: 'right',
        },
      );

    doc.end();

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.on('error', (err) => reject(err));
    });
  }

  addTableHeader(doc, y) {
    doc
      .fontSize(12)
      .text('Item', 100, y)
      .text('Quantity', 200, y)
      .text('Price', 300, y)
      .text('Total', 400, y);
    doc
      .moveTo(50, y + 20)
      .lineTo(550, y + 20)
      .stroke();
  }

  addTableRow(doc, y, item, quantity, price, total) {
    doc
      .fontSize(10)
      .text(item, 100, y)
      .text(quantity, 200, y)
      .text(price, 300, y)
      .text(total, 400, y);
  }

  private resolveLogoPath(logo: string) {
    const basePath = process.cwd();

    const filePath = path.join(basePath, 'public', 'media', `${logo}`);

    return path.resolve(filePath);
  }
}

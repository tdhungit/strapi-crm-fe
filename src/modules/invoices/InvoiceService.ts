class InvoiceService {
  printInvoice(
    printRef: React.RefObject<HTMLDivElement | null>,
    invoice: any,
    callback: (status: boolean, message: string) => void
  ) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      callback(
        false,
        'Unable to open print window. Please check popup settings.'
      );
      return;
    }

    // Get the invoice content
    const invoiceContent = printRef?.current?.innerHTML || '';

    // Create print-friendly HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 20px;
              color: #000;
              background: white;
            }
            .ant-card {
              border: none !important;
              box-shadow: none !important;
            }
            .ant-card-head {
              border-bottom: 1px solid #d9d9d9;
              padding: 16px 0;
            }
            .ant-card-body {
              padding: 16px 0;
            }
            .ant-table {
              border: 1px solid #d9d9d9;
            }
            .ant-table-thead > tr > th {
              background: #fafafa;
              border-bottom: 1px solid #d9d9d9;
              padding: 8px;
            }
            .ant-table-tbody > tr > td {
              border-bottom: 1px solid #d9d9d9;
              padding: 8px;
            }
            .ant-tag {
              border: 1px solid #d9d9d9;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .text-green-600 {
              color: #16a34a !important;
            }
            .bg-gray-50 {
              background-color: #f9fafb !important;
              padding: 16px;
              border-radius: 6px;
            }
            .space-y-6 > * + * {
              margin-top: 24px;
            }
            .space-y-2 > * + * {
              margin-top: 8px;
            }
            .flex {
              display: flex;
            }
            .justify-between {
              justify-content: space-between;
            }
            .items-center {
              align-items: center;
            }
            .items-start {
              align-items: flex-start;
            }
            .text-right {
              text-align: right;
            }
            .text-lg {
              font-size: 18px;
            }
            .text-2xl {
              font-size: 24px;
            }
            .font-semibold {
              font-weight: 600;
            }
            .mb-2 {
              margin-bottom: 8px;
            }
            .mb-6 {
              margin-bottom: 24px;
            }
            @media print {
              body {
                margin: 0;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        callback(true, 'Print successful');
      }, 500);
    };
  }
}

export default new InvoiceService();

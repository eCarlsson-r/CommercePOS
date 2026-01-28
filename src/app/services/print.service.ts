// src/app/services/print.service.ts
export class PrintService {
  printReceipt(data: any) {
    // 1. Update the state of your ReceiptComponent with the data
    // 2. Trigger the browser print dialog
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
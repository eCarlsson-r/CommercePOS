import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumStock',
  standalone: true
})
export class SumStockPipe implements PipeTransform {
  /**
   * Transforms an array of stock objects into a total sum
   * @param stocks Array of objects containing a 'quantity' property
   */
  transform(stocks: any[] | undefined | null): number {
    if (!stocks || !Array.isArray(stocks)) {
      return 0;
    }
    return stocks.reduce((acc, stock) => acc + (Number(stock.quantity) || 0), 0);
  }
}
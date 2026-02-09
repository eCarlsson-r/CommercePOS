export function encodePrice(price: number, cipher: string[]): string {
  const digits = price.toString().split('');
  return digits.map(d => cipher[parseInt(d)]).join('');
}
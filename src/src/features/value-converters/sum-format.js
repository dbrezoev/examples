export class SumFormatValueConverter {
  toView(value) {
    return `${value.amount.toFixed(2)} ${value.currency}`;
  }
}

export const parsePrice = (priceVal: any): number => {
  if (typeof priceVal === 'number') return isNaN(priceVal) ? 0 : priceVal;
  if (!priceVal) return 0;
  const str = String(priceVal).replace(/[^\d.,]/g, '');
  if (str.includes(',') && str.includes('.')) {
    const lastComma = str.lastIndexOf(',');
    const lastDot = str.lastIndexOf('.');
    if (lastComma > lastDot) {
      return Number(str.replace(/\./g, '').replace(',', '.'));
    } else {
      return Number(str.replace(/,/g, ''));
    }
  }
  return Number(str.replace(',', '.')) || 0;
};

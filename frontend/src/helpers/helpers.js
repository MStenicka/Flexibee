export function stripCodePrefix(str) {
  return str.startsWith('code:') ? str.substring(5) : str;
}

export function formatPrice(price) {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }
  const formattedPrice = price.toFixed(2);

  const parts = formattedPrice.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts.join(',');
}

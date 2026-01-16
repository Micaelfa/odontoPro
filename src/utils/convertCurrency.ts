export function convertRealToCents(amount: string) {
  if (!amount) return 0;

  // mantém só dígitos, ponto e vírgula (remove R$, espaços, etc.)
  const cleaned = amount.replace(/[^\d.,]/g, ""); // "R$ 1.500,00" -> "1.500,00"

  // remove separador de milhar e normaliza vírgula para ponto
  const numericString = cleaned.replace(/\./g, "").replace(",", "."); // "1500,00" -> "1500.00"

  const numericPrice = parseFloat(numericString);

  if (isNaN(numericPrice)) {
    return 0; // ou lança erro, se você preferir tratar
  }

  const priceInCents = Math.round(numericPrice * 100); // 1500.00 -> 150000

  return priceInCents;
}

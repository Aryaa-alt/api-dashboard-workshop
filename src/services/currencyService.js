/**
 * Frankfurter Exchange-Rate Service (v2)
 * Endpoint: https://api.frankfurter.dev/v2/rates
 * Reference exchange rates from European Central Bank (ECB)
 */

const BASE_URL = 'https://api.frankfurter.dev/v2/rates';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'United States Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'CHF' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'AED' },
];

export function getCurrencyMeta(code) {
  return (
    SUPPORTED_CURRENCIES.find((c) => c.code === code) || {
      code,
      name: code,
      flag: '🌐',
      symbol: code,
    }
  );
}

/**
 * Fetch exchange rates for a base currency against specified quote currencies
 * @param {Object} options
 * @param {string} options.base - Base currency code (default: 'USD')
 * @param {string[]} options.quotes - Array of quote currency codes (default: ['INR', 'EUR', 'GBP', 'JPY'])
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>} Normalized rates response
 */
export async function fetchExchangeRates({
  base = 'USD',
  quotes = ['INR', 'EUR', 'GBP', 'JPY'],
  signal,
} = {}) {
  const quotesParam = Array.isArray(quotes) ? quotes.join(',') : quotes;
  const url = `${BASE_URL}?base=${encodeURIComponent(base)}&quotes=${encodeURIComponent(quotesParam)}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    let errorMsg = `Frankfurter API Error (HTTP ${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.message) {
        errorMsg = `Currency Error: ${errJson.message}`;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  // Frankfurter v2 returns an array of rate records:
  // e.g. [{"date":"2026-10-25","base":"USD","quote":"INR","rate":94.78}, ...]
  const rawArray = await response.json();

  if (!Array.isArray(rawArray) || rawArray.length === 0) {
    throw new Error(`No exchange rate records found for ${base} against [${quotesParam}].`);
  }

  const rateDate = rawArray[0]?.date || 'Recent';
  const ratesMap = {};
  const items = [];

  for (const item of rawArray) {
    const meta = getCurrencyMeta(item.quote);
    const numericRate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate);
    const inverse = numericRate > 0 ? 1 / numericRate : null;

    ratesMap[item.quote] = numericRate;

    items.push({
      quote: item.quote,
      base: item.base,
      rate: numericRate,
      inverseRate: inverse,
      date: item.date,
      name: meta.name,
      flag: meta.flag,
      symbol: meta.symbol,
    });
  }

  return {
    base,
    rateDate,
    ratesMap,
    items,
    fetchedAt: new Date(),
  };
}

/**
 * Convert a specific amount between source and target currency
 * @param {Object} options
 * @param {string} options.from
 * @param {string} options.to
 * @param {number} options.amount
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>}
 */
export async function convertCurrencyPair({
  from = 'USD',
  to = 'INR',
  amount = 1,
  signal,
} = {}) {
  if (from === to) {
    return {
      from,
      to,
      rate: 1.0,
      convertedAmount: Number(amount) || 0,
      date: new Date().toISOString().slice(0, 10),
    };
  }

  const data = await fetchExchangeRates({
    base: from,
    quotes: [to],
    signal,
  });

  const rate = data.ratesMap[to];
  if (rate === undefined) {
    throw new Error(`Requested currency pair ${from} to ${to} is not available in Frankfurter reference data.`);
  }

  const numAmount = Number(amount) || 0;
  return {
    from,
    to,
    rate,
    amount: numAmount,
    convertedAmount: numAmount * rate,
    date: data.rateDate,
  };
}

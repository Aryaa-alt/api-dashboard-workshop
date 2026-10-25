/**
 * Global Pulse — Centralized Formatting Utilities
 * Guarantees consistent typography, rounding, and null/missing representations
 * across all cards, charts, tables, and headers.
 */

/**
 * Format temperature to one decimal place with unit
 * @param {number|null|undefined} temp
 * @param {string} [unit='°C']
 * @returns {string}
 */
export function formatTemperature(temp, unit = '°C') {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return '--';
  }
  return `${Number(temp).toFixed(1)}${unit}`;
}

/**
 * Format percentage with explicit sign and two decimal places
 * @param {number|null|undefined} val
 * @param {boolean} [showSign=true]
 * @returns {string}
 */
export function formatPercentage(val, showSign = true) {
  if (val === null || val === undefined || isNaN(val)) {
    return '--';
  }
  const num = Number(val);
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

/**
 * Format exchange rate with consistent precision (default 4 decimal places)
 * @param {number|null|undefined} rate
 * @param {number} [decimals=4]
 * @returns {string}
 */
export function formatExchangeRate(rate, decimals = 4) {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return '--';
  }
  return Number(rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency amount with symbol and thousands separators
 * @param {number|null|undefined} amount
 * @param {string} [symbol='']
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatCurrencyAmount(amount, symbol = '', decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '--';
  }
  const formatted = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return symbol ? `${symbol} ${formatted}` : formatted;
}

/**
 * Format timestamp consistently as 24h or 12h time string
 * @param {Date|string|number|null|undefined} dateInput
 * @returns {string}
 */
export function formatTimestamp(dateInput) {
  if (!dateInput) return 'Awaiting Sync';
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return 'Invalid Time';
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format standard calendar date (e.g. "2026-10-25" -> "Oct 25, 2026")
 * @param {string|Date|null|undefined} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '--';
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

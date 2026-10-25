/**
 * US EPA Air Quality Index (AQI) Standard Classification
 * Reference: https://www.airnow.gov/aqi/aqi-basics/
 */

export const US_AQI_BANDS = [
  {
    min: 0,
    max: 50,
    category: 'Good',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    badgeVariant: 'success',
    colorHex: '#10b981',
    textColor: 'text-emerald-400',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  {
    min: 51,
    max: 100,
    category: 'Moderate',
    description: 'Air quality is acceptable. However, unusually sensitive people should consider limiting prolonged outdoor exertion.',
    badgeVariant: 'warning',
    colorHex: '#eab308',
    textColor: 'text-yellow-400',
    bgLight: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  {
    min: 101,
    max: 150,
    category: 'Unhealthy for Sensitive Groups',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    badgeVariant: 'warning',
    colorHex: '#f97316',
    textColor: 'text-amber-400',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  {
    min: 151,
    max: 200,
    category: 'Unhealthy',
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious effects.',
    badgeVariant: 'danger',
    colorHex: '#ef4444',
    textColor: 'text-rose-400',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  {
    min: 201,
    max: 300,
    category: 'Very Unhealthy',
    description: 'Health alert: The risk of health effects is increased for everyone. Avoid prolonged outdoor activities.',
    badgeVariant: 'purple',
    colorHex: '#a855f7',
    textColor: 'text-purple-400',
    bgLight: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  {
    min: 301,
    max: 9999,
    category: 'Hazardous',
    description: 'Health warning of emergency conditions: Everyone is more likely to be affected. Remain indoors.',
    badgeVariant: 'danger',
    colorHex: '#881337',
    textColor: 'text-rose-600',
    bgLight: 'bg-rose-950/40',
    border: 'border-rose-600/50',
  },
];

/**
 * Returns the US AQI standard classification for a numerical AQI value
 * @param {number|null|undefined} aqi
 */
export function getAqiClassification(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return {
      category: 'Data Unavailable',
      description: 'Air quality index telemetry is currently missing or unavailable from this station.',
      badgeVariant: 'neutral',
      colorHex: '#64748b',
      textColor: 'text-slate-400',
      bgLight: 'bg-slate-800/40',
      border: 'border-slate-700/50',
      isAvailable: false,
    };
  }

  const band = US_AQI_BANDS.find((b) => aqi >= b.min && aqi <= b.max);
  if (band) {
    return { ...band, isAvailable: true };
  }

  // Fallback for extreme values
  return {
    category: 'Hazardous',
    description: 'Health warning of emergency conditions: Everyone is more likely to be affected.',
    badgeVariant: 'danger',
    colorHex: '#881337',
    textColor: 'text-rose-600',
    bgLight: 'bg-rose-950/40',
    border: 'border-rose-600/50',
    isAvailable: true,
  };
}

/**
 * Distinguishes an unavailable/missing value from physical zero (0)
 * @param {any} val
 * @param {string} unit
 * @param {string} fallback
 */
export function formatMeasurement(val, unit = '', fallback = 'N/A') {
  if (val === null || val === undefined || isNaN(val)) {
    return {
      display: fallback,
      raw: null,
      unit: '',
      isAvailable: false,
      isZero: false,
    };
  }
  return {
    display: `${val}`,
    raw: Number(val),
    unit: unit || '',
    isAvailable: true,
    isZero: Number(val) === 0,
  };
}

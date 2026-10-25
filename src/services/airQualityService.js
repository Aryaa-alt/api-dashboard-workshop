/**
 * Air Quality Service — Open-Meteo Integration
 * Endpoint: https://air-quality-api.open-meteo.com/v1/air-quality
 */

import { formatMeasurement } from '../utils/aqiStandards';

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const KOLKATA_COORDS = {
  latitude: 22.5726,
  longitude: 88.3639,
  name: 'Kolkata',
  country: 'India',
};

/**
 * Fetch live air quality telemetry from Open-Meteo Air Quality API
 * @param {Object} options
 * @param {number} options.latitude
 * @param {number} options.longitude
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>} Normalized air quality payload
 */
export async function fetchAirQualityData({
  latitude = KOLKATA_COORDS.latitude,
  longitude = KOLKATA_COORDS.longitude,
  signal,
} = {}) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'us_aqi',
      'pm2_5',
      'pm10',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
    ].join(','),
    hourly: [
      'us_aqi',
      'pm2_5',
      'pm10',
    ].join(','),
    forecast_days: '2',
    timezone: 'auto',
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.reason) errorDetail += `: ${errJson.reason}`;
    } catch {
      // ignore json parse error
    }
    throw new Error(`Open-Meteo Air Quality API Error (${errorDetail})`);
  }

  const raw = await response.json();

  if (!raw.current) {
    throw new Error('Invalid Open-Meteo Air Quality payload: "current" block missing.');
  }

  const units = raw.current_units || {};

  // Formatter that guarantees null/undefined is distinguished from 0
  const current = {
    time: raw.current.time,
    usAqi: formatMeasurement(raw.current.us_aqi, units.us_aqi || 'USAQI'),
    pm25: formatMeasurement(raw.current.pm2_5, units.pm2_5 || 'μg/m³'),
    pm10: formatMeasurement(raw.current.pm10, units.pm10 || 'μg/m³'),
    carbonMonoxide: formatMeasurement(raw.current.carbon_monoxide, units.carbon_monoxide || 'μg/m³'),
    nitrogenDioxide: formatMeasurement(raw.current.nitrogen_dioxide, units.nitrogen_dioxide || 'μg/m³'),
    sulphurDioxide: formatMeasurement(raw.current.sulphur_dioxide, units.sulphur_dioxide || 'μg/m³'),
    ozone: formatMeasurement(raw.current.ozone, units.ozone || 'μg/m³'),
  };

  // 24-Hour Hourly AQI and PM2.5 slices for Recharts
  const hourlyList = [];
  if (raw.hourly && Array.isArray(raw.hourly.time)) {
    const currentTimeStr = raw.current.time.slice(0, 13);
    let startIndex = raw.hourly.time.findIndex((t) => t.startsWith(currentTimeStr));
    if (startIndex === -1) startIndex = 0;

    const sliceEnd = Math.min(startIndex + 24, raw.hourly.time.length);
    for (let i = startIndex; i < sliceEnd; i++) {
      const rawIso = raw.hourly.time[i];
      const dateObj = new Date(rawIso);
      const timeLabel = isNaN(dateObj)
        ? rawIso.slice(11, 16)
        : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      hourlyList.push({
        rawTime: rawIso,
        time: timeLabel,
        usAqi: raw.hourly.us_aqi ? raw.hourly.us_aqi[i] : null,
        pm25: raw.hourly.pm2_5 ? raw.hourly.pm2_5[i] : null,
        pm10: raw.hourly.pm10 ? raw.hourly.pm10[i] : null,
      });
    }
  }

  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    timezoneAbbr: raw.timezone_abbreviation,
    elevation: raw.elevation,
    current,
    hourly: hourlyList,
    fetchedAt: new Date(),
  };
}

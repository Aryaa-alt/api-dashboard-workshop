/**
 * Weather Service — Open-Meteo Integration
 * Endpoint: https://api.open-meteo.com/v1/forecast
 * Default Coordinates (Kolkata): Lat 22.5726, Lon 88.3639
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const KOLKATA_COORDS = {
  latitude: 22.5726,
  longitude: 88.3639,
  name: 'Kolkata',
  country: 'India',
};

/**
 * Fetch live weather data from Open-Meteo API
 * @param {Object} options
 * @param {number} options.latitude
 * @param {number} options.longitude
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Object>} Normalized weather payload
 */
export async function fetchWeatherData({
  latitude = KOLKATA_COORDS.latitude,
  longitude = KOLKATA_COORDS.longitude,
  signal,
} = {}) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'wind_speed_10m',
      'weather_code',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation',
      'weather_code',
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
      // ignore json parse failure
    }
    throw new Error(`Open-Meteo Weather API Error (${errorDetail})`);
  }

  const raw = await response.json();

  if (!raw.current) {
    throw new Error('Invalid Open-Meteo payload: "current" block missing.');
  }

  // Normalize Current Telemetry
  const current = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    humidity: raw.current.relative_humidity_2m,
    feelsLike: raw.current.apparent_temperature,
    precipitation: raw.current.precipitation,
    windSpeed: raw.current.wind_speed_10m,
    weatherCode: raw.current.weather_code,
    units: {
      temperature: raw.current_units?.temperature_2m || '°C',
      humidity: raw.current_units?.relative_humidity_2m || '%',
      feelsLike: raw.current_units?.apparent_temperature || '°C',
      precipitation: raw.current_units?.precipitation || 'mm',
      windSpeed: raw.current_units?.wind_speed_10m || 'km/h',
    },
  };

  // Normalize 24-Hour Hourly Forecast for Recharts
  // Find current hour index or default to 0, then take next 24 hours
  const hourlyList = [];
  if (raw.hourly && Array.isArray(raw.hourly.time)) {
    const currentTimeStr = raw.current.time.slice(0, 13); // 'YYYY-MM-DDTHH'
    let startIndex = raw.hourly.time.findIndex((t) => t.startsWith(currentTimeStr));
    if (startIndex === -1) startIndex = 0;

    const sliceEnd = Math.min(startIndex + 24, raw.hourly.time.length);
    for (let i = startIndex; i < sliceEnd; i++) {
      const rawIso = raw.hourly.time[i];
      // Format time as HH:00
      const dateObj = new Date(rawIso);
      const timeLabel = isNaN(dateObj)
        ? rawIso.slice(11, 16)
        : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      hourlyList.push({
        rawTime: rawIso,
        time: timeLabel,
        temperature: raw.hourly.temperature_2m[i],
        precipitation: raw.hourly.precipitation ? raw.hourly.precipitation[i] : 0,
        weatherCode: raw.hourly.weather_code ? raw.hourly.weather_code[i] : 0,
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

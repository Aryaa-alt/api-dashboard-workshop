/**
 * Global Pulse — Initial Mock Data Layer
 * 
 * NOTE: These are clearly identified placeholder values designed to establish
 * the presentation geometry and component contracts.
 * The data layer is decoupled so that live Open-Meteo & Frankfurter API calls
 * can replace these structures in the subsequent integration stage.
 */

export const CITIES = [
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    flag: '🇮🇳',
    lat: 22.5726,
    lon: 88.3639,
    timezone: 'Asia/Kolkata',
    region: 'West Bengal',
    isDefault: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    lat: 19.0760,
    lon: 72.8777,
    timezone: 'Asia/Kolkata',
    region: 'Maharashtra',
  },

  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: 51.5074,
    lon: -0.1278,
    timezone: 'Europe/London',
    region: 'Greater London',
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    lat: 40.7128,
    lon: -74.0060,
    timezone: 'America/New_York',
    region: 'New York',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lon: 139.6503,
    timezone: 'Asia/Tokyo',
    region: 'Kanto',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    lat: 1.3521,
    lon: 103.8198,
    timezone: 'Asia/Singapore',
    region: 'Central',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    lat: 25.2048,
    lon: 55.2708,
    timezone: 'Asia/Dubai',
    region: 'Dubai',
  },
];

export const INITIAL_PLACEHOLDER_DATA = {
  isPlaceholder: true,
  stage: 'Initial UI Milestone',
  location: CITIES[0], // Kolkata
  
  // KPI Summary
  summary: {
    temperature: {
      value: 29.4,
      unit: '°C',
      condition: 'Hazy Sunshine',
      high: 32,
      low: 24,
      delta: '+1.2°C vs yesterday',
      isPositiveDelta: true,
    },
    feelsLike: {
      value: 33.1,
      unit: '°C',
      humidity: '68%',
      uvIndex: '6 (High)',
      wind: '12 km/h NE',
      delta: '+3.7°C heat index',
    },
    airQuality: {
      aqi: 142,
      category: 'Unhealthy for Sensitive Groups',
      color: 'amber',
      dominantPollutant: 'PM2.5',
      healthAdvice: 'Sensitive individuals should reduce prolonged outdoor exertion.',
      delta: '+14 pts vs 24h avg',
    },
    exchangeRate: {
      pair: 'USD / INR',
      rate: 86.82,
      inverseRate: 0.0115,
      changePercent: '+0.18%',
      isPositive: true,
      base: 'USD',
      target: 'INR',
      asOf: 'ECB Market Close',
    },
  },

  // 24h Hourly Forecast for Recharts
  hourlyWeather: [
    { time: '00:00', temp: 25, feelsLike: 27, rainProb: 10, humidity: 76 },
    { time: '03:00', temp: 24, feelsLike: 25, rainProb: 5, humidity: 82 },
    { time: '06:00', temp: 24, feelsLike: 26, rainProb: 15, humidity: 85 },
    { time: '09:00', temp: 27, feelsLike: 30, rainProb: 20, humidity: 72 },
    { time: '12:00', temp: 31, feelsLike: 35, rainProb: 35, humidity: 62 },
    { time: '15:00', temp: 32, feelsLike: 36, rainProb: 40, humidity: 58 },
    { time: '18:00', temp: 29, feelsLike: 33, rainProb: 25, humidity: 68 },
    { time: '21:00', temp: 27, feelsLike: 30, rainProb: 15, humidity: 74 },
  ],

  // 5-Day Outlook
  dailyForecast: [
    { day: 'Today', condition: 'Hazy Sunshine', maxTemp: 32, minTemp: 24, rainProb: 25, icon: 'sun-cloud' },
    { day: 'Mon', condition: 'Scattered Showers', maxTemp: 30, minTemp: 23, rainProb: 65, icon: 'rain' },
    { day: 'Tue', condition: 'Partly Cloudy', maxTemp: 31, minTemp: 24, rainProb: 30, icon: 'cloud' },
    { day: 'Wed', condition: 'Sunny & Clear', maxTemp: 33, minTemp: 25, rainProb: 10, icon: 'sun' },
    { day: 'Thu', condition: 'Afternoon Storm', maxTemp: 29, minTemp: 22, rainProb: 80, icon: 'lightning' },
  ],

  // Air Quality Detailed Pollutants
  pollutants: [
    { name: 'PM2.5', code: 'Fine Particles', value: 52.4, unit: 'µg/m³', safeLimit: 15, status: 'Elevated', ratio: 75, severity: 'warning' },
    { name: 'PM10', code: 'Coarse Dust', value: 98.1, unit: 'µg/m³', safeLimit: 45, status: 'Moderate', ratio: 58, severity: 'warning' },
    { name: 'NO₂', code: 'Nitrogen Dioxide', value: 24.8, unit: 'µg/m³', safeLimit: 25, status: 'Good', ratio: 32, severity: 'success' },
    { name: 'SO₂', code: 'Sulfur Dioxide', value: 8.2, unit: 'µg/m³', safeLimit: 40, status: 'Good', ratio: 14, severity: 'success' },
    { name: 'O₃', code: 'Surface Ozone', value: 64.0, unit: 'µg/m³', safeLimit: 100, status: 'Moderate', ratio: 48, severity: 'warning' },
    { name: 'CO', code: 'Carbon Monoxide', value: 680, unit: 'µg/m³', safeLimit: 4000, status: 'Optimal', ratio: 17, severity: 'success' },
  ],

  // 24h AQI Trend
  hourlyAqi: [
    { time: '00:00', aqi: 115, pm25: 42 },
    { time: '04:00', aqi: 128, pm25: 48 },
    { time: '08:00', aqi: 165, pm25: 68 }, // Morning traffic peak
    { time: '12:00', aqi: 142, pm25: 52 },
    { time: '16:00', aqi: 135, pm25: 50 },
    { time: '20:00', aqi: 158, pm25: 64 }, // Evening peak
  ],

  // Currency Exchange Table Rates (Base USD)
  currencies: [
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', rate: 86.82, inverse: 0.0115, change: '+0.18%', isPositive: true },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.924, inverse: 1.082, change: '-0.12%', isPositive: false },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.771, inverse: 1.297, change: '+0.05%', isPositive: true },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 152.35, inverse: 0.00656, change: '+0.42%', isPositive: true },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.672, inverse: 0.2723, change: '0.00%', isPositive: true },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.321, inverse: 0.757, change: '-0.08%', isPositive: false },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.389, inverse: 0.720, change: '+0.15%', isPositive: true },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.512, inverse: 0.661, change: '-0.24%', isPositive: false },
  ],
};

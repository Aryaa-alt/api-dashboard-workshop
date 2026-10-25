/**
 * Predefined Cities Configuration for Global Pulse
 * Default: Kolkata (Lat: 22.5726, Lon: 88.3639)
 */

export const PREDEFINED_CITIES = [
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
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    lat: 28.6139,
    lon: 77.2090,
    timezone: 'Asia/Kolkata',
    region: 'National Capital Territory',
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
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    flag: '🇮🇳',
    lat: 12.9716,
    lon: 77.5946,
    timezone: 'Asia/Kolkata',
    region: 'Karnataka',
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
];

export const DEFAULT_CITY = PREDEFINED_CITIES[0];

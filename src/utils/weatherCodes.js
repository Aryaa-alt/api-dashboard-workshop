import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
export const WMO_WEATHER_MAP = {
  0: { label: 'Clear Sky', icon: Sun, color: 'text-amber-400' },
  1: { label: 'Mainly Clear', icon: CloudSun, color: 'text-amber-300' },
  2: { label: 'Partly Cloudy', icon: CloudSun, color: 'text-slate-300' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-slate-400' },
  45: { label: 'Foggy', icon: CloudFog, color: 'text-slate-400' },
  48: { label: 'Depositing Rime Fog', icon: CloudFog, color: 'text-slate-400' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, color: 'text-cyan-300' },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle, color: 'text-cyan-400' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, color: 'text-cyan-500' },
  61: { label: 'Slight Rain', icon: CloudRain, color: 'text-indigo-300' },
  63: { label: 'Moderate Rain', icon: CloudRain, color: 'text-indigo-400' },
  65: { label: 'Heavy Rain', icon: CloudRain, color: 'text-indigo-500' },
  71: { label: 'Slight Snow', icon: CloudSnow, color: 'text-blue-200' },
  73: { label: 'Moderate Snow', icon: CloudSnow, color: 'text-blue-300' },
  75: { label: 'Heavy Snow', icon: CloudSnow, color: 'text-blue-400' },
  80: { label: 'Slight Rain Showers', icon: CloudRain, color: 'text-indigo-400' },
  81: { label: 'Moderate Rain Showers', icon: CloudRain, color: 'text-indigo-500' },
  82: { label: 'Violent Rain Showers', icon: CloudRain, color: 'text-indigo-600' },
  95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-rose-400' },
  96: { label: 'Thunderstorm with Slight Hail', icon: CloudLightning, color: 'text-rose-500' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: CloudLightning, color: 'text-rose-600' },
};

export function getWeatherMeta(code) {
  return WMO_WEATHER_MAP[code] || {
    label: 'Unknown',
    icon: CloudSun,
    color: 'text-slate-300',
  };
}

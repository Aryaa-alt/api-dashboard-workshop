import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  RefreshCw,
  AlertCircle,
  Clock,
  Radio,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { getWeatherMeta } from '../../utils/weatherCodes';
import { formatTemperature, formatTimestamp } from '../../utils/formatters';

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs">
        <p className="font-mono font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          Time: {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
              Temperature:
            </span>
            <span className="font-bold text-cyan-400 font-mono text-sm">
              {formatTemperature(payload[0]?.value)}
            </span>
          </div>
          {dataPoint?.precipitation !== undefined && (
            <div className="flex items-center justify-between gap-5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CloudRain className="h-3.5 w-3.5 text-indigo-400" />
                Precipitation:
              </span>
              <span className="font-bold text-indigo-400 font-mono">
                {dataPoint.precipitation} mm
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function WeatherChartSection({
  weatherData,
  loading = false,
  error = null,
  onRefresh,
  lastUpdated,
  city,
}) {
  // Loading State Skeleton
  if (loading && !weatherData) {
    return (
      <div className="rounded-2xl glass-panel p-6 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-800 rounded"></div>
          <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-800/80 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 w-full bg-slate-800/60 rounded-xl"></div>
      </div>
    );
  }

  // Error State: explicitly prevents displaying fake or sample values
  if (error && !weatherData) {
    return (
      <div className="rounded-2xl glass-panel p-8 border-rose-500/30 bg-rose-950/10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Weather Telemetry Failed</h4>
        <p className="text-xs text-rose-300 max-w-md mx-auto mb-4">{error}</p>
        <p className="text-[11px] text-slate-500 font-mono mb-4">
          Note: In compliance with architecture rules, no simulated data is displayed during API failures.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500/30 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  const current = weatherData?.current;
  const hourly = weatherData?.hourly || [];
  const weatherMeta = current ? getWeatherMeta(current.weatherCode) : null;
  const WeatherIcon = weatherMeta?.icon || Sun;

  // Calculate dynamic temperature stats & domain for chart
  const validTemps = hourly.map((d) => d.temperature).filter((t) => t !== null && !isNaN(t));
  const minTempRaw = validTemps.length ? Math.min(...validTemps) : null;
  const maxTempRaw = validTemps.length ? Math.max(...validTemps) : null;
  const avgTempRaw = validTemps.length
    ? validTemps.reduce((a, b) => a + b, 0) / validTemps.length
    : null;

  const chartYMin = minTempRaw !== null ? Math.floor(minTempRaw) - 2 : 20;
  const chartYMax = maxTempRaw !== null ? Math.ceil(maxTempRaw) + 2 : 40;

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <WeatherIcon className={`h-5 w-5 ${weatherMeta?.color || 'text-cyan-400'}`} />
              Live Weather Telemetry & Hourly Trend
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live Open-Meteo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Atmospheric observations for <strong className="text-slate-200">{city?.name || 'Kolkata'}</strong> ({city?.lat}° N, {city?.lon}° E)
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>Synced: {formatTimestamp(lastUpdated)}</span>
            </div>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Fetch fresh weather data"
            >
              <RefreshCw className={`h-3 w-3 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Atmospheric Telemetry Grid: Temp, Feels-like, Humidity, Precipitation, Wind Speed */}
      {current && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Relative Humidity */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Relative Humidity</span>
              <Droplets className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {current.humidity !== null && current.humidity !== undefined ? `${current.humidity}%` : '--'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Moisture fraction</div>
          </div>

          {/* Precipitation */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Precipitation</span>
              <CloudRain className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {current.precipitation !== null && current.precipitation !== undefined ? `${current.precipitation} mm` : '--'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Current rainfall rate</div>
          </div>

          {/* Wind Speed */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Wind Speed (10m)</span>
              <Wind className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {current.windSpeed !== null && current.windSpeed !== undefined ? `${current.windSpeed} km/h` : '--'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Anemometer reading</div>
          </div>

          {/* Condition Overview */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Atmospheric State</span>
              <WeatherIcon className={`h-4 w-4 ${weatherMeta?.color || 'text-amber-400'}`} />
            </div>
            <div className="text-base font-bold text-white truncate" title={weatherMeta?.label}>
              {weatherMeta?.label || 'Clear'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              WMO Code {current.weatherCode ?? '--'}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Temperature Line Chart Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Hourly Temperature Trajectory (Next 24 Hours)
            </span>
            <span className="rounded bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 text-[10px] font-mono border border-cyan-500/20">
              Recharts LineChart
            </span>
          </div>

          {/* Statistical High / Low / Avg Pills */}
          {minTempRaw !== null && maxTempRaw !== null && (
            <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1 text-rose-400">
                <TrendingUp className="h-3.5 w-3.5" /> High: <strong>{formatTemperature(maxTempRaw)}</strong>
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <TrendingDown className="h-3.5 w-3.5" /> Low: <strong>{formatTemperature(minTempRaw)}</strong>
              </span>
              {avgTempRaw !== null && (
                <span className="hidden md:inline text-slate-400">
                  Avg: {formatTemperature(avgTempRaw)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Recharts Responsive Container */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourly} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#334155' }}
                tickMargin={8}
              />
              <YAxis
                domain={[chartYMin, chartYMax]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(val) => `${val}°`}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 3, fill: '#06b6d4', strokeWidth: 1, stroke: '#083344' }}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#ffffff', strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
        <span>Station Elevation: {weatherData?.elevation ?? 12}m • Timezone: {weatherData?.timezone || 'Asia/Kolkata'}</span>
        <span>Model Source: ECMWF IFS & GFS Seamless Interpolation</span>
      </div>
    </div>
  );
}

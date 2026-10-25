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
  Wind,
  Info,
  Clock,
  RefreshCw,
  AlertCircle,
  Radio,
} from 'lucide-react';

import Badge from '../common/Badge';
import { getAqiClassification } from '../../utils/aqiStandards';
import { formatTimestamp } from '../../utils/formatters';

const CustomAqiTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs">
        <p className="font-mono font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          Time: {label}
        </p>
        <div className="space-y-1.5">
          {dataPoint?.usAqi !== null && dataPoint?.usAqi !== undefined ? (
            <div className="flex items-center justify-between gap-5">
              <span className="text-slate-400">US AQI:</span>
              <span className="font-bold text-amber-400 font-mono text-sm">{dataPoint.usAqi}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-5 text-slate-500">
              <span>US AQI:</span>
              <span className="font-mono italic">N/A</span>
            </div>
          )}

          {dataPoint?.pm25 !== null && dataPoint?.pm25 !== undefined ? (
            <div className="flex items-center justify-between gap-5">
              <span className="text-slate-400">PM2.5:</span>
              <span className="font-bold text-cyan-400 font-mono text-sm">{dataPoint.pm25} μg/m³</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-5 text-slate-500">
              <span>PM2.5:</span>
              <span className="font-mono italic">N/A</span>
            </div>
          )}

          {dataPoint?.pm10 !== null && dataPoint?.pm10 !== undefined && (
            <div className="flex items-center justify-between gap-5">
              <span className="text-slate-400">PM10:</span>
              <span className="font-bold text-slate-300 font-mono">{dataPoint.pm10} μg/m³</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function AirQualitySection({
  airQualityData,
  loading = false,
  error = null,
  onRefresh,
  lastUpdated,
  city,
}) {
  // Loading skeleton
  if (loading && !airQualityData) {
    return (
      <div className="rounded-2xl glass-panel p-6 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-800 rounded"></div>
          <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-800/80 rounded-2xl"></div>
          <div className="lg:col-span-2 h-64 bg-slate-800/60 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-slate-800/80 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state: strictly avoids sample/invented data
  if (error && !airQualityData) {
    return (
      <div className="rounded-2xl glass-panel p-8 border-rose-500/30 bg-rose-950/10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Air Quality Telemetry Failed</h4>
        <p className="text-xs text-rose-300 max-w-md mx-auto mb-4">{error}</p>
        <p className="text-[11px] text-slate-500 font-mono mb-4">
          Note: No simulated or fallback values are displayed when external API calls fail.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500/30 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Feed</span>
          </button>
        )}
      </div>
    );
  }

  const current = airQualityData?.current;
  const hourly = airQualityData?.hourly || [];

  const rawAqi = current?.usAqi?.raw;
  const aqiClassification = getAqiClassification(rawAqi);

  // Pollutant list mapping
  const pollutantCards = [
    {
      id: 'pm2_5',
      name: 'PM2.5',
      fullName: 'Fine Particles (≤2.5 µm)',
      measurement: current?.pm25,
      whoThreshold: 15, // WHO 24h air quality guideline: 15 μg/m³
      isPriority: true,
    },
    {
      id: 'pm10',
      name: 'PM10',
      fullName: 'Coarse Dust (≤10 µm)',
      measurement: current?.pm10,
      whoThreshold: 45, // WHO 24h guideline: 45 μg/m³
      isPriority: true,
    },
    {
      id: 'no2',
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      measurement: current?.nitrogenDioxide,
      whoThreshold: 25,
      isPriority: false,
    },
    {
      id: 'so2',
      name: 'SO₂',
      fullName: 'Sulfur Dioxide',
      measurement: current?.sulphurDioxide,
      whoThreshold: 40,
      isPriority: false,
    },
    {
      id: 'o3',
      name: 'O₃',
      fullName: 'Surface Ozone',
      measurement: current?.ozone,
      whoThreshold: 100,
      isPriority: false,
    },
    {
      id: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      measurement: current?.carbonMonoxide,
      whoThreshold: 4000,
      isPriority: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Wind className="h-5 w-5 text-emerald-400" />
              Air Quality & Atmospheric Telemetry
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live Open-Meteo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time chemical dispersion and particulate telemetry for {city?.name || 'Kolkata'}, {city?.country || 'India'}
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
              className={`flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 hover:bg-slate-800 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Fetch fresh air quality data"
            >
              <RefreshCw className={`h-3 w-3 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Split: AQI Hero Gauge + 24h Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AQI Overview Hero Card */}
        <div className={`rounded-2xl glass-panel p-5 flex flex-col justify-between border ${aqiClassification.border}`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                US Air Quality Index
              </span>
              <Badge variant={aqiClassification.badgeVariant}>
                {aqiClassification.category}
              </Badge>
            </div>

            {/* Value display: strictly distinguishes 0 from unavailable */}
            <div className="flex items-baseline gap-3 my-3">
              {current?.usAqi?.isAvailable ? (
                <>
                  <span
                    className="text-5xl font-black font-mono tracking-tight"
                    style={{ color: aqiClassification.colorHex }}
                  >
                    {current.usAqi.display}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 uppercase font-mono">
                    {current.usAqi.unit || 'USAQI'}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-mono text-slate-500">N/A</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* EPA Meter Bar */}
            <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
              {current?.usAqi?.isAvailable && (
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 via-yellow-400 via-amber-500 via-rose-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(3, (rawAqi / 300) * 100))}%` }}
                />
              )}
            </div>

            {/* Health Interpretation Note */}
            <div className={`rounded-xl border p-3.5 mb-2 ${aqiClassification.bgLight} ${aqiClassification.border}`}>
              <div className="flex items-start gap-2.5">
                <Info className={`h-4 w-4 shrink-0 mt-0.5 ${aqiClassification.textColor}`} />
                <p className="text-xs text-slate-200 leading-relaxed">
                  {aqiClassification.description}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Standard: US EPA NAAQS</span>
            <span className={aqiClassification.textColor}>
              {current?.usAqi?.isAvailable ? `Scale: 0-500+` : 'Station Offline'}
            </span>
          </div>
        </div>

        {/* 24-Hour AQI & PM2.5 Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white tracking-tight">24-Hour Air Quality Trajectory</h4>
                <span className="rounded bg-amber-500/10 text-amber-400 px-1.5 py-0.5 text-[10px] font-mono border border-amber-500/20">
                  Recharts LineChart
                </span>
              </div>
              <p className="text-xs text-slate-400">Hourly trend for US AQI and fine particulate PM2.5</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                US AQI
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                PM2.5 (μg/m³)
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourly} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip content={<CustomAqiTooltip />} />
                <Line
                  type="monotone"
                  dataKey="usAqi"
                  name="US AQI"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#f59e0b' }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  name="PM2.5"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#06b6d4' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
            <span>WHO Guideline Target: ≤15 μg/m³ (24h)</span>
            <span>Hourly Resolution</span>
          </div>
        </div>
      </div>

      {/* Particulate Matter & Pollutant Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Measured Atmospheric Pollutants & Chemical Fractions
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Source: CAMS Copernicus & SILAM Models
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {pollutantCards.map((item) => {
            const m = item.measurement;
            const isAvailable = m?.isAvailable;
            const isZero = m?.isZero;
            const rawVal = m?.raw;

            // Safe limit ratio calculation
            const ratio = isAvailable && item.whoThreshold
              ? Math.round((rawVal / item.whoThreshold) * 100)
              : null;

            const isHigh = ratio && ratio > 100;

            return (
              <div
                key={item.id}
                className={`rounded-xl glass-panel p-3.5 flex flex-col justify-between transition-all ${
                  item.isPriority ? 'border-cyan-500/25 bg-slate-900/50' : 'hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm text-white flex items-center gap-1.5">
                      {item.name}
                      {item.isPriority && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" title="Key Metric" />
                      )}
                    </span>

                    {/* Status Badge: explicitly flags Unavailable vs Zero vs Elevated */}
                    {isAvailable ? (
                      isZero ? (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          0.0 Zero
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            isHigh
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          }`}
                        >
                          {isHigh ? 'Elevated' : 'Optimal'}
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        N/A
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 truncate mb-2.5" title={item.fullName}>
                    {item.fullName}
                  </p>

                  {/* Telemetry Display */}
                  <div className="flex items-baseline gap-1 my-1">
                    {isAvailable ? (
                      <>
                        <span className="text-xl font-extrabold text-white font-mono">
                          {m.display}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {m.unit}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-slate-500 font-mono italic">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Benchmark Ratio Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>Target: ≤{item.whoThreshold}</span>
                    <span>{isAvailable ? `${ratio}%` : '—'}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    {isAvailable && (
                      <div
                        className={`h-full rounded-full ${
                          isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(4, ratio || 0))}%` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

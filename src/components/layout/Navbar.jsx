import React from 'react';
import {
  MapPin,
  RefreshCw,
  Clock,
  Menu,
} from 'lucide-react';

import { formatTimestamp } from '../../utils/formatters';

export default function Navbar({
  cities,
  selectedCity,
  onSelectCity,
  lastUpdated,
  onRefresh,
  isRefreshing,
  onToggleSidebar,
}) {
  const indianCities = cities.filter((c) => c.country === 'India');
  const globalCities = cities.filter((c) => c.country !== 'India');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/85 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Mobile Toggle & Context Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Global Pulse</span>
            </h1>
            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/30 font-mono">
              Intelligence HQ
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time Weather, Air Quality & Foreign Exchange Telemetry
          </p>
        </div>
      </div>

      {/* Right Actions: Predefined Location Selector + Timestamp + Refresh Button */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Predefined Location Selector */}
        <div className="relative">
          <label htmlFor="city-select" className="sr-only">
            Select Predefined City
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 sm:px-3 py-1.5 shadow-inner transition-colors hover:border-slate-700">
            <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
            <select
              id="city-select"
              value={selectedCity.id}
              onChange={(e) => {
                const city = cities.find((c) => c.id === e.target.value);
                if (city) onSelectCity(city);
              }}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer pr-1"
            >
              <optgroup label="India (Predefined Hubs)" className="bg-slate-900 text-slate-400 font-semibold">
                {indianCities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-slate-200">
                    {city.flag} {city.name} {city.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </optgroup>
              {globalCities.length > 0 && (
                <optgroup label="International Metropolises" className="bg-slate-900 text-slate-400 font-semibold">
                  {globalCities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-slate-900 text-slate-200">
                      {city.flag} {city.name}, {city.country}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Last Updated Timestamp */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono border-l border-slate-800/80 pl-3">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>Synced:</span>
          <span className="font-semibold text-slate-300">
            {formatTimestamp(lastUpdated)}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`group flex items-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
            isRefreshing
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 cursor-not-allowed'
              : 'border-slate-800 bg-slate-900 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white shadow-sm'
          }`}
          title="Refresh all intelligence feeds"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-cyan-400 ${
              isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
            }`}
          />
          <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import {
  Thermometer,
  Flame,
  Wind,
  CircleDollarSign,
  Globe,
  MapPin,
} from 'lucide-react';

import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import SummaryCard from './components/common/SummaryCard';
import DataNoticeBanner from './components/common/DataNoticeBanner';
import WeatherChartSection from './components/weather/WeatherChartSection';
import AirQualitySection from './components/airQuality/AirQualitySection';
import CurrencyTableSection from './components/currency/CurrencyTableSection';
import { PREDEFINED_CITIES, DEFAULT_CITY } from './data/cities';
import { useWeather } from './hooks/useWeather';
import { useAirQuality } from './hooks/useAirQuality';
import { useCurrency } from './hooks/useCurrency';
import { getWeatherMeta } from './utils/weatherCodes';
import { getAqiClassification } from './utils/aqiStandards';
import {
  formatTemperature,
  formatCurrencyAmount,
  formatDate,
  formatTimestamp,
} from './utils/formatters';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY); // Defaults to Kolkata, India
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Real Open-Meteo Weather Hook (Reactive to selectedCity coordinates)
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    lastUpdated: weatherLastUpdated,
    refetch: refetchWeather,
  } = useWeather({
    latitude: selectedCity.lat,
    longitude: selectedCity.lon,
  });

  // 2. Real Open-Meteo Air Quality Hook (Reactive to selectedCity coordinates)
  const {
    data: airQualityData,
    loading: airQualityLoading,
    error: airQualityError,
    lastUpdated: airQualityLastUpdated,
    refetch: refetchAirQuality,
  } = useAirQuality({
    latitude: selectedCity.lat,
    longitude: selectedCity.lon,
  });

  // 3. Real Frankfurter v2 Currency Exchange Hook (Independent of weather location)
  const {
    data: currencyData,
    loading: currencyLoading,
    error: currencyError,
    lastUpdated: currencyLastUpdated,
    rateDate: currencyRateDate,
    refetch: refetchCurrency,
  } = useCurrency({
    base: 'USD',
    quotes: ['INR', 'EUR', 'GBP', 'JPY'],
  });

  // Location Switcher Handler (Updates city and triggers immediate re-fetches with abort cleanup)
  const handleSelectCity = (city) => {
    setSelectedCity(city);
  };

  // Coordinated Global Refresh
  const handleRefreshAll = () => {
    refetchWeather();
    refetchAirQuality();
    refetchCurrency();
  };

  const isRefreshing = weatherLoading || airQualityLoading || currencyLoading;
  const latestUpdatedTime =
    weatherLastUpdated || airQualityLastUpdated || currencyLastUpdated || null;

  // Weather metadata helper
  const currentWeather = weatherData?.current;
  const weatherMeta = currentWeather ? getWeatherMeta(currentWeather.weatherCode) : null;
  const WeatherIcon = weatherMeta?.icon || Thermometer;

  // Air quality metadata helper
  const currentAqi = airQualityData?.current?.usAqi;
  const aqiClassification = getAqiClassification(currentAqi?.raw);

  // Currency metadata helper (USD to INR live rate)
  const inrRate = currencyData?.ratesMap?.['INR'];
  const inrInverse = inrRate ? (1 / inrRate).toFixed(4) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex flex-1">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Navbar with Location Selector, Synced Timestamp & Refresh */}
          <Navbar
            cities={PREDEFINED_CITIES}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            lastUpdated={latestUpdatedTime}
            onRefresh={handleRefreshAll}
            isRefreshing={isRefreshing}
            onToggleSidebar={() => setSidebarOpen(true)}
          />

          {/* Dashboard Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Live Data Notice Banner with Active City Pill */}
            <DataNoticeBanner activeCity={selectedCity} />

            {/* Active Location Indicator Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-white">
                  Active Station: {selectedCity.flag} {selectedCity.name}, {selectedCity.country}
                </span>
                <span className="text-slate-400 font-mono">
                  ({selectedCity.lat.toFixed(4)}° N, {selectedCity.lon.toFixed(4)}° E)
                </span>
                {selectedCity.region && (
                  <span className="hidden sm:inline rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    {selectedCity.region}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Weather & AQI Synchronized</span>
              </div>
            </div>

            {/* 4 Summary Cards Grid */}
            <section aria-label="Key Intelligence Metrics">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Real Current Temperature */}
                <SummaryCard
                  title="Current Temperature"
                  value={currentWeather ? formatTemperature(currentWeather.temperature, '') : '--'}
                  unit={currentWeather?.units?.temperature || '°C'}
                  subtitle={weatherMeta?.label || 'Live Reading'}
                  badgeText={currentWeather ? `${selectedCity.name}` : null}
                  badgeType="info"
                  icon={WeatherIcon}
                  accentColor="cyan"
                  isLive={true}
                  isLoading={weatherLoading && !weatherData}
                  error={weatherError}
                  onRetry={refetchWeather}
                  secondaryInfo={
                    currentWeather
                      ? {
                          label: 'Wind Speed',
                          value: `${currentWeather.windSpeed} ${currentWeather.units.windSpeed}`,
                        }
                      : null
                  }
                  footerNote="Open-Meteo Sensor"
                />

                {/* 2. Real Feels Like */}
                <SummaryCard
                  title="Feels Like"
                  value={currentWeather ? formatTemperature(currentWeather.feelsLike, '') : '--'}
                  unit={currentWeather?.units?.feelsLike || '°C'}
                  subtitle={
                    currentWeather
                      ? `Humidity: ${currentWeather.humidity}${currentWeather.units.humidity}`
                      : 'Thermal Index'
                  }
                  badgeText={
                    currentWeather
                      ? `${(currentWeather.feelsLike - currentWeather.temperature).toFixed(1)}°C delta`
                      : null
                  }
                  badgeType={
                    currentWeather && currentWeather.feelsLike > currentWeather.temperature
                      ? 'warning'
                      : 'positive'
                  }
                  icon={Flame}
                  accentColor="amber"
                  isLive={true}
                  isLoading={weatherLoading && !weatherData}
                  error={weatherError}
                  onRetry={refetchWeather}
                  secondaryInfo={
                    currentWeather
                      ? {
                          label: 'Precipitation',
                          value: `${currentWeather.precipitation} ${currentWeather.units.precipitation}`,
                        }
                      : null
                  }
                  footerNote="Apparent Temp Model"
                />

                {/* 3. Real Air Quality Index */}
                <SummaryCard
                  title="Air Quality Index"
                  value={
                    currentAqi?.isAvailable
                      ? `${currentAqi.display}`
                      : currentAqi
                      ? 'N/A'
                      : '--'
                  }
                  unit={currentAqi?.unit || 'USAQI'}
                  subtitle={aqiClassification.category}
                  badgeText={currentAqi?.isAvailable ? aqiClassification.category : 'Offline'}
                  badgeType={aqiClassification.badgeVariant}
                  icon={Wind}
                  accentColor={
                    aqiClassification.badgeVariant === 'success'
                      ? 'emerald'
                      : aqiClassification.badgeVariant === 'danger' || aqiClassification.badgeVariant === 'purple'
                      ? 'rose'
                      : 'amber'
                  }
                  isLive={true}
                  isLoading={airQualityLoading && !airQualityData}
                  error={airQualityError}
                  onRetry={refetchAirQuality}
                  secondaryInfo={
                    airQualityData?.current
                      ? {
                          label: 'PM2.5 / PM10',
                          value: `${airQualityData.current.pm25.display} / ${airQualityData.current.pm10.display} ${airQualityData.current.pm25.unit}`,
                        }
                      : null
                  }
                  footerNote="Open-Meteo EPA Feed"
                />

                {/* 4. Real USD to INR Exchange Rate (Independent Global Financial Module) */}
                <SummaryCard
                  title="USD to INR Rate"
                  value={inrRate !== undefined ? formatCurrencyAmount(inrRate, '₹', 2) : '--'}
                  unit="INR"
                  subtitle={currencyRateDate ? `ECB Close: ${formatDate(currencyRateDate)}` : 'Global Cross'}
                  badgeText="Global FX"
                  badgeType="info"
                  icon={CircleDollarSign}
                  accentColor="indigo"
                  isLive={true}
                  isLoading={currencyLoading && !currencyData}
                  error={currencyError}
                  onRetry={refetchCurrency}
                  secondaryInfo={
                    inrInverse
                      ? {
                          label: 'Inverse Value',
                          value: `1 INR = $${inrInverse} USD`,
                        }
                      : null
                  }
                  footerNote="Frankfurter v2"
                />
              </div>
            </section>

            {/* Weather Chart Section (Real Open-Meteo + Recharts LineChart) */}
            {(activeTab === 'overview' || activeTab === 'weather') && (
              <section aria-label="Weather Telemetry">
                <WeatherChartSection
                  weatherData={weatherData}
                  loading={weatherLoading}
                  error={weatherError}
                  onRefresh={refetchWeather}
                  lastUpdated={weatherLastUpdated}
                  city={selectedCity}
                />
              </section>
            )}

            {/* Air Quality Section (Real Open-Meteo Air Quality) */}
            {(activeTab === 'overview' || activeTab === 'airQuality') && (
              <section aria-label="Air Quality Analysis">
                <AirQualitySection
                  airQualityData={airQualityData}
                  loading={airQualityLoading}
                  error={airQualityError}
                  onRefresh={refetchAirQuality}
                  lastUpdated={airQualityLastUpdated}
                  city={selectedCity}
                />
              </section>
            )}

            {/* Currency Exchange Section (Independent Global Module) */}
            {(activeTab === 'overview' || activeTab === 'currency') && (
              <section aria-label="Foreign Exchange Matrix">
                <CurrencyTableSection
                  currencyData={currencyData}
                  loading={currencyLoading}
                  error={currencyError}
                  onRefresh={refetchCurrency}
                  lastUpdated={currencyLastUpdated}
                />
              </section>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-6 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">Global Pulse</span>
                <span>— Open Data Intelligence Dashboard</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>
                  Active: {selectedCity.name} ({selectedCity.lat.toFixed(4)}° N, {selectedCity.lon.toFixed(4)}° E)
                </span>
                <span>•</span>
                <span>
                  {latestUpdatedTime
                    ? `Synced: ${formatTimestamp(latestUpdatedTime)}`
                    : 'Awaiting Sync'}
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  ArrowRightLeft,
  Calendar,
  AlertCircle,
  RefreshCw,
  Calculator,
  Info,
  Radio,
  Clock,
} from 'lucide-react';
import {
  SUPPORTED_CURRENCIES,
  convertCurrencyPair,
  getCurrencyMeta,
} from '../../services/currencyService';
import {
  formatExchangeRate,
  formatCurrencyAmount,
  formatDate,
  formatTimestamp,
} from '../../utils/formatters';

export default function CurrencyTableSection({
  currencyData,
  loading = false,
  error = null,
  onRefresh,
  lastUpdated,
}) {
  // Converter State
  const [amount, setAmount] = useState('100');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState(null);

  // Perform dynamic conversion whenever amount, source, or target changes

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    async function runConversion() {
      setConversionLoading(true);
      try {
        const res = await convertCurrencyPair({
          from: sourceCurrency,
          to: targetCurrency,
          amount: numAmount,
          signal: controller.signal,
        });
        if (!isCancelled) {
          setConversionResult(res);
          setConversionError(null);
        }
      } catch (err) {
        if (!isCancelled && err.name !== 'AbortError') {
          setConversionError(
            err.message || `Unable to convert from ${sourceCurrency} to ${targetCurrency}.`
          );
          setConversionResult(null);
        }
      } finally {
        if (!isCancelled) {
          setConversionLoading(false);
        }
      }
    }

    runConversion();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [amount, sourceCurrency, targetCurrency]);


  const handleSwapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const rateItems = currencyData?.items || [];
  const rateDate = currencyData?.rateDate || null;
  const isInvalidAmount = isNaN(parseFloat(amount)) || parseFloat(amount) < 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-indigo-400" />
              Foreign Exchange Reference Matrix
            </h3>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-mono text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Frankfurter v2 Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Independent global macroeconomic feed: European Central Bank (ECB) benchmark parity
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {rateDate && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>ECB Close: {formatDate(rateDate)}</span>
            </div>
          )}

          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono border-l border-slate-800/80 pl-3">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>Synced: {formatTimestamp(lastUpdated)}</span>
            </div>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-indigo-500/40 hover:bg-slate-800 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Refresh currency rates"
            >
              <RefreshCw className={`h-3 w-3 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Reference Notice Alert Box */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 backdrop-blur-sm">
        <div className="flex items-start gap-2.5 text-xs text-indigo-200">
          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Reference Rate Notice:</strong> These figures are benchmark reference exchange rates published by the European Central Bank (ECB) via the Frankfurter API. They are intended strictly for economic comparison, valuation, and statistical reference — <em>not for live commercial trading or high-frequency market execution</em>.
          </p>
        </div>
      </div>

      {/* Main Grid: Clean Rates Table + Dynamic Converter Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clean Rates Table (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 sm:p-6 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">USD Benchmark Cross Rates</h4>
                <p className="text-xs text-slate-400">Target currency values per 1 United States Dollar (USD)</p>
              </div>
              {rateDate && (
                <span className="rounded bg-slate-800 text-slate-300 px-2 py-0.5 text-[11px] font-mono border border-slate-700">
                  Settlement: {rateDate}
                </span>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading && !currencyData && (
              <div className="space-y-3 py-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-slate-800/60 rounded-xl" />
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && !currencyData && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-5 text-center my-3">
                <AlertCircle className="h-6 w-6 text-rose-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-white mb-1">Rates Unavailable</div>
                <p className="text-xs text-rose-300 max-w-sm mx-auto mb-3">{error}</p>
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 text-xs text-white hover:bg-rose-500/30 font-medium"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry Request</span>
                  </button>
                )}
              </div>
            )}

            {/* Clean Table Content */}
            {rateItems.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="pb-3 font-semibold">Target Pair</th>
                      <th className="pb-3 font-semibold">Currency Name</th>
                      <th className="pb-3 font-semibold text-right">Rate (per 1 USD)</th>
                      <th className="pb-3 font-semibold text-right">Inverse Rate</th>
                      <th className="pb-3 font-semibold text-right">Settlement Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {rateItems.map((item) => (
                      <tr key={item.quote} className="hover:bg-slate-900/40 transition-colors group">
                        <td className="py-3.5 font-bold text-white flex items-center gap-2.5">
                          <span className="text-lg">{item.flag}</span>
                          <span className="text-sm group-hover:text-indigo-400 transition-colors">
                            USD / {item.quote}
                          </span>
                          {item.quote === 'INR' && (
                            <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 text-[9px] font-sans font-bold border border-indigo-500/30">
                              Focus
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-300 font-sans">{item.name}</td>
                        <td className="py-3.5 text-right font-black text-white text-sm">
                          {formatExchangeRate(item.rate, 4)}
                        </td>
                        <td className="py-3.5 text-right text-slate-400 text-xs">
                          1 {item.quote} = ${item.inverseRate ? formatExchangeRate(item.inverseRate, 5) : '—'}
                        </td>
                        <td className="py-3.5 text-right text-slate-400 text-[11px]">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
            <span>Source: api.frankfurter.dev/v2/rates?base=USD&quotes=INR,EUR,GBP,JPY</span>
            <span>Zero API Key Required</span>
          </div>
        </div>

        {/* Interactive Currency Converter */}
        <div className="rounded-2xl glass-panel p-5 sm:p-6 border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">Interactive Converter</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Real-time conversion based on official European Central Bank reference parity
            </p>

            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Enter Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-base font-bold font-mono text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Source & Target Dropdowns with Swap Button */}
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                {/* Source Currency */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    From
                  </label>
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapCurrencies}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                    title="Swap Source and Target Currencies"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Target Currency */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    To
                  </label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-2.5 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Result Box */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4 text-center min-h-[110px] flex flex-col justify-center">
                {isInvalidAmount ? (
                  <div className="text-xs text-amber-300 font-medium py-1">
                    <span>Please enter a valid positive numerical amount.</span>
                  </div>
                ) : conversionLoading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-indigo-300 font-mono py-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                    <span>Calculating Parity...</span>
                  </div>
                ) : conversionError ? (
                  <div className="text-xs text-rose-300 font-medium py-1">
                    <AlertCircle className="h-4 w-4 text-rose-400 mx-auto mb-1" />
                    <span>{conversionError}</span>
                  </div>
                ) : conversionResult ? (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-300 tracking-wider block mb-1">
                      Converted Total ({getCurrencyMeta(targetCurrency).name})
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {formatCurrencyAmount(
                        conversionResult.convertedAmount,
                        getCurrencyMeta(targetCurrency).symbol,
                        2
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1.5 font-mono">
                      1 {sourceCurrency} = {formatExchangeRate(conversionResult.rate, 4)} {targetCurrency} • Rate Date: {conversionResult.date}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono text-center">
            Reference rate for informational use only
          </div>
        </div>
      </div>
    </div>
  );
}

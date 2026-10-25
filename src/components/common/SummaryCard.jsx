import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

export default function SummaryCard({
  title,
  value,
  unit = '',
  subtitle,
  badgeText,
  badgeType = 'neutral', // 'positive' | 'negative' | 'warning' | 'info' | 'neutral'
  icon: Icon,
  accentColor = 'cyan', // 'cyan' | 'amber' | 'emerald' | 'indigo' | 'rose'
  secondaryInfo,
  footerNote,
  isLive = false,
  isLoading = false,
  error = null,
  onRetry = null,
}) {
  const accentStyles = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      gradient: 'from-cyan-500/10 via-transparent to-transparent',
      text: 'text-cyan-400',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      gradient: 'from-amber-500/10 via-transparent to-transparent',
      text: 'text-amber-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
      text: 'text-emerald-400',
    },
    indigo: {
      border: 'hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      gradient: 'from-indigo-500/10 via-transparent to-transparent',
      text: 'text-indigo-400',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      gradient: 'from-rose-500/10 via-transparent to-transparent',
      text: 'text-rose-400',
    },
  }[accentColor] || {};

  const badgeBadgeStyles = {
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    negative: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  }[badgeType];

  // Loading State Skeleton
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 animate-pulse">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="h-3.5 w-24 bg-slate-800 rounded"></div>
          <div className="h-10 w-10 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-32 bg-slate-800 rounded mb-3"></div>
        <div className="h-4 w-40 bg-slate-800/80 rounded mb-4"></div>
        <div className="border-t border-slate-800/80 pt-3 flex justify-between">
          <div className="h-3 w-16 bg-slate-800 rounded"></div>
          <div className="h-3 w-20 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  // Error State: explicitly prevents displaying fake or sample values
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 border-rose-500/30 bg-rose-950/10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">{title}</span>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="my-2 text-sm font-semibold text-rose-300">Feed Unavailable</div>
        <p className="text-xs text-rose-400/80 line-clamp-2 mb-3">{error}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry Feed</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 group hover:-translate-y-1 ${accentStyles.border || ''}`}>
      {/* Subtle background ambient gradient */}
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accentStyles.gradient} blur-2xl pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentStyles.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">{value}</span>
        {unit && <span className="text-lg font-medium text-slate-400">{unit}</span>}
      </div>

      {/* Badges / Delta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {badgeText && (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeBadgeStyles}`}>
            {badgeType === 'positive' && <TrendingUp className="h-3 w-3" />}
            {badgeType === 'negative' && <TrendingDown className="h-3 w-3" />}
            {badgeText}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-slate-400 truncate max-w-[200px]" title={subtitle}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Secondary metadata row */}
      {secondaryInfo && (
        <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{secondaryInfo.label}</span>
          <span className="font-semibold text-slate-200">{secondaryInfo.value}</span>
        </div>
      )}

      {/* Footer note */}
      {footerNote && (
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{footerNote}</span>
          <span
            className={`px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-widest font-mono ${
              isLive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {isLive ? 'Live Open-Meteo' : 'Preview'}
          </span>
        </div>
      )}
    </div>
  );
}

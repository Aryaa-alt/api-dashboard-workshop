import React from 'react';
import { Radio, CheckCircle2 } from 'lucide-react';

export default function DataNoticeBanner({ activeCity }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/70 to-slate-900/40 p-4 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Full Intelligence Feed Active</h4>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider border border-indigo-500/30 font-mono">
                100% Real Public APIs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live telemetry for <strong className="text-slate-200">{activeCity.name}, {activeCity.country}</strong> ({activeCity.lat}° N, {activeCity.lon}° E). Open-Meteo Weather, Open-Meteo Air Quality, and Frankfurter v2 ECB FX feeds connected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/25">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Weather</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Air Quality</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/25">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Frankfurter FX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

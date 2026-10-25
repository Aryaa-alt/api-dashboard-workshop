import React from 'react';
import {
  Globe2,
  CloudSun,
  Wind,
  CircleDollarSign,
  Layers,
  Activity,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';


export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) {
  const navItems = [
    { id: 'overview', label: 'Global Overview', icon: Layers, badge: 'All' },
    { id: 'weather', label: 'Weather Telemetry', icon: CloudSun, badge: 'Live' },
    { id: 'airQuality', label: 'Air Quality Radar', icon: Wind, badge: 'EPA' },
    { id: 'currency', label: 'Currency Matrix', icon: CircleDollarSign, badge: 'FX' },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Globe2 className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">Global Pulse</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Intelligence HQ</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Intelligence Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wider ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Public Data Feeds
          </div>

          <div className="space-y-1 text-xs">
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-900 hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                Open-Meteo Weather
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            <a
              href="https://air-quality-api.open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-900 hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Open-Meteo Air Quality
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            <a
              href="https://frankfurter.dev/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-900 hover:text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                Frankfurter ECB FX
              </span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </nav>

        {/* Footer System Status */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                Feeds Status
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-xs text-slate-300 font-medium">All Endpoints Nominal</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Zero authentication needed</div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
            <span>Global Pulse v0.1</span>
            <span>React + Vite</span>
          </div>
        </div>
      </aside>
    </>
  );
}

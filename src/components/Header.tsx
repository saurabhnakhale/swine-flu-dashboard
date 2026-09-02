'use client';
import React from 'react';
import { Activity, RefreshCw, Database, Calendar, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  yearFilter: 'ALL' | '2025' | '2026';
  onYearChange: (year: 'ALL' | '2025' | '2026') => void;
  total2025: number;
  total2026: number;
  lastUpdated: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  yearFilter,
  onYearChange,
  total2025,
  total2026,
  lastUpdated,
  isLoading,
  onRefresh,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-4 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shadow-inner">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                Swine Flu (H1N1) Surveillance Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium">
                <ShieldAlert className="w-3 h-3 text-emerald-400" /> Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-300">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Published Source: Line list 2025 ({total2025}) + Line List 2026 ({total2026})
              </span>
              {lastUpdated && (
                <span className="text-slate-500">
                  • Synced: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Controls: Year Selector & Refresh */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          
          {/* Year Filter Buttons */}
          <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/80 rounded-xl shadow-inner text-xs font-semibold">
            <button
              onClick={() => onYearChange('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === 'ALL'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              All Years
            </button>
            <button
              onClick={() => onYearChange('2025')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === '2025'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              2025 ({total2025})
            </button>
            <button
              onClick={() => onYearChange('2026')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === '2026'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              2026 ({total2026})
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 hover:text-emerald-100 rounded-xl text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
            title="Fetch latest live data from Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

        </div>
      </div>
    </header>
  );
};

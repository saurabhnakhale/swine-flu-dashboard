'use client';
import React from 'react';
import { Activity, RefreshCw, Database, ShieldAlert } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-4 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 shadow-sm">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Swine Flu (H1N1) Surveillance Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-700">
                <Database className="w-3.5 h-3.5 text-cyan-600" />
                Published Source: Line list 2025 ({total2025}) + Line List 2026 ({total2026})
              </span>
              {lastUpdated && (
                <span className="text-slate-400">
                  • Synced: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Controls: Year Selector & Refresh */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          
          {/* Year Filter Buttons */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-inner text-xs font-semibold">
            <button
              onClick={() => onYearChange('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === 'ALL'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All Years
            </button>
            <button
              onClick={() => onYearChange('2025')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === '2025'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              2025 ({total2025})
            </button>
            <button
              onClick={() => onYearChange('2026')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                yearFilter === '2026'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              2026 ({total2026})
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shadow-sm"
            title="Fetch latest live data from Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

        </div>
      </div>
    </header>
  );
};

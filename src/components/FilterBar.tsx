'use client';
import React from 'react';
import { DashboardFilterState, SwineFluRecord } from '@/lib/types';
import { Search, Filter, RotateCcw, MapPin, Activity, User, Calendar, CalendarDays } from 'lucide-react';

interface FilterBarProps {
  filters: DashboardFilterState;
  onFilterChange: (newFilters: Partial<DashboardFilterState>) => void;
  onResetFilters: () => void;
  records: SwineFluRecord[];
  filteredCount: number;
  totalCount: number;
}

const MONTHS = [
  { value: 'Jan', label: 'January' },
  { value: 'Feb', label: 'February' },
  { value: 'Mar', label: 'March' },
  { value: 'Apr', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'Jun', label: 'June' },
  { value: 'Jul', label: 'July' },
  { value: 'Aug', label: 'August' },
  { value: 'Sep', label: 'September' },
  { value: 'Oct', label: 'October' },
  { value: 'Nov', label: 'November' },
  { value: 'Dec', label: 'December' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  records,
  filteredCount,
  totalCount,
}) => {
  // Extract unique zones for dropdown
  const uniqueZones = Array.from(
    new Set(records.map((r) => r.zoneClean).filter(Boolean))
  ).sort();

  // Compute case counts per month for dropdown labels
  const monthCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      if (r.monthNormalized) {
        counts[r.monthNormalized] = (counts[r.monthNormalized] || 0) + 1;
      }
    });
    return counts;
  }, [records]);

  // Active filter count calculation
  const activeFiltersCount = [
    filters.searchQuery !== '',
    filters.month && filters.month !== 'ALL',
    filters.regionCategory !== 'ALL',
    filters.zone !== 'ALL',
    filters.ageCategory !== 'ALL',
    filters.sex !== 'ALL',
    filters.outcomeStatus !== 'ALL',
    filters.hospital !== 'ALL',
    Boolean(filters.fromDate),
    Boolean(filters.toDate),
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 shadow-sm my-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Search & Date Range Filter</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-emerald-700 font-bold">{filteredCount}</strong> of{' '}
            <span className="text-slate-800 font-semibold">{totalCount}</span> cases
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3 h-3 text-emerald-600" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3">
        
        {/* Search Query Input */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2 relative">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Search Patient / Hospital / Address
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by name, hospital, address, symptoms..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Month Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5 text-teal-600" /> Month
          </label>
          <select
            value={filters.month || 'ALL'}
            onChange={(e) => onFilterChange({ month: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}{monthCounts[m.value] ? ` (${monthCounts[m.value]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* From Date Calendar */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> From Date
          </label>
          <input
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => onFilterChange({ fromDate: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* To Date Calendar */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> To Date
          </label>
          <input
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => onFilterChange({ toDate: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Region Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Region / Area
          </label>
          <select
            value={filters.regionCategory}
            onChange={(e) => onFilterChange({ regionCategory: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Regions</option>
            <option value="NMC Nagpur (Urban)">NMC Nagpur (Urban)</option>
            <option value="Nagpur Rural">Nagpur Rural</option>
            <option value="Other District (MH)">Other District (MH)</option>
            <option value="Other State">Other State (MP/CG)</option>
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Municipal Zone
          </label>
          <select
            value={filters.zone}
            onChange={(e) => onFilterChange({ zone: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Zones</option>
            {uniqueZones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-600" /> Age Group
          </label>
          <select
            value={filters.ageCategory}
            onChange={(e) => onFilterChange({ ageCategory: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Age Groups</option>
            <option value="Senior (>60)">Senior (&gt;60 Yrs)</option>
            <option value="Adult (18-60)">Adult (18–60 Yrs)</option>
            <option value="Pediatric (<18)">Pediatric (&lt;18 Yrs)</option>
          </select>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-rose-600" /> Outcome
          </label>
          <select
            value={filters.outcomeStatus}
            onChange={(e) => onFilterChange({ outcomeStatus: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Discharged">Discharged / Recovered</option>
            <option value="Deceased">Deceased / Fatality</option>
            <option value="Currently Admitted">Currently Admitted</option>
            <option value="Rejected (Non-Swine Flu Cause)">Rejected (Non-Flu)</option>
          </select>
        </div>

      </div>
    </div>
  );
};

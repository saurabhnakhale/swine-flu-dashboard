'use client';
import React from 'react';
import { DashboardFilterState, SwineFluRecord } from '@/lib/types';
import { Search, Filter, RotateCcw, MapPin, Building, Activity, User, Shield } from 'lucide-react';

interface FilterBarProps {
  filters: DashboardFilterState;
  onFilterChange: (newFilters: Partial<DashboardFilterState>) => void;
  onResetFilters: () => void;
  records: SwineFluRecord[];
  filteredCount: number;
  totalCount: number;
}

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

  // Extract unique hospitals for dropdown
  const uniqueHospitals = Array.from(
    new Set(records.map((r) => r.hospitalName).filter(Boolean))
  ).sort();

  // Active filter count calculation
  const activeFiltersCount = [
    filters.searchQuery !== '',
    filters.regionCategory !== 'ALL',
    filters.zone !== 'ALL',
    filters.ageCategory !== 'ALL',
    filters.sex !== 'ALL',
    filters.outcomeStatus !== 'ALL',
    filters.hospital !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 lg:p-5 shadow-xl my-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Search & Filter Line List Data</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span>
            Showing <strong className="text-emerald-400 font-bold">{filteredCount}</strong> of{' '}
            <span className="text-slate-300 font-medium">{totalCount}</span> cases
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        
        {/* Search Query Input */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2 relative">
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Search Patient / Hospital / Address
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by name, hospital, address, symptoms..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Region Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" /> Region / Area
          </label>
          <select
            value={filters.regionCategory}
            onChange={(e) => onFilterChange({ regionCategory: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Municipal Zone
          </label>
          <select
            value={filters.zone}
            onChange={(e) => onFilterChange({ zone: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-amber-400" /> Age Group
          </label>
          <select
            value={filters.ageCategory}
            onChange={(e) => onFilterChange({ ageCategory: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Age Groups</option>
            <option value="Senior (>60)">Senior (&gt;60 Yrs)</option>
            <option value="Adult (18-60)">Adult (18–60 Yrs)</option>
            <option value="Pediatric (<18)">Pediatric (&lt;18 Yrs)</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Gender
          </label>
          <select
            value={filters.sex}
            onChange={(e) => onFilterChange({ sex: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-rose-400" /> Outcome
          </label>
          <select
            value={filters.outcomeStatus}
            onChange={(e) => onFilterChange({ outcomeStatus: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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

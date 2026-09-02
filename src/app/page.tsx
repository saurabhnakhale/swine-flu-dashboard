'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SwineFluRecord, DashboardFilterState } from '@/lib/types';
import { fetchLiveSwineFluData } from '@/lib/dataService';
import { Header } from '@/components/Header';
import { KPIStats } from '@/components/KPIStats';
import { FilterBar } from '@/components/FilterBar';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { PatientDataTable } from '@/components/PatientDataTable';
import { PatientDetailModal } from '@/components/PatientDetailModal';
import { RefreshCw, AlertTriangle, Database } from 'lucide-react';

const INITIAL_FILTERS: DashboardFilterState = {
  searchQuery: '',
  year: 'ALL',
  regionCategory: 'ALL',
  zone: 'ALL',
  ageCategory: 'ALL',
  sex: 'ALL',
  outcomeStatus: 'ALL',
  hospital: 'ALL',
};

export default function DashboardPage() {
  const [allRecords, setAllRecords] = useState<SwineFluRecord[]>([]);
  const [records2025Count, setRecords2025Count] = useState<number>(0);
  const [records2026Count, setRecords2026Count] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [yearFilter, setYearFilter] = useState<'ALL' | '2025' | '2026'>('ALL');
  const [filters, setFilters] = useState<DashboardFilterState>(INITIAL_FILTERS);

  const [selectedRecord, setSelectedRecord] = useState<SwineFluRecord | null>(null);

  // Fetch Data Function (Supports GitHub Pages & Static Export)
  const fetchData = useCallback(async (refresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const json = await fetchLiveSwineFluData(refresh);

      if (!json.success || !json.data) {
        throw new Error(json.error || 'Failed to parse Google Sheets CSV data');
      }

      setAllRecords(json.data);
      setRecords2025Count(json.records2025Count);
      setRecords2026Count(json.records2026Count);
      setLastUpdated(json.timestamp);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading live Swine Flu data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Year-level Records Filter
  const yearFilteredRecords = useMemo(() => {
    if (yearFilter === '2025') return allRecords.filter((r) => r.year === 2025);
    if (yearFilter === '2026') return allRecords.filter((r) => r.year === 2026);
    return allRecords;
  }, [allRecords, yearFilter]);

  // Multi-attribute Active Filtered Records
  const finalFilteredRecords = useMemo(() => {
    return yearFilteredRecords.filter((r) => {
      // 1. Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = r.patientName.toLowerCase().includes(q);
        const matchesHospital = r.hospitalName.toLowerCase().includes(q);
        const matchesAddress = r.address.toLowerCase().includes(q);
        const matchesSymptoms = r.symptoms.toLowerCase().includes(q);
        const matchesLab = r.labName.toLowerCase().includes(q);
        if (!matchesName && !matchesHospital && !matchesAddress && !matchesSymptoms && !matchesLab) {
          return false;
        }
      }

      // 2. Region Category
      if (filters.regionCategory !== 'ALL' && r.regionCategory !== filters.regionCategory) {
        return false;
      }

      // 3. Zone
      if (filters.zone !== 'ALL' && r.zoneClean !== filters.zone) {
        return false;
      }

      // 4. Age Category
      if (filters.ageCategory !== 'ALL' && r.ageCategory !== filters.ageCategory) {
        return false;
      }

      // 5. Gender
      if (filters.sex !== 'ALL' && r.sex !== filters.sex) {
        return false;
      }

      // 6. Outcome Status
      if (filters.outcomeStatus !== 'ALL' && r.outcomeStatus !== filters.outcomeStatus) {
        return false;
      }

      // 7. Hospital
      if (filters.hospital !== 'ALL' && r.hospitalName !== filters.hospital) {
        return false;
      }

      return true;
    });
  }, [yearFilteredRecords, filters]);

  const handleFilterChange = (newFilters: Partial<DashboardFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-900">
      
      {/* Header Bar */}
      <Header
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        total2025={records2025Count}
        total2026={records2026Count}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onRefresh={() => fetchData(true)}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="block font-semibold">Failed to Sync Live Data</strong>
                <span className="text-xs opacity-90">{error}</span>
              </div>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {isLoading && allRecords.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-medium">Fetching Live Swine Flu Line List from Google Sheets...</p>
          </div>
        ) : (
          <>
            {/* Top KPI Cards */}
            <KPIStats records={finalFilteredRecords} allRecords={yearFilteredRecords} />

            {/* Search & Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              records={yearFilteredRecords}
              filteredCount={finalFilteredRecords.length}
              totalCount={yearFilteredRecords.length}
            />

            {/* Interactive Visual Analytics (Charts) */}
            <AnalyticsSection records={finalFilteredRecords} />

            {/* Line List Data Table */}
            <PatientDataTable
              records={finalFilteredRecords}
              onSelectRecord={setSelectedRecord}
            />
          </>
        )}

      </main>

      {/* Detail Modal */}
      <PatientDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Swine Flu Surveillance Dashboard • Powered by Next.js & Published Google Sheets</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Sources: <strong>Line list 2025</strong> & <strong>Line List 2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Auto Live Feed</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

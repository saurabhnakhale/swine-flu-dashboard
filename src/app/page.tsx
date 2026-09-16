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
import { HospitalComparisonTable } from '@/components/HospitalComparisonTable';
import { NagpurWeatherWidget } from '@/components/NagpurWeatherWidget';
import { RefreshCw, AlertTriangle, Database } from 'lucide-react';

// Helper to get today's date formatted as YYYY-MM-DD in IST/Local
export function getTodayDateString(): string {
  const now = new Date();
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

const TODAY_STR = getTodayDateString();

const INITIAL_FILTERS: DashboardFilterState = {
  searchQuery: '',
  year: 'ALL',
  month: 'ALL',
  regionCategory: 'ALL',
  zone: 'ALL',
  ageCategory: 'ALL',
  sex: 'ALL',
  outcomeStatus: 'ALL',
  hospital: 'ALL',
  fromDate: TODAY_STR,
  toDate: TODAY_STR,
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

      // 2. Month Filter
      if (filters.month && filters.month !== 'ALL') {
        const matchesMonthNorm = r.monthNormalized === filters.month;
        let matchesParsedMonth = false;
        if (r.parsedDate) {
          const parts = r.parsedDate.split('-');
          if (parts.length >= 2) {
            const mNum = parseInt(parts[1], 10);
            const shortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            if (shortNames[mNum - 1] === filters.month) {
              matchesParsedMonth = true;
            }
          }
        }
        if (!matchesMonthNorm && !matchesParsedMonth) {
          return false;
        }
      }

      // 3. Region Category
      if (filters.regionCategory !== 'ALL' && r.regionCategory !== filters.regionCategory) {
        return false;
      }

      // 4. Zone
      if (filters.zone !== 'ALL' && r.zoneClean !== filters.zone) {
        return false;
      }

      // 5. Age Category
      if (filters.ageCategory !== 'ALL' && r.ageCategory !== filters.ageCategory) {
        return false;
      }

      // 6. Gender
      if (filters.sex !== 'ALL' && r.sex !== filters.sex) {
        return false;
      }

      // 7. Outcome Status
      if (filters.outcomeStatus !== 'ALL' && r.outcomeStatus !== filters.outcomeStatus) {
        return false;
      }

      // 8. Hospital
      if (filters.hospital !== 'ALL' && r.hospitalName !== filters.hospital) {
        return false;
      }

      // 9. Date Range (From Date & To Date)
      if (filters.fromDate && filters.fromDate.trim() !== '') {
        if (r.parsedDate && r.parsedDate < filters.fromDate) {
          return false;
        }
      }
      if (filters.toDate && filters.toDate.trim() !== '') {
        if (r.parsedDate && r.parsedDate > filters.toDate) {
          return false;
        }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
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
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="block font-bold">Failed to Sync Live Data</strong>
                <span className="text-xs opacity-90">{error}</span>
              </div>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {isLoading && allRecords.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-500">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold">Fetching Live Swine Flu Line List from Google Sheets...</p>
          </div>
        ) : (
          <>
            {/* Live Weather Small Cards (IMD Regional Met Centre Nagpur) */}
            <NagpurWeatherWidget />

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

            {/* Hospital 2025 vs 2026 Comparison Table */}
            <HospitalComparisonTable records={finalFilteredRecords} />

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
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Swine Flu Surveillance Dashboard • Powered by Next.js & Published Google Sheets</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>Sources: <strong>Line list 2025</strong> & <strong>Line List 2026</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Auto Live Feed</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

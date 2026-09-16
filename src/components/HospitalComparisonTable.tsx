'use client';

import React, { useState, useMemo } from 'react';
import { SwineFluRecord } from '@/lib/types';
import { Building2, TrendingUp, TrendingDown, Minus, Sparkles, Search, ArrowUpDown } from 'lucide-react';

interface HospitalComparisonTableProps {
  records: SwineFluRecord[];
}

export interface HospitalStat {
  name: string;
  count2025: number;
  count2026: number;
  total: number;
  pctChange: number | null; // null if 2025 was 0
  status: 'NEW' | 'INCREASED' | 'DECREASED' | 'STABLE' | 'INACTIVE';
}

function normalizeHospitalName(raw: string): string {
  let name = raw.trim();
  if (!name || name.toUpperCase().includes('UNSPECIFIED')) return 'Unspecified / Other';
  
  const upper = name.toUpperCase();
  if (upper.includes('MEDITRINA')) return 'Meditrina Hospital';
  if (upper.includes('CRITI CARE') || upper.includes('CRITICARE')) return 'Criti Care Hospital';
  if (upper.includes('KINGSWAY') || upper.includes('KIMS')) return 'KIMS Kingsway Hospital';
  if (upper.includes('VIVEKA')) return 'Viveka Hospital';
  if (upper.includes('AUREUS')) return 'Aureus Hospital';
  if (upper.includes('MAX')) return 'Max Super Speciality Hospital';
  if (upper.includes('NEW ERA')) return 'New Era Hospital';
  if (upper.includes('CENTRAL INDIA')) return 'Central India Institute';
  if (upper.includes('GANGA')) return 'Ganga Care Hospital';
  if (upper.includes('KUNAL')) return 'Kunal Hospital';
  if (upper.includes('IGGMC') || upper.includes('GMC')) return 'GMC / IGGMC Nagpur';
  if (upper.includes('ALEXIS')) return 'Alexis Hospital';
  if (upper.includes('MOPE')) return 'Hope Hospital';
  if (upper.includes('SENGUPTA')) return 'Sengupta Hospital';
  if (upper.includes('GETWELL')) return 'Getwell Hospital';
  if (upper.includes('MAYUR')) return 'Mayur Hospital';
  if (upper.includes('PLATINA')) return 'Platina Heart Institute';

  return name;
}

export const HospitalComparisonTable: React.FC<HospitalComparisonTableProps> = ({ records }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'total' | 'count2025' | 'count2026' | 'name'>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Compute Hospital Comparative Data
  const hospitalData = useMemo(() => {
    const map: Record<string, { count2025: number; count2026: number }> = {};

    records.forEach((r) => {
      const name = normalizeHospitalName(r.hospitalName);
      if (!map[name]) {
        map[name] = { count2025: 0, count2026: 0 };
      }
      if (r.year === 2025) map[name].count2025 += 1;
      if (r.year === 2026) map[name].count2026 += 1;
    });

    const list: HospitalStat[] = Object.entries(map).map(([name, { count2025, count2026 }]) => {
      const total = count2025 + count2026;
      let pctChange: number | null = null;
      let status: HospitalStat['status'] = 'STABLE';

      if (count2025 === 0 && count2026 > 0) {
        status = 'NEW';
      } else if (count2025 > 0 && count2026 === 0) {
        status = 'INACTIVE';
      } else if (count2025 > 0) {
        pctChange = Math.round(((count2026 - count2025) / count2025) * 100);
        if (pctChange > 0) status = 'INCREASED';
        else if (pctChange < 0) status = 'DECREASED';
        else status = 'STABLE';
      }

      return { name, count2025, count2026, total, pctChange, status };
    });

    return list;
  }, [records]);

  // Global KPI Summary metrics
  const totalHospitals2025 = useMemo(() => hospitalData.filter((h) => h.count2025 > 0).length, [hospitalData]);
  const totalHospitals2026 = useMemo(() => hospitalData.filter((h) => h.count2026 > 0).length, [hospitalData]);
  const newHospitals2026 = useMemo(() => hospitalData.filter((h) => h.status === 'NEW').length, [hospitalData]);
  const maxTotal = useMemo(() => Math.max(...hospitalData.map((h) => h.total), 1), [hospitalData]);

  // Filter and Sort
  const filteredData = useMemo(() => {
    return hospitalData
      .filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortDirection === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [hospitalData, search, sortField, sortDirection]);

  const handleSort = (field: 'total' | 'count2025' | 'count2026' | 'name') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm my-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <Building2 className="w-5 h-5 text-cyan-600" />
            <h2>Reporting Hospitals Comparison (2025 vs 2026)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Comparative analysis of healthcare facilities reporting Swine Flu (H1N1) admissions across 2025 and 2026.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-9 pr-4 py-2 rounded-xl focus:bg-white focus:outline-none focus:border-cyan-500 font-medium transition"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">Reporting Hospitals (2025)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-emerald-700">{totalHospitals2025}</span>
            <span className="text-[10px] text-slate-500 font-mono font-medium">2025 Line List</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">Reporting Hospitals (2026)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-cyan-700">{totalHospitals2026}</span>
            <span className="text-[10px] text-slate-500 font-mono font-medium">2026 Line List</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">New Centers in 2026</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-amber-700">{newHospitals2026}</span>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> Joined Feed
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">Total Active Facilities</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{hospitalData.length}</span>
            <span className="text-[10px] text-slate-500 font-mono font-medium">Combined</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Hospital / Healthcare Center</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('count2025')}
                className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 transition select-none"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>2025 Cases</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('count2026')}
                className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 transition select-none"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>2026 Cases</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('total')}
                className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 transition select-none"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Total Cases</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">YoY Trend</th>
              <th className="py-3 px-4">Relative Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredData.map((item, index) => {
              return (
                <tr key={item.name + index} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0"></span>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-700 font-bold">
                    {item.count2025}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-cyan-700 font-bold">
                    {item.count2026}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-900">
                    {item.total}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === 'NEW' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" /> New in 2026
                      </span>
                    )}
                    {item.status === 'INACTIVE' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                        Inactive in 2026
                      </span>
                    )}
                    {item.status === 'INCREASED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        <TrendingUp className="w-2.5 h-2.5 text-emerald-600" /> +{item.pctChange}%
                      </span>
                    )}
                    {item.status === 'DECREASED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                        <TrendingDown className="w-2.5 h-2.5 text-rose-600" /> {item.pctChange}%
                      </span>
                    )}
                    {item.status === 'STABLE' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        <Minus className="w-2.5 h-2.5 text-slate-500" /> Stable
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex border border-slate-200">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${item.total > 0 ? (item.count2025 / maxTotal) * 100 : 0}%` }}
                        title={`2025: ${item.count2025}`}
                      ></div>
                      <div
                        className="bg-cyan-500 h-full transition-all"
                        style={{ width: `${item.total > 0 ? (item.count2026 / maxTotal) * 100 : 0}%` }}
                        title={`2026: ${item.count2026}`}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

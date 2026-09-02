'use client';
import React, { useState, useMemo } from 'react';
import { SwineFluRecord } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface PatientDataTableProps {
  records: SwineFluRecord[];
  onSelectRecord: (record: SwineFluRecord) => void;
}

type SortField = 'year' | 'srNo' | 'dateOfReporting' | 'patientName' | 'age' | 'sex' | 'zoneClean' | 'hospitalName' | 'outcomeStatus';
type SortOrder = 'asc' | 'desc';

export const PatientDataTable: React.FC<PatientDataTableProps> = ({
  records,
  onSelectRecord,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const [sortField, setSortField] = useState<SortField>('srNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Handle column sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sorted Records
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Export Filtered Records as CSV
  const exportToCSV = () => {
    if (records.length === 0) return;

    const headers = [
      'Year',
      'Sr. No.',
      'Month',
      'Date of Reporting',
      'Patient Name',
      'Contact',
      'Age Category',
      'Age',
      'Sex',
      'Region',
      'Zone',
      'Hospital Name',
      'Govt/Pvt',
      'Diagnostic Lab',
      'Symptoms',
      'Address',
      'Outcome',
      'Remark',
    ];

    const rows = sortedRecords.map((r) => [
      r.year,
      r.srNo,
      `"${r.month}"`,
      `"${r.dateOfReporting}"`,
      `"${r.patientName}"`,
      `"${r.contactNumber}"`,
      `"${r.ageCategory}"`,
      r.age ?? `"${r.ageBracketRaw}"`,
      `"${r.sex}"`,
      `"${r.regionCategory}"`,
      `"${r.zoneClean}"`,
      `"${r.hospitalName}"`,
      `"${r.govPvt}"`,
      `"${r.labName}"`,
      `"${r.symptoms.replace(/"/g, '""')}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.outcomeStatus}"`,
      `"${r.remark2.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Swine_Flu_Line_List_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 lg:p-6 shadow-xl my-6">
      
      {/* Table Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Patient Line List Registry</h3>
          <span className="text-xs text-slate-400 font-medium">({records.length} records)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 hover:text-emerald-100 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-700">
            <tr>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('year')}>
                <div className="flex items-center gap-1">Source <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('srNo')}>
                <div className="flex items-center gap-1">Sr <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('dateOfReporting')}>
                <div className="flex items-center gap-1">Date Reported <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('patientName')}>
                <div className="flex items-center gap-1">Patient Name <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('age')}>
                <div className="flex items-center gap-1">Age / Sex <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('zoneClean')}>
                <div className="flex items-center gap-1">Zone / Area <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('hospitalName')}>
                <div className="flex items-center gap-1">Hospital <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3">Symptoms</th>
              <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('outcomeStatus')}>
                <div className="flex items-center gap-1">Outcome <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                  No records match your filter criteria. Try resetting filters.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelectRecord(r)}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        r.year === 2025
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {r.year}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono font-medium">{r.srNo}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">{r.dateOfReporting || 'N/A'}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{r.patientName}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-slate-200 font-medium">{r.age ?? r.ageBracketRaw} y/o</span>
                    <span className="text-slate-500 text-[10px] block">{r.sex}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-200 font-medium block truncate max-w-[140px]">{r.zoneClean}</span>
                    <span className="text-[10px] text-purple-300 block">{r.regionCategory}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-cyan-300 font-medium block truncate max-w-[160px]">{r.hospitalName}</span>
                  </td>
                  <td className="py-2.5 px-3 max-w-[180px] truncate text-slate-400 text-[11px]" title={r.symptoms}>
                    {r.symptoms || '—'}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {r.outcomeStatus === 'Discharged' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" /> Discharged
                      </span>
                    )}
                    {r.outcomeStatus === 'Deceased' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold">
                        <XCircle className="w-3 h-3 text-rose-400" /> Deceased
                      </span>
                    )}
                    {r.outcomeStatus === 'Currently Admitted' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-semibold">
                        <Clock className="w-3 h-3 text-amber-400" /> Admitted
                      </span>
                    )}
                    {r.outcomeStatus === 'Rejected (Non-Swine Flu Cause)' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-medium">
                        <HelpCircle className="w-3 h-3 text-slate-500" /> Rejected (Non-Flu)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecord(r);
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400">
        <div>
          Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
          <strong className="text-slate-200">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

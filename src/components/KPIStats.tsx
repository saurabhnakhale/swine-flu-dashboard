'use client';
import React from 'react';
import { SwineFluRecord } from '@/lib/types';
import { Users, CalendarClock, HeartPulse, AlertTriangle, Baby, MapPin } from 'lucide-react';

interface KPIStatsProps {
  records: SwineFluRecord[];
  allRecords: SwineFluRecord[];
}

export const KPIStats: React.FC<KPIStatsProps> = ({ records }) => {
  const total = records.length;
  
  const count2025 = records.filter(r => r.year === 2025).length;
  const count2026 = records.filter(r => r.year === 2026).length;

  // Today's Date in IST / Local
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  let todayIST = '';
  try {
    todayIST = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(today);
  } catch {
    todayIST = todayISO;
  }

  const todayDMY1 = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;
  const todayDMY2 = `${pad(today.getDate())}.${pad(today.getMonth() + 1)}.${today.getFullYear()}`;
  const todayDMY3 = `${pad(today.getDate())}-${pad(today.getMonth() + 1)}-${today.getFullYear()}`;

  // Prevent SSR/client hydration mismatch for dates
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const todayFormatted = mounted
    ? new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
      }).format(today)
    : '';

  // Today's total cases count
  const todayTotal = React.useMemo(() => {
    return records.filter((r) => {
      if (r.parsedDate && (r.parsedDate === todayISO || r.parsedDate === todayIST)) {
        return true;
      }
      if (r.dateOfReporting) {
        const raw = r.dateOfReporting.trim();
        if (
          raw === todayISO ||
          raw === todayIST ||
          raw === todayDMY1 ||
          raw === todayDMY2 ||
          raw === todayDMY3
        ) {
          return true;
        }
      }
      return false;
    }).length;
  }, [records, todayISO, todayIST, todayDMY1, todayDMY2, todayDMY3]);

  // Find latest reporting date in records for context
  const latestDateInfo = React.useMemo(() => {
    let maxDate = '';
    records.forEach((r) => {
      if (r.parsedDate && r.parsedDate > maxDate) {
        maxDate = r.parsedDate;
      }
    });
    if (!maxDate) return null;
    const count = records.filter((r) => r.parsedDate === maxDate).length;
    try {
      const [y, m, d] = maxDate.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const formatted = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
      }).format(dt);
      return { date: maxDate, formatted, count };
    } catch {
      return { date: maxDate, formatted: maxDate, count };
    }
  }, [records]);

  const discharged = records.filter(r => r.outcomeStatus === 'Discharged').length;

  const seniors = records.filter(r => r.ageCategory === 'Senior (>60)').length;
  const pediatrics = records.filter(r => r.ageCategory === 'Pediatric (<18)').length;
  const adults = records.filter(r => r.ageCategory === 'Adult (18-60)').length;

  const nmcUrban = records.filter(r => r.regionCategory === 'NMC Nagpur (Urban)').length;
  const nagpurRural = records.filter(r => r.regionCategory === 'Nagpur Rural').length;
  const otherState = records.filter(r => r.regionCategory === 'Other State').length;

  const recoveryRate = total > 0 ? ((discharged / total) * 100).toFixed(1) : '0';
  const seniorRate = total > 0 ? ((seniors / total) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 my-6">
      
      {/* 1. Total Cases */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Cases</span>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-slate-900">{total}</span>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Line List</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>2025: <strong className="text-emerald-700 font-bold">{count2025}</strong></span>
          <span>2026: <strong className="text-cyan-700 font-bold">{count2026}</strong></span>
        </div>
      </div>

      {/* 2. Today's Total Cases */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today&apos;s Total Cases</span>
          <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 group-hover:scale-110 transition-transform">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className={`text-2xl font-extrabold ${todayTotal > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {todayTotal}
          </span>
          {todayTotal > 0 ? (
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
              +{todayTotal} Today
            </span>
          ) : (
            <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Today
            </span>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{todayFormatted || 'Today'}</span>
          <span className="text-slate-700 font-medium truncate ml-1">
            {todayTotal > 0 ? 'Active Intake' : (latestDateInfo ? `Latest: ${latestDateInfo.formatted} (${latestDateInfo.count})` : '0 new')}
          </span>
        </div>
      </div>

      {/* 3. Discharged / Recovered */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Discharged</span>
          <div className="p-2 bg-teal-50 border border-teal-200 rounded-xl text-teal-600 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-teal-700">{discharged}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {recoveryRate}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Recovered Rate</span>
          <span className="text-slate-700 font-semibold">{discharged} of {total}</span>
        </div>
      </div>

      {/* 4. Senior High Risk (>60 yrs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Senior (&gt;60 Yrs)</span>
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-amber-700">{seniors}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {seniorRate}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>High Vulnerability</span>
          <span className="text-slate-700 font-semibold">{seniors} cases</span>
        </div>
      </div>

      {/* 5. Pediatric Cases (<18 yrs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pediatric (&lt;18 Yrs)</span>
          <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-600 group-hover:scale-110 transition-transform">
            <Baby className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-cyan-700">{pediatrics}</span>
          <span className="text-xs text-slate-600 font-semibold">Children</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Adults (18-60)</span>
          <span className="text-slate-700 font-semibold">{adults}</span>
        </div>
      </div>

      {/* 6. Region Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Urban / Rural</span>
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-purple-700">{nmcUrban}</span>
          <span className="text-xs text-purple-700 font-semibold">NMC Urban</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rural: <strong className="text-purple-800">{nagpurRural}</strong></span>
          <span>Out-State: <strong className="text-purple-800">{otherState}</strong></span>
        </div>
      </div>

    </div>
  );
};

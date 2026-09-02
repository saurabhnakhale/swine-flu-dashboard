'use client';
import React from 'react';
import { SwineFluRecord } from '@/lib/types';
import { Users, HeartPulse, Skull, AlertTriangle, Baby, Building2, MapPin } from 'lucide-react';

interface KPIStatsProps {
  records: SwineFluRecord[];
  allRecords: SwineFluRecord[];
}

export const KPIStats: React.FC<KPIStatsProps> = ({ records, allRecords }) => {
  const total = records.length;
  
  const count2025 = records.filter(r => r.year === 2025).length;
  const count2026 = records.filter(r => r.year === 2026).length;

  const discharged = records.filter(r => r.outcomeStatus === 'Discharged').length;
  const deceased = records.filter(r => r.outcomeStatus === 'Deceased').length;
  const admitted = records.filter(r => r.outcomeStatus === 'Currently Admitted').length;
  const rejected = records.filter(r => r.outcomeStatus === 'Rejected (Non-Swine Flu Cause)').length;

  const seniors = records.filter(r => r.ageCategory === 'Senior (>60)').length;
  const pediatrics = records.filter(r => r.ageCategory === 'Pediatric (<18)').length;
  const adults = records.filter(r => r.ageCategory === 'Adult (18-60)').length;

  const nmcUrban = records.filter(r => r.regionCategory === 'NMC Nagpur (Urban)').length;
  const nagpurRural = records.filter(r => r.regionCategory === 'Nagpur Rural').length;
  const otherDistrict = records.filter(r => r.regionCategory === 'Other District (MH)').length;
  const otherState = records.filter(r => r.regionCategory === 'Other State').length;

  const recoveryRate = total > 0 ? ((discharged / total) * 100).toFixed(1) : '0';
  const mortalityRate = total > 0 ? ((deceased / total) * 100).toFixed(1) : '0';
  const seniorRate = total > 0 ? ((seniors / total) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 my-6">
      
      {/* 1. Total Cases */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Cases</span>
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-100">{total}</span>
          <span className="text-xs text-emerald-400 font-medium">Line List</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>2025: <strong className="text-emerald-300">{count2025}</strong></span>
          <span>2026: <strong className="text-cyan-300">{count2026}</strong></span>
        </div>
      </div>

      {/* 2. Discharged / Recovered */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-teal-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Discharged</span>
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-teal-300">{discharged}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800">
            {recoveryRate}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Recovered Rate</span>
          <span className="text-slate-300 font-medium">{discharged} of {total}</span>
        </div>
      </div>

      {/* 3. Fatalities / Deceased */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-rose-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deceased</span>
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 group-hover:scale-110 transition-transform">
            <Skull className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-400">{deceased}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800">
            {mortalityRate}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Confirmed Deaths</span>
          <span className="text-slate-300 font-medium">({rejected} non-flu rejected)</span>
        </div>
      </div>

      {/* 4. Senior High Risk (>60 yrs) */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Senior (&gt;60 Yrs)</span>
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-300">{seniors}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
            {seniorRate}%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>High Vulnerability</span>
          <span className="text-slate-300 font-medium">{seniors} cases</span>
        </div>
      </div>

      {/* 5. Pediatric Cases (<18 yrs) */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pediatric (&lt;18 Yrs)</span>
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
            <Baby className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-cyan-300">{pediatrics}</span>
          <span className="text-xs text-slate-400 font-medium">Children</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Adults (18-60)</span>
          <span className="text-slate-300 font-medium">{adults}</span>
        </div>
      </div>

      {/* 6. Region Distribution */}
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-lg hover:border-purple-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Urban / Rural</span>
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-purple-300">{nmcUrban}</span>
          <span className="text-xs text-purple-400 font-medium">NMC Urban</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Rural: <strong className="text-purple-300">{nagpurRural}</strong></span>
          <span>Out-State: <strong className="text-purple-300">{otherState}</strong></span>
        </div>
      </div>

    </div>
  );
};

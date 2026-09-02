'use client';
import React, { useState } from 'react';
import { SwineFluRecord } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, MapPin, PieChart as PieIcon, Building2, BarChart2 } from 'lucide-react';

interface AnalyticsSectionProps {
  records: SwineFluRecord[];
}

const MONTH_ORDER = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const COLORS = {
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  rose: '#f43f5e',
  purple: '#a855f7',
  indigo: '#6366f1',
  slate: '#64748b',
};

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'geo' | 'demographics' | 'hospitals'>('trends');

  // --- 1. Monthly Trends Data (2025 vs 2026) ---
  const monthlyMap: Record<string, { month: string; m2025: number; m2026: number; total: number }> = {};
  MONTH_ORDER.forEach((m) => {
    monthlyMap[m] = { month: m, m2025: 0, m2026: 0, total: 0 };
  });

  records.forEach((r) => {
    const m = r.monthNormalized;
    if (monthlyMap[m]) {
      if (r.year === 2025) monthlyMap[m].m2025 += 1;
      if (r.year === 2026) monthlyMap[m].m2026 += 1;
      monthlyMap[m].total += 1;
    }
  });

  const monthlyTrendData = MONTH_ORDER.map((m) => monthlyMap[m]);

  // --- 2. Zone & Region Distribution Data ---
  const zoneMap: Record<string, number> = {};
  records.forEach((r) => {
    const z = r.zoneClean || 'Unspecified';
    zoneMap[z] = (zoneMap[z] || 0) + 1;
  });

  const zoneData = Object.entries(zoneMap)
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count);

  const regionMap: Record<string, number> = {};
  records.forEach((r) => {
    const reg = r.regionCategory;
    regionMap[reg] = (regionMap[reg] || 0) + 1;
  });

  const regionData = Object.entries(regionMap).map(([name, count]) => ({
    name,
    count,
  }));

  // --- 3. Age & Gender Data ---
  const ageCategoryOrder = ['Pediatric (<18)', 'Adult (18-60)', 'Senior (>60)'];
  const ageGenderMap: Record<string, { ageCategory: string; Male: number; Female: number; Total: number }> = {
    'Pediatric (<18)': { ageCategory: 'Pediatric (<18)', Male: 0, Female: 0, Total: 0 },
    'Adult (18-60)': { ageCategory: 'Adult (18-60)', Male: 0, Female: 0, Total: 0 },
    'Senior (>60)': { ageCategory: 'Senior (>60)', Male: 0, Female: 0, Total: 0 },
  };

  records.forEach((r) => {
    const cat = r.ageCategory !== 'Unspecified' ? r.ageCategory : 'Adult (18-60)';
    if (!ageGenderMap[cat]) {
      ageGenderMap[cat] = { ageCategory: cat, Male: 0, Female: 0, Total: 0 };
    }
    if (r.sex === 'Male') ageGenderMap[cat].Male += 1;
    if (r.sex === 'Female') ageGenderMap[cat].Female += 1;
    ageGenderMap[cat].Total += 1;
  });

  const ageGenderData = ageCategoryOrder.map((cat) => ageGenderMap[cat]);

  // --- 4. Outcome Donut Data ---
  const outcomeCounts = {
    Discharged: records.filter((r) => r.outcomeStatus === 'Discharged').length,
    Deceased: records.filter((r) => r.outcomeStatus === 'Deceased').length,
    'Currently Admitted': records.filter((r) => r.outcomeStatus === 'Currently Admitted').length,
    'Rejected (Non-Flu)': records.filter((r) => r.outcomeStatus === 'Rejected (Non-Swine Flu Cause)').length,
  };

  const outcomePieData = [
    { name: 'Discharged / Recovered', value: outcomeCounts.Discharged, color: COLORS.teal },
    { name: 'Deceased / Fatality', value: outcomeCounts.Deceased, color: COLORS.rose },
    { name: 'Currently Admitted', value: outcomeCounts['Currently Admitted'], color: COLORS.amber },
    { name: 'Rejected (Non-Flu)', value: outcomeCounts['Rejected (Non-Flu)'], color: COLORS.slate },
  ].filter((item) => item.value > 0);

  // --- 5. Hospital Load Data ---
  const hospitalMap: Record<string, number> = {};
  records.forEach((r) => {
    let name = r.hospitalName.trim();
    if (!name || name.toUpperCase().includes('UNSPECIFIED')) return;
    if (name.toUpperCase().includes('MEDITRINA')) name = 'Meditrina Hospital';
    else if (name.toUpperCase().includes('CRITI CARE')) name = 'Criti Care Hospital';
    else if (name.toUpperCase().includes('KINGSWAY') || name.toUpperCase().includes('KIMS')) name = 'KIMS Kingsway Hospital';
    else if (name.toUpperCase().includes('VIVEKA')) name = 'Viveka Hospital';
    else if (name.toUpperCase().includes('AUREUS')) name = 'Aureus Hospital';
    else if (name.toUpperCase().includes('MAX')) name = 'Max Super Speciality';
    else if (name.toUpperCase().includes('NEW ERA')) name = 'New Era Child Care / Hospital';
    else if (name.toUpperCase().includes('CENTRAL INDIA')) name = 'Central India Hospital';
    else if (name.toUpperCase().includes('GANGA')) name = 'Ganga Care Hospital';
    else if (name.toUpperCase().includes('KUNAL')) name = 'Kunal Hospital';
    else if (name.toUpperCase().includes('IGGMC') || name.toUpperCase().includes('GMC')) name = 'GMC / IGGMC Nagpur';
    hospitalMap[name] = (hospitalMap[name] || 0) + 1;
  });

  const hospitalData = Object.entries(hospitalMap)
    .map(([hospital, count]) => ({ hospital, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 lg:p-6 shadow-xl my-6">
      
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <BarChart2 className="w-5 h-5 text-emerald-400" />
          <span>Epidemiological Visual Analytics</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'trends'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Seasonality & Trends
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'geo'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Zone & Region Density
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'demographics'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Age & Outcomes
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'hospitals'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hospital Load
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        
        {/* TAB 1: Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 text-sm">Monthly Case Comparison (2025 vs 2026)</span>
              <span>Spikes noted in July–August (Monsoon) and Oct–Dec (Winter)</span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="m2025" name="2025 Cases" fill={COLORS.emerald} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="m2026" name="2026 Cases" fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: Geo / Zones */}
        {activeTab === 'geo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Municipal Zones Bar Chart */}
            <div className="lg:col-span-2 space-y-4">
              <span className="font-semibold text-slate-200 text-sm block">Swine Flu Case Density by Zone & Region</span>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={zoneData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="zone" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Bar dataKey="count" name="Total Cases" fill={COLORS.teal} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Region Category Pie Chart */}
            <div className="space-y-4 flex flex-col justify-between">
              <span className="font-semibold text-slate-200 text-sm block">Urban vs Rural vs Out of State</span>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={4}
                      label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {regionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[COLORS.emerald, COLORS.cyan, COLORS.purple, COLORS.amber][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-1.5 text-xs text-slate-300">
                {regionData.map((r, i) => (
                  <div key={r.name} className="flex items-center justify-between px-2 py-1 bg-slate-900/60 rounded-lg">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: [COLORS.emerald, COLORS.cyan, COLORS.purple, COLORS.amber][i % 4] }}></span>
                      {r.name}
                    </span>
                    <strong className="text-slate-100">{r.count}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Demographics & Outcomes */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Age & Gender Bar Chart */}
            <div className="space-y-4">
              <span className="font-semibold text-slate-200 text-sm block">Case Vulnerability by Age Category & Gender</span>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGenderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="ageCategory" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Legend />
                    <Bar dataKey="Male" fill={COLORS.indigo} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Female" fill={COLORS.purple} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outcome Donut Chart */}
            <div className="space-y-4">
              <span className="font-semibold text-slate-200 text-sm block">Clinical Outcome Breakdown</span>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={outcomePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={5}
                    >
                      {outcomePieData.map((entry, index) => (
                        <Cell key={`cell-outcome-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Hospital Load */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            <span className="font-semibold text-slate-200 text-sm block">Top Healthcare Centers Handling Swine Flu Admissions</span>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hospitalData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="hospital" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={160} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                  <Bar dataKey="count" name="Admitted Patients" fill={COLORS.cyan} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

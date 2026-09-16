'use client';
import React from 'react';
import { SwineFluRecord } from '@/lib/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  LabelList,
} from 'recharts';
import { TrendingUp, MapPin, PieChart as PieIcon, Building2, BarChart2, Activity } from 'lucide-react';

interface AnalyticsSectionProps {
  records: SwineFluRecord[];
}

const MONTH_ORDER = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const COLORS = {
  blue2025: '#2563eb',   // Royal Blue for 2025
  amber2026: '#ea580c',  // Warm Orange / Amber for 2026
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

  // --- 2. Zone & Region Distribution Data (2025 vs 2026 Breakdown) ---
  const zoneMap: Record<string, { zone: string; z2025: number; z2026: number; total: number }> = {};
  records.forEach((r) => {
    const z = r.zoneClean || 'Unspecified Zone';
    if (!zoneMap[z]) {
      zoneMap[z] = { zone: z, z2025: 0, z2026: 0, total: 0 };
    }
    if (r.year === 2025) zoneMap[z].z2025 += 1;
    if (r.year === 2026) zoneMap[z].z2026 += 1;
    zoneMap[z].total += 1;
  });

  const zoneData = Object.values(zoneMap)
    .sort((a, b) => b.total - a.total);

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
    { name: 'Discharged', value: outcomeCounts.Discharged, color: COLORS.teal },
    { name: 'Deceased', value: outcomeCounts.Deceased, color: COLORS.rose },
    { name: 'Currently Admitted', value: outcomeCounts['Currently Admitted'], color: COLORS.amber },
    { name: 'Rejected (Non-Flu)', value: outcomeCounts['Rejected (Non-Flu)'], color: COLORS.slate },
  ].filter((item) => item.value > 0);

  // --- 5. Hospital Load Data (2025 vs 2026 Breakdown) ---
  const hospitalMap: Record<string, { hospital: string; h2025: number; h2026: number; total: number }> = {};
  records.forEach((r) => {
    let name = r.hospitalName.trim();
    if (!name || name.toUpperCase().includes('UNSPECIFIED')) return;
    if (name.toUpperCase().includes('MEDITRINA')) name = 'Meditrina Hospital';
    else if (name.toUpperCase().includes('CRITI CARE') || name.toUpperCase().includes('CRITICARE')) name = 'Criti Care Hospital';
    else if (name.toUpperCase().includes('KINGSWAY') || name.toUpperCase().includes('KIMS')) name = 'KIMS Kingsway';
    else if (name.toUpperCase().includes('VIVEKA')) name = 'Viveka Hospital';
    else if (name.toUpperCase().includes('AUREUS')) name = 'Aureus Hospital';
    else if (name.toUpperCase().includes('MAX')) name = 'Max Speciality';
    else if (name.toUpperCase().includes('NEW ERA')) name = 'New Era Hospital';
    else if (name.toUpperCase().includes('CENTRAL INDIA')) name = 'Central India Hospital';
    else if (name.toUpperCase().includes('GANGA')) name = 'Ganga Care';
    else if (name.toUpperCase().includes('KUNAL')) name = 'Kunal Hospital';
    else if (name.toUpperCase().includes('IGGMC') || name.toUpperCase().includes('GMC')) name = 'GMC / IGGMC';
    
    if (!hospitalMap[name]) {
      hospitalMap[name] = { hospital: name, h2025: 0, h2026: 0, total: 0 };
    }
    if (r.year === 2025) hospitalMap[name].h2025 += 1;
    if (r.year === 2026) hospitalMap[name].h2026 += 1;
    hospitalMap[name].total += 1;
  });

  const hospitalData = Object.values(hospitalMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <div className="space-y-6 my-6">
      
      {/* Section Title */}
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg px-1">
        <BarChart2 className="w-5 h-5 text-emerald-600" />
        <h2>Epidemiological Analytics & Visualizations</h2>
      </div>

      {/* MONTHLY LINE TREND CHART (Full Width) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">Monthly Case Trend & Yearwise Line Comparison (2025 vs 2026)</h3>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="color2025Blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue2025} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.blue2025} stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="color2026Amber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.amber2026} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.amber2026} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="m2025"
                name="2025 Cases"
                stroke={COLORS.blue2025}
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#color2025Blue)"
                dot={{ r: 4, fill: COLORS.blue2025, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8 }}
              >
                <LabelList dataKey="m2025" position="top" fill={COLORS.blue2025} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Area>
              <Area
                type="monotone"
                dataKey="m2026"
                name="2026 Cases"
                stroke={COLORS.amber2026}
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#color2026Amber)"
                dot={{ r: 4, fill: COLORS.amber2026, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8 }}
              >
                <LabelList dataKey="m2026" position="top" fill={COLORS.amber2026} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MUNICIPAL ZONE DENSITY (Wide Full-Width Frame) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-base">Case Density by Municipal Zone (2025 vs 2026)</h3>
          </div>
        </div>
        <div className="h-[480px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneData} layout="vertical" margin={{ top: 5, right: 35, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="zone"
                type="category"
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                width={160}
                interval={0}
              />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '5px' }} />
              <Bar dataKey="z2025" name="2025 Cases" fill={COLORS.blue2025} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="z2025" position="right" fill={COLORS.blue2025} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Bar>
              <Bar dataKey="z2026" name="2026 Cases" fill={COLORS.amber2026} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="z2026" position="right" fill={COLORS.amber2026} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRID LAYOUT FOR OTHER CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REGIONAL DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-600" />
            <h3 className="font-bold text-slate-800 text-sm">Urban vs Rural vs Out of State</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                  paddingAngle={4}
                  label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {regionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[COLORS.emerald, COLORS.cyan, COLORS.purple, COLORS.amber][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AGE GROUP & GENDER BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-800 text-sm">Age Category & Gender Profile</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGenderData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="ageCategory" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Legend />
                <Bar dataKey="Male" fill={COLORS.indigo} radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="Male" position="top" fill={COLORS.indigo} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
                </Bar>
                <Bar dataKey="Female" fill={COLORS.purple} radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="Female" position="top" fill={COLORS.purple} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CLINICAL OUTCOMES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">Clinical Outcome Breakdown</h3>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {outcomePieData.map((entry, index) => (
                    <Cell key={`cell-outcome-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TOP HEALTHCARE CENTERS (Full Width) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-600" />
          <h3 className="font-bold text-slate-800 text-base">Top Healthcare Centers Handling Swine Flu Admissions (2025 vs 2026)</h3>
        </div>
        <div className="h-[480px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hospitalData} layout="vertical" margin={{ top: 5, right: 35, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="hospital"
                type="category"
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 600 }}
                width={160}
                interval={0}
              />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '5px' }} />
              <Bar dataKey="h2025" name="2025 Cases" fill={COLORS.blue2025} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="h2025" position="right" fill={COLORS.blue2025} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Bar>
              <Bar dataKey="h2026" name="2026 Cases" fill={COLORS.amber2026} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="h2026" position="right" fill={COLORS.amber2026} fontSize={11} fontWeight="bold" formatter={(val: any) => (val > 0 ? val : '')} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

'use client';
import React from 'react';
import { SwineFluRecord } from '@/lib/types';
import { X, User, MapPin, Calendar, Activity, ShieldCheck, Phone, Stethoscope, AlertCircle } from 'lucide-react';

interface PatientDetailModalProps {
  record: SwineFluRecord | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const isDeceased = record.outcomeStatus === 'Deceased';
  const isAdmitted = record.outcomeStatus === 'Currently Admitted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{record.patientName}</h3>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    record.year === 2025
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  }`}
                >
                  Line List {record.year} (#{record.srNo})
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <span>{record.ageCategory}</span> • <span>{record.sex}</span> • <span>Age: {record.age ?? record.ageBracketRaw}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 text-xs">
          
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between font-semibold ${
              isDeceased
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : isAdmitted
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Outcome: <strong>{record.outcomeStatus}</strong></span>
            </div>
            {record.remark2 && <span className="text-[11px] opacity-80">{record.remark2}</span>}
          </div>

          {/* Key Clinical & Admission Dates */}
          <div>
            <h4 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Key Dates & Timeline
            </h4>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px]">Date of Reporting</span>
                <strong className="text-slate-900">{record.dateOfReporting || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Date of Illness Onset</span>
                <strong className="text-slate-900">{record.dateOfOnset || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Date of Admission</span>
                <strong className="text-slate-900">{record.dateOfAdmission || 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Hospital & Lab Info */}
          <div>
            <h4 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-600" /> Medical Center & Diagnostic Lab
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px]">Admitted Hospital</span>
                <strong className="text-cyan-700 font-bold">{record.hospitalName}</strong>
                <span className="text-[10px] text-slate-500 block">Type: {record.govPvt}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Testing Diagnostic Lab</span>
                <strong className="text-slate-900">{record.labName}</strong>
              </div>
            </div>
          </div>

          {/* Symptoms Reported */}
          {record.symptoms && (
            <div>
              <h4 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Reported Symptoms
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed">
                {record.symptoms}
              </div>
            </div>
          )}

          {/* Residential Address & Location */}
          <div>
            <h4 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Residence & Geographic Category
            </h4>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Region Category:</span>
                <span className="font-bold text-purple-700">{record.regionCategory}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Zone Name:</span>
                <span className="font-bold text-slate-800">{record.zone}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-500 font-medium shrink-0">Address:</span>
                <span className="font-medium text-slate-800 text-right">{record.address || 'N/A'}</span>
              </div>
              {record.contactNumber && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" /> Contact Number:
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">{record.contactNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Public Health Tracking Metrics */}
          <div>
            <h4 className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Public Health Line List Tracking
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">House Survey</span>
                <strong className="text-slate-900">{record.houseSurvey || 'N/A'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Symptomatic</span>
                <strong className="text-slate-900">{record.symptomatic || 'N/A'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Tamiflu Recd</span>
                <strong className="text-slate-900">{record.tamifluReceived || 'N/A'}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Travel History</span>
                <strong className="text-slate-900">{record.travelHistory || 'No'}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

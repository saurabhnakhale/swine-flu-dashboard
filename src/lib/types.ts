export interface RawSwineFluRecord {
  'Sr.no'?: string;
  'SR. NO. '?: string;
  'SR. NO.'?: string;
  'Month'?: string;
  'Month '?: string;
  'ZONE'?: string;
  'DATE OF REPORTING'?: string;
  'Patient Name'?: string;
  'contact number'?: string;
  'Age in Between'?: string;
  'Age'?: string;
  'SEX'?: string;
  'Date oF illness'?: string;
  'Date of Onset Illness'?: string;
  'date of admission'?: string;
  'LAB Name'?: string;
  'HOSPITAL  NAME '?: string;
  'HOSPITAL  NAME'?: string;
  'HOSPITAL NAME'?: string;
  'gov/pvt'?: string;
  'Sign And Symptons'?: string;
  'Resediantial address OF Patient'?: string;
  'DISt/ Corporation/ out of state'?: string;
  'URBAN/RURAL'?: string;
  'OUTCOME'?: string;
  'Remark 2'?: string;
  'Case Summery Form'?: string;
  'LINE LIST NO NMC'?: string;
  'line list other'?: string;
  'house survey'?: string;
  'symptomatic'?: string;
  'tamiflu recoieved'?: string;
  'travel history '?: string;
  'travel history'?: string;
  [key: string]: string | undefined;
}

export type YearSource = 2025 | 2026;

export type OutcomeStatus = 'Discharged' | 'Deceased' | 'Currently Admitted' | 'Rejected (Non-Swine Flu Cause)' | 'Unknown';

export type AgeCategory = 'Pediatric (<18)' | 'Adult (18-60)' | 'Senior (>60)' | 'Unspecified';

export type RegionCategory = 'NMC Nagpur (Urban)' | 'Nagpur Rural' | 'Other District (MH)' | 'Other State';

export interface SwineFluRecord {
  id: string;
  year: YearSource;
  srNo: number;
  month: string;
  monthNormalized: string; // e.g. "Jan", "Feb", "Mar"
  monthNum: number; // 1 to 12
  zone: string;
  zoneClean: string;
  dateOfReporting: string;
  parsedDate?: string | null;
  patientName: string;
  contactNumber: string;
  ageBracketRaw: string;
  ageCategory: AgeCategory;
  age: number | null;
  sex: 'Male' | 'Female' | 'Unknown';
  dateOfOnset: string;
  dateOfAdmission: string;
  labName: string;
  hospitalName: string;
  govPvt: 'PVT' | 'GOVT' | 'UNKNOWN';
  symptoms: string;
  address: string;
  district: string;
  regionCategory: RegionCategory;
  outcomeRaw: string;
  outcomeStatus: OutcomeStatus;
  remark2: string;
  caseSummaryForm: string;
  lineListNoNmc: string;
  lineListOther: string;
  houseSurvey: string;
  symptomatic: string;
  tamifluReceived: string;
  travelHistory: string;
}

export interface DashboardFilterState {
  searchQuery: string;
  year: 'ALL' | '2025' | '2026';
  month: string;
  regionCategory: string;
  zone: string;
  ageCategory: string;
  sex: string;
  outcomeStatus: string;
  hospital: string;
  fromDate: string;
  toDate: string;
}

export interface MonthlyTrendItem {
  month: string;
  monthNum: number;
  count2025: number;
  count2026: number;
  total: number;
}

export interface RegionDistributionItem {
  regionCategory: RegionCategory;
  count: number;
  percentage: number;
}

export interface ZoneDistributionItem {
  zone: string;
  count: number;
}

export interface AgeGenderItem {
  ageCategory: AgeCategory;
  male: number;
  female: number;
  total: number;
}

export interface OutcomeDistributionItem {
  status: OutcomeStatus;
  count: number;
  color: string;
}

export interface HospitalLoadItem {
  hospitalName: string;
  count: number;
}

export interface SwineFluApiResponse {
  success: boolean;
  timestamp: string;
  records2025Count: number;
  records2026Count: number;
  totalRecords: number;
  data: SwineFluRecord[];
  error?: string;
}

import Papa from 'papaparse';
import {
  RawSwineFluRecord,
  SwineFluRecord,
  YearSource,
  AgeCategory,
  OutcomeStatus,
  RegionCategory,
} from './types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function parseAge(ageStr?: string): number | null {
  if (!ageStr) return null;
  const str = ageStr.trim().toUpperCase();
  if (str.includes('MONTH') || str.endsWith('M')) {
    return 0; // Infant/Pediatric
  }
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function determineAgeCategory(ageBracket?: string, ageNum?: number | null): AgeCategory {
  const bracketUpper = (ageBracket || '').toUpperCase();
  const hasNum = typeof ageNum === 'number' && ageNum !== null;

  if (bracketUpper.includes('BELOW 18') || bracketUpper.includes('0 TO 18') || (hasNum && ageNum < 18)) {
    return 'Pediatric (<18)';
  }
  if (bracketUpper.includes('ABOVE 60') || (hasNum && ageNum >= 60)) {
    return 'Senior (>60)';
  }
  if (bracketUpper.includes('18 TO 60') || (hasNum && ageNum >= 18 && ageNum < 60)) {
    return 'Adult (18-60)';
  }
  return 'Unspecified';
}

export function determineSex(sexStr?: string): 'Male' | 'Female' | 'Unknown' {
  if (!sexStr) return 'Unknown';
  const clean = sexStr.trim().toUpperCase();
  if (clean.startsWith('M')) return 'Male';
  if (clean.startsWith('F')) return 'Female';
  return 'Unknown';
}

export function determineRegionCategory(
  urbanRural?: string,
  zone?: string,
  district?: string,
  address?: string
): RegionCategory {
  const urUpper = (urbanRural || '').toUpperCase();
  const zoneUpper = (zone || '').toUpperCase();
  const distUpper = (district || '').toUpperCase();
  const addrUpper = (address || '').toUpperCase();

  if (
    urUpper.includes('OTHER STATE') ||
    distUpper.includes('OTHER STATE') ||
    distUpper.includes('MP') ||
    addrUpper.includes('MADHYAPRADESH') ||
    addrUpper.includes('BETUL') ||
    addrUpper.includes('CHHINDWARA') ||
    addrUpper.includes('SEONI')
  ) {
    return 'Other State';
  }

  if (
    urUpper.includes('NAGPUR RURAL') ||
    zoneUpper.includes('NAGPUR RURAL') ||
    urUpper.includes('RURAL')
  ) {
    return 'Nagpur Rural';
  }

  if (
    urUpper.includes('NMC') ||
    zoneUpper.includes('ZONE') ||
    zoneUpper.includes('NMC') ||
    urUpper.includes('URBAN')
  ) {
    return 'NMC Nagpur (Urban)';
  }

  if (
    urUpper.includes('OTHER DISTRICT') ||
    distUpper.includes('OTHER DISTRICT') ||
    distUpper.includes('BHANDARA') ||
    distUpper.includes('WARDHA') ||
    distUpper.includes('CHANDRAPUR') ||
    distUpper.includes('YAWATMAL') ||
    distUpper.includes('GADCHIROLI') ||
    distUpper.includes('AMRAWATI')
  ) {
    return 'Other District (MH)';
  }

  return 'NMC Nagpur (Urban)';
}

export function determineOutcomeStatus(outcomeStr?: string, remarkStr?: string): OutcomeStatus {
  const combined = `${outcomeStr || ''} ${remarkStr || ''}`.toUpperCase();

  if (combined.includes('REJECTED BY COMIITTEE') || combined.includes('REJECTED BY COMITEE') || combined.includes('NOT SWINE FLU')) {
    return 'Rejected (Non-Swine Flu Cause)';
  }

  if (combined.includes('DEATH') || combined.includes('DATE OF DEATH') || combined.includes('DATE OD DEATH')) {
    return 'Deceased';
  }

  if (combined.includes('STILL ADMITTED')) {
    return 'Currently Admitted';
  }

  if (combined.includes('DISCHARGE') || combined.includes('DATE OF DISCHARGE') || combined.includes('OPD PATIENT')) {
    return 'Discharged';
  }

  return 'Discharged';
}

export function cleanZoneName(zoneRaw?: string): string {
  if (!zoneRaw) return 'Unspecified Zone';
  let clean = zoneRaw.trim();
  clean = clean.replace(/^\d+\.\s*/, ''); // remove leading number
  clean = clean.replace(/ZONE NO\.\s*\d+/i, '');
  clean = clean.replace(/ZONE\s*\d+/i, '');
  clean = clean.replace(/ZONNE\s*\d+/i, '');
  clean = clean.trim();
  
  if (clean.toUpperCase().includes('NAGPUR RURAL')) return 'Nagpur Rural';
  if (clean.toUpperCase().includes('OTHER DISTRICT')) return 'Other District';
  if (clean.toUpperCase().includes('OTHER STATE')) return 'Other State';

  if (!clean) return zoneRaw.trim();
  return clean;
}

export function parseMonthInfo(monthRaw?: string): { monthNormalized: string; monthNum: number } {
  if (!monthRaw) return { monthNormalized: 'Jan', monthNum: 1 };
  const rawLower = monthRaw.toLowerCase().trim();

  for (let i = 0; i < MONTH_NAMES.length; i++) {
    if (rawLower.includes(MONTH_NAMES[i].toLowerCase())) {
      return {
        monthNormalized: MONTH_NAMES[i].substring(0, 3),
        monthNum: i + 1,
      };
    }
  }
  return { monthNormalized: 'Jan', monthNum: 1 };
}

export function sanitizeRecord(raw: RawSwineFluRecord, year: YearSource, index: number): SwineFluRecord {
  const srNoStr = raw['Sr.no'] || raw['SR. NO. '] || raw['SR. NO.'] || `${index + 1}`;
  const srNo = parseInt(srNoStr, 10) || index + 1;
  const monthRaw = (raw['Month'] || raw['Month '] || '').trim();
  const { monthNormalized, monthNum } = parseMonthInfo(monthRaw);

  const zoneRaw = (raw['ZONE'] || '').trim();
  const zoneClean = cleanZoneName(zoneRaw);

  const patientName = (raw['Patient Name'] || 'Anonymous Patient').trim();
  const contactNumber = (raw['contact number'] || '').trim();
  const ageBracketRaw = (raw['Age in Between'] || '').trim();
  const ageRaw = (raw['Age'] || '').trim();
  const age = parseAge(ageRaw);
  const ageCategory = determineAgeCategory(ageBracketRaw, age);

  const sexRaw = (raw['SEX'] || '').trim();
  const sex = determineSex(sexRaw);

  const dateOfOnset = (raw['Date oF illness'] || raw['Date of Onset Illness'] || '').trim();
  const dateOfAdmission = (raw['date of admission'] || '').trim();

  const labName = (raw['LAB Name'] || 'Unspecified Lab').trim();
  const hospitalName = (raw['HOSPITAL  NAME '] || raw['HOSPITAL  NAME'] || raw['HOSPITAL NAME'] || 'Unspecified Hospital').trim();
  const govPvtRaw = (raw['gov/pvt'] || 'PVT').trim().toUpperCase();
  const govPvt: 'PVT' | 'GOVT' | 'UNKNOWN' = govPvtRaw.includes('GOVT') ? 'GOVT' : 'PVT';

  const symptoms = (raw['Sign And Symptons'] || '').trim();
  const address = (raw['Resediantial address OF Patient'] || '').trim();
  const district = (raw['DISt/ Corporation/ out of state'] || '').trim();
  const urbanRural = (raw['URBAN/RURAL'] || '').trim();
  const regionCategory = determineRegionCategory(urbanRural, zoneRaw, district, address);

  const outcomeRaw = (raw['OUTCOME'] || '').trim();
  const remark2 = (raw['Remark 2'] || '').trim();
  const outcomeStatus = determineOutcomeStatus(outcomeRaw, remark2);

  const caseSummaryForm = (raw['Case Summery Form'] || '').trim();
  const lineListNoNmc = (raw['LINE LIST NO NMC'] || '').trim();
  const lineListOther = (raw['line list other'] || '').trim();
  const houseSurvey = (raw['house survey'] || '').trim();
  const symptomatic = (raw['symptomatic'] || '').trim();
  const tamifluReceived = (raw['tamiflu recoieved'] || '').trim();
  const travelHistory = (raw['travel history '] || raw['travel history'] || '').trim();

  return {
    id: `${year}-${srNo}-${index}`,
    year,
    srNo,
    month: monthRaw || `${MONTH_NAMES[monthNum - 1]} ${year}`,
    monthNormalized,
    monthNum,
    zone: zoneRaw || 'Unspecified Zone',
    zoneClean,
    dateOfReporting: (raw['DATE OF REPORTING'] || '').trim(),
    patientName,
    contactNumber,
    ageBracketRaw,
    ageCategory,
    age,
    sex,
    dateOfOnset,
    dateOfAdmission,
    labName,
    hospitalName,
    govPvt,
    symptoms,
    address,
    district,
    regionCategory,
    outcomeRaw,
    outcomeStatus,
    remark2,
    caseSummaryForm,
    lineListNoNmc,
    lineListOther,
    houseSurvey,
    symptomatic,
    tamifluReceived,
    travelHistory,
  };
}

export function parseCSVData(csvText: string, year: YearSource): SwineFluRecord[] {
  const parsed = Papa.parse<RawSwineFluRecord>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (!parsed.data || parsed.data.length === 0) {
    return [];
  }

  return parsed.data
    .filter((row) => row['Patient Name'] || row['Month'] || row['ZONE'])
    .map((row, idx) => sanitizeRecord(row, year, idx));
}

import { parseCSVData } from './csvParser';
import { SwineFluApiResponse, SwineFluRecord } from './types';

const URL_2025 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSEjT5_uCXqa-OuHuiQgUJaVLdSXX_QCr857x0qlOJ0RXY__RPQaZ9v_rzKK97LYhn8OxwYinlcgzv/pub?gid=1138403852&single=true&output=csv';
const URL_2026 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSEjT5_uCXqa-OuHuiQgUJaVLdSXX_QCr857x0qlOJ0RXY__RPQaZ9v_rzKK97LYhn8OxwYinlcgzv/pub?gid=477036082&single=true&output=csv';

export async function fetchLiveSwineFluData(refresh = false): Promise<SwineFluApiResponse> {
  try {
    const fetchOptions: RequestInit = {
      cache: refresh ? 'no-store' : 'no-cache',
    };

    const [res2025, res2026] = await Promise.all([
      fetch(URL_2025, fetchOptions),
      fetch(URL_2026, fetchOptions),
    ]);

    if (!res2025.ok || !res2026.ok) {
      throw new Error(`Failed to fetch CSV data (${res2025.status} / ${res2026.status})`);
    }

    const [csv2025, csv2026] = await Promise.all([
      res2025.text(),
      res2026.text(),
    ]);

    const records2025 = parseCSVData(csv2025, 2025);
    const records2026 = parseCSVData(csv2026, 2026);
    const combinedData = [...records2025, ...records2026];

    return {
      success: true,
      timestamp: new Date().toISOString(),
      records2025Count: records2025.length,
      records2026Count: records2026.length,
      totalRecords: combinedData.length,
      data: combinedData,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error fetching Google Sheets CSV data';
    return {
      success: false,
      timestamp: new Date().toISOString(),
      records2025Count: 0,
      records2026Count: 0,
      totalRecords: 0,
      data: [],
      error: msg,
    };
  }
}

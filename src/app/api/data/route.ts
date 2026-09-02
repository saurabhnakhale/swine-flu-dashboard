import { NextResponse } from 'next/server';
import { parseCSVData } from '@/lib/csvParser';
import { SwineFluApiResponse } from '@/lib/types';

const URL_2025 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSEjT5_uCXqa-OuHuiQgUJaVLdSXX_QCr857x0qlOJ0RXY__RPQaZ9v_rzKK97LYhn8OxwYinlcgzv/pub?gid=1138403852&single=true&output=csv';
const URL_2026 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSEjT5_uCXqa-OuHuiQgUJaVLdSXX_QCr857x0qlOJ0RXY__RPQaZ9v_rzKK97LYhn8OxwYinlcgzv/pub?gid=477036082&single=true&output=csv';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const fetchOptions: RequestInit = {
      cache: forceRefresh ? 'no-store' : 'no-cache',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NextJS SwineFluDashboard/1.0',
      },
    };

    const [res2025, res2026] = await Promise.all([
      fetch(URL_2025, fetchOptions),
      fetch(URL_2026, fetchOptions),
    ]);

    if (!res2025.ok) {
      throw new Error(`Failed to fetch Line List 2025 CSV (${res2025.status} ${res2025.statusText})`);
    }

    if (!res2026.ok) {
      throw new Error(`Failed to fetch Line List 2026 CSV (${res2026.status} ${res2026.statusText})`);
    }

    const [csvText2025, csvText2026] = await Promise.all([
      res2025.text(),
      res2026.text(),
    ]);

    const records2025 = parseCSVData(csvText2025, 2025);
    const records2026 = parseCSVData(csvText2026, 2026);

    const combinedData = [...records2025, ...records2026];

    const responsePayload: SwineFluApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      records2025Count: records2025.length,
      records2026Count: records2026.length,
      totalRecords: combinedData.length,
      data: combinedData,
    };

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error fetching CSV data';
    console.error('API Error fetching Google Sheets CSV:', errorMessage);

    const errorPayload: SwineFluApiResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      records2025Count: 0,
      records2026Count: 0,
      totalRecords: 0,
      data: [],
      error: errorMessage,
    };

    return NextResponse.json(errorPayload, { status: 500 });
  }
}

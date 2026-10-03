/**
 * The eleven period bands, copied from `atlas/tools/codes.py` (BANDS).
 * `scripts/check-bands.mjs` compares this table with codes.py and fails if
 * they drift. Years are signed (BCE negative); start inclusive, end exclusive.
 */
export interface Band {
  code: string;
  label: string;
  start: number;
  end: number;
}

export const BANDS: Band[] = [
  {code: 'B01', label: 'before 8000 BCE', start: -10_000_000, end: -8000},
  {code: 'B02', label: '8000-4000 BCE', start: -8000, end: -4000},
  {code: 'B03', label: '4000-2000 BCE', start: -4000, end: -2000},
  {code: 'B04', label: '2000-1000 BCE', start: -2000, end: -1000},
  {code: 'B05', label: '1000 BCE-1 CE', start: -1000, end: 1},
  {code: 'B06', label: '1-500', start: 1, end: 500},
  {code: 'B07', label: '500-1000', start: 500, end: 1000},
  {code: 'B08', label: '1000-1400', start: 1000, end: 1400},
  {code: 'B09', label: '1400-1700', start: 1400, end: 1700},
  {code: 'B10', label: '1700-1900', start: 1700, end: 1900},
  {code: 'B11', label: '1900-now', start: 1900, end: 3000},
];

/** B01 is open-ended; the timeline draws it from this year so the band has a width. */
export const B01_DRAW_START = -12_000;
/** B11 is drawn to this year. */
export const B11_DRAW_END = 2030;

export function bandOf(year: number): Band {
  for (const b of BANDS) {
    if (year >= b.start && year < b.end) return b;
  }
  return BANDS[BANDS.length - 1];
}

export function bandByCode(code: string): Band {
  const b = BANDS.find(x => x.code === code);
  if (!b) throw new Error(`Unknown band ${code}`);
  return b;
}

/**
 * Position of a year on a strip where every band has equal width.
 * Returns 0..1. Inside a band the scale is linear, so a year's position is
 * compressed within its band (the lecture's "what we simplified" note).
 */
export function yearToUnit(year: number): number {
  const n = BANDS.length;
  for (let i = 0; i < n; i++) {
    const b = BANDS[i];
    const s = i === 0 ? B01_DRAW_START : b.start;
    const e = i === n - 1 ? B11_DRAW_END : b.end;
    if (year < s) return i / n;
    if (year < e) return (i + (year - s) / (e - s)) / n;
  }
  return 1;
}

/** A readable year label: "794", "1300s", "130 BCE". */
export function yearLabel(year: number): string {
  if (year < 0) return `${-year} BCE`;
  return `${year}`;
}

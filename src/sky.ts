/**
 * Intentionally static reference values copied from the approved visual spec.
 * This is not an astronomy calculation. Replace this adapter with a verified
 * ephemeris/API before presenting live sky data.
 */
export const DEMO_SKY = {
  date: '2026-10-25',
  location: 'SEOUL / KST',
  moonPhase: '차오르는 둥근달',
  illumination: '약 99%',
  nextFullMoonDate: '10.26',
  nextFullMoonYear: '2026',
  nextFullMoonTime: '13:11 KST · 시안 데모 값',
  sunSign: '전갈자리',
  currentSolarTerm: '상강',
  currentSolarTermDate: '2026년 10월 23일',
  nextSolarTerm: '입동',
  nextSolarTermDate: '2026년 11월 7일',
} as const

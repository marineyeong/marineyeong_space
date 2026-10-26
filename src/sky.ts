import { Body, Illumination, MoonPhase, SearchMoonPhase, SearchSunLongitude, SunPosition } from 'astronomy-engine'
import { DEFAULT_SKY_OPTIONS } from './sky-config.ts'
import type { SkyOptions, SkySnapshot, SolarTerm } from './types/sky.ts'
import reference from './data/solar-terms-kasi.json' with { type: 'json' }

const DAY = 86_400_000
const zodiac = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리']
const termDefinitions = [
  ['소한', 285], ['대한', 300], ['입춘', 315], ['우수', 330],
  ['경칩', 345], ['춘분', 0], ['청명', 15], ['곡우', 30],
  ['입하', 45], ['소만', 60], ['망종', 75], ['하지', 90],
  ['소서', 105], ['대서', 120], ['입추', 135], ['처서', 150],
  ['백로', 165], ['추분', 180], ['한로', 195], ['상강', 210],
  ['입동', 225], ['소설', 240], ['대설', 255], ['동지', 270],
] as const
const termCache = new Map<number, SolarTerm[]>()

export function moonPhaseName(angle: number): string {
  const phase = ((angle % 360) + 360) % 360
  if (phase < 5 || phase >= 355) return '신월'
  if (phase < 85) return '초승달'
  if (phase < 95) return '상현달'
  if (phase < 175) return '차오르는 둥근달'
  if (phase < 185) return '보름달'
  if (phase < 265) return '기우는 둥근달'
  if (phase < 275) return '하현달'
  return '그믐달'
}

export function sunSignName(longitude: number): string {
  return zodiac[Math.floor((((longitude % 360) + 360) % 360) / 30)]
}

/** Event instants, not fixed month/day boundaries. Cache one small table per year. */
export function getSolarTerms(year: number): SolarTerm[] {
  const cached = termCache.get(year)
  if (cached) return cached
  const terms = termDefinitions.map(([name, longitude], index) => {
    const month = Math.floor(index / 2)
    const startDay = index % 2 === 0 ? 1 : 15
    const start = new Date(Date.UTC(year, month, startDay))
    const event = SearchSunLongitude(longitude, start, 10)
    if (!event) throw new Error(`${year}년 ${name} 시각을 계산할 수 없습니다.`)
    return { name, longitude, at: event.date.toISOString(), source: 'calculated' as const, sourceUrl: 'https://github.com/cosinekitty/astronomy' }
  })
  termCache.set(year, terms)
  return terms
}

function effectiveSolarTerms(year: number): SolarTerm[] {
  const key = String(year) as keyof typeof reference.terms
  const terms = reference.terms[key]
  if (!terms) return getSolarTerms(year)
  return terms.map((term, index) => ({
    ...term, at: new Date(term.at).toISOString(), longitude: termDefinitions[index][1],
    source: 'kasi' as const, sourceUrl: reference.sources[key],
  }))
}

export function getCurrentSolarTerms(date: Date): { current: SolarTerm; next: SolarTerm } {
  const year = date.getUTCFullYear()
  let terms = effectiveSolarTerms(year)
  if (date.getTime() < Date.parse(terms[0].at)) terms = [...effectiveSolarTerms(year - 1), ...terms]
  if (date.getTime() >= Date.parse(terms[terms.length - 1].at)) terms = [...terms, ...effectiveSolarTerms(year + 1)]
  const nextIndex = terms.findIndex((term) => Date.parse(term.at) > date.getTime())
  if (nextIndex < 1) throw new Error('현재·다음 절기를 찾을 수 없습니다.')
  return { current: terms[nextIndex - 1], next: terms[nextIndex] }
}

function localParts(date: Date, timeZone: string): Record<string, string> {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
}

export function getSkySnapshot(date = new Date(), options: SkyOptions = DEFAULT_SKY_OPTIONS): SkySnapshot {
  if (!Number.isFinite(date.getTime())) throw new Error('유효한 기준 시각이 필요합니다.')
  const local = localParts(date, options.timeZone)
  const phaseAngle = MoonPhase(date)
  const fraction = Math.max(0, Math.min(1, Illumination(Body.Moon, date).phase_fraction))
  let full = SearchMoonPhase(180, new Date(date.getTime() + 1), 40)
  if (full && full.date.getTime() <= date.getTime()) full = SearchMoonPhase(180, new Date(date.getTime() + DAY), 40)
  if (!full) throw new Error('다음 보름달 시각을 계산할 수 없습니다.')
  const nextFull = localParts(full.date, options.timeZone)
  const terms = getCurrentSolarTerms(date)
  const termLabel = (term: SolarTerm) => {
    const parts = localParts(new Date(term.at), options.timeZone)
    return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`
  }
  return {
    calculatedAt: date.toISOString(),
    localDate: `${local.year}-${local.month}-${local.day}`,
    localTime: `${local.hour}:${local.minute}`,
    locationLabel: options.locationLabel,
    timeZone: options.timeZone,
    timeZoneLabel: options.timeZoneLabel,
    moon: { phase: moonPhaseName(phaseAngle), phaseAngle, fraction, illumination: `${(fraction * 100).toFixed(1)}%`, waxing: phaseAngle < 180 },
    nextFullMoon: { at: full.date.toISOString(), date: `${nextFull.month}.${nextFull.day}`, year: nextFull.year, time: `${nextFull.hour}:${nextFull.minute}` },
    sunSign: sunSignName(SunPosition(date).elon),
    currentTerm: { ...terms.current, label: termLabel(terms.current) },
    nextTerm: { ...terms.next, label: termLabel(terms.next) },
  }
}

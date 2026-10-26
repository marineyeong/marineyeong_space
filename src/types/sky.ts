export type SkyOptions = {
  locationLabel: string
  timeZone: string
  timeZoneLabel: string
}

export type SolarTerm = { name: string; longitude: number; at: string; source: 'kasi' | 'calculated'; sourceUrl: string }

export type SkySnapshot = {
  calculatedAt: string
  localDate: string
  localTime: string
  locationLabel: string
  timeZone: string
  timeZoneLabel: string
  moon: { phase: string; phaseAngle: number; fraction: number; illumination: string; waxing: boolean }
  nextFullMoon: { at: string; date: string; year: string; time: string }
  sunSign: string
  currentTerm: SolarTerm & { label: string }
  nextTerm: SolarTerm & { label: string }
}

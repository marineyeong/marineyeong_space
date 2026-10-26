import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SearchMoonPhase } from 'astronomy-engine'
import { getCurrentSolarTerms, getSkySnapshot, getSolarTerms, moonPhaseName, sunSignName } from '../src/sky.ts'

const usno = JSON.parse(readFileSync(new URL('./fixtures/usno-phases.json', import.meta.url), 'utf8')) as { phases: { phase: string; at: string }[] }
const kasi = JSON.parse(readFileSync(new URL('../src/data/solar-terms-kasi.json', import.meta.url), 'utf8')) as { terms: Record<string, { name: string; at: string }[]> }
const phases: Record<string, number> = { 'New Moon': 0, 'First Quarter': 90, 'Full Moon': 180, 'Last Quarter': 270 }

test('54 independent USNO phase events agree within two minutes', () => {
  for (const reference of usno.phases) {
    const target = Date.parse(reference.at)
    const calculated = SearchMoonPhase(phases[reference.phase], new Date(target - 86_400_000), 2)
    assert.ok(calculated, reference.at)
    assert.ok(Math.abs(calculated.date.getTime() - target) < 120_000, `${reference.phase} ${reference.at}`)
  }
})

test('calculated 2026–2027 solar events agree with all 48 KASI references within two minutes', () => {
  for (const year of [2026, 2027]) {
    const calculated = getSolarTerms(year)
    assert.equal(calculated.length, 24)
    kasi.terms[year].forEach((reference, index) => {
      assert.equal(calculated[index].name, reference.name)
      assert.ok(Math.abs(Date.parse(calculated[index].at) - Date.parse(reference.at)) < 120_000, `${year} ${reference.name}`)
    })
  }
})

test('published KASI boundaries take priority at the exact minute', () => {
  for (const reference of kasi.terms['2026']) {
    const event = Date.parse(reference.at)
    const before = getCurrentSolarTerms(new Date(event - 1))
    const after = getCurrentSolarTerms(new Date(event))
    assert.equal(before.next.name, reference.name)
    assert.equal(after.current.name, reference.name)
    assert.equal(after.current.source, 'kasi')
    assert.ok(Date.parse(after.next.at) > event)
  }
})

test('Seoul midnight uses Asia/Seoul regardless of host timezone', () => {
  assert.equal(getSkySnapshot(new Date('2026-10-25T14:59:59Z')).localDate, '2026-10-25')
  const after = getSkySnapshot(new Date('2026-10-25T15:00:00Z'))
  assert.equal(after.localDate, '2026-10-26')
  assert.equal(after.localTime, '00:00')
  assert.equal(after.timeZone, 'Asia/Seoul')
})

test('next full Moon advances after the event, including the year boundary', () => {
  const before = getSkySnapshot(new Date('2026-10-25T12:00:00Z'))
  assert.equal(before.nextFullMoon.date, '10.26')
  assert.equal(before.nextFullMoon.time, '13:12')
  const afterDate = new Date(Date.parse(before.nextFullMoon.at) + 1000)
  const after = getSkySnapshot(afterDate)
  assert.equal(after.nextFullMoon.date, '11.24')
  assert.ok(Date.parse(after.nextFullMoon.at) > afterDate.getTime())
  assert.equal(getSkySnapshot(new Date('2026-12-31T15:00:00Z')).nextFullMoon.year, '2027')
})

test('current and next term cross years and keep working beyond cached reference years', () => {
  const january = getSkySnapshot(new Date('2025-12-31T15:00:00Z'))
  assert.equal(january.localDate, '2026-01-01')
  assert.equal(january.currentTerm.name, '동지')
  assert.equal(january.nextTerm.name, '소한')
  const future = getSkySnapshot(new Date('2027-12-31T15:00:00Z'))
  assert.equal(future.currentTerm.name, '동지')
  assert.equal(future.nextTerm.name, '소한')
  assert.equal(future.nextTerm.source, 'calculated')
  assert.ok(future.nextTerm.at.startsWith('2028-'))
})

test('phase labels and tropical zodiac stay distinct and normalized', () => {
  assert.equal(moonPhaseName(0), '신월')
  assert.equal(moonPhaseName(90), '상현달')
  assert.equal(moonPhaseName(171), '차오르는 둥근달')
  assert.equal(moonPhaseName(180), '보름달')
  assert.equal(moonPhaseName(270), '하현달')
  assert.equal(moonPhaseName(320), '그믐달')
  assert.equal(sunSignName(0), '양자리')
  assert.equal(sunSignName(30), '황소자리')
  assert.equal(sunSignName(359), '물고기자리')
  const snapshot = getSkySnapshot(new Date('2026-10-26T12:00:00Z'))
  assert.equal(snapshot.sunSign, '전갈자리')
  assert.ok(snapshot.moon.fraction >= 0 && snapshot.moon.fraction <= 1)
  assert.equal(snapshot.moon.waxing, false)
})

test('invalid time or timezone fails instead of inventing current data', () => {
  assert.throws(() => getSkySnapshot(new Date('invalid')))
  assert.throws(() => getSkySnapshot(new Date(), { timeZone: 'Invalid/Zone', locationLabel: 'X', timeZoneLabel: 'X' }))
})

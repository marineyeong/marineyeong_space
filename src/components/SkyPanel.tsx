import { useSkySnapshot } from '../hooks/useSkySnapshot'
import { SKY_SOURCE_URL } from '../sky-config'
import MoonGraphic from './MoonGraphic'

export default function SkyPanel({ onClose }: { onClose: () => void }) {
  const { state, retry } = useSkySnapshot()
  return <>
    <div className="dialog-top"><div><span className="dialog-kicker">A NOTE FROM THE SKY</span><h2 id="dialog-title">Tonight's sky<span>.</span></h2></div><button className="close-button" onClick={onClose} aria-label="하늘 패널 닫기">×</button></div>
    {state.status === 'loading' && <div className="sky-status" role="status">지금의 달과 계절을 계산하고 있습니다.</div>}
    {state.status === 'error' && <div className="sky-status" role="alert"><p>지금은 하늘 정보를 계산하지 못했습니다.</p><button className="sky-retry" onClick={retry}>다시 불러오기</button></div>}
    {state.status === 'ready' && <>
      <div className="sky-date">{state.snapshot.localDate} <span>{state.snapshot.locationLabel} / {state.snapshot.timeZoneLabel}</span></div>
      <div className="sky-grid">
        <div className="sky-card moon-card"><span className="sky-label">MOON TONIGHT</span><MoonGraphic fraction={state.snapshot.moon.fraction} waxing={state.snapshot.moon.waxing} label={`${state.snapshot.moon.phase} · 조명률 ${state.snapshot.moon.illumination}`} /><strong>{state.snapshot.moon.phase}</strong><span className="sky-value">조명률 {state.snapshot.moon.illumination}</span></div>
        <div className="sky-card"><span className="sky-label">NEXT FULL MOON</span><strong className="sky-value">{state.snapshot.nextFullMoon.date} <small>{state.snapshot.nextFullMoon.year}</small></strong><span>{state.snapshot.nextFullMoon.time} {state.snapshot.timeZoneLabel} · 계산값</span></div>
        <div className="sky-card"><span className="sky-label">SUN SIGN</span><strong className="sky-value">{state.snapshot.sunSign}</strong><span>태양의 황도 별자리 · 서양 12궁</span></div>
        <div className="sky-card"><span className="sky-label">CURRENT SOLAR TERM</span><strong className="sky-value">{state.snapshot.currentTerm.name}</strong><span>{state.snapshot.currentTerm.label}</span></div>
        <div className="sky-card"><span className="sky-label">NEXT SOLAR TERM</span><strong className="sky-value">{state.snapshot.nextTerm.name}</strong><span>{state.snapshot.nextTerm.label}</span></div>
      </div>
      <div className="sky-footnote"><span className="sky-sources"><a href={SKY_SOURCE_URL} target="_blank" rel="noreferrer">천문 계산 ↗</a>{(state.snapshot.currentTerm.source === 'kasi' || state.snapshot.nextTerm.source === 'kasi') && <> · <a href={state.snapshot.currentTerm.source === 'kasi' ? state.snapshot.currentTerm.sourceUrl : state.snapshot.nextTerm.sourceUrl} target="_blank" rel="noreferrer">절기 KASI ↗</a></>}</span><span>기준 {state.snapshot.localTime} {state.snapshot.timeZoneLabel} · 1분 갱신</span></div>
    </>}
  </>
}

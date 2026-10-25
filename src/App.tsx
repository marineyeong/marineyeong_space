import { useCallback, useEffect, useRef, useState } from 'react'
import { articles, observations, type Article, type Chapter } from './content'
import { DEMO_SKY } from './sky'

const chapters: { id: Chapter; number: string; title: string; prompt: string; description: string }[] = [
  { id: 'observe', number: '01', title: 'Observe', prompt: 'What do you notice?', description: '익숙한 것들을 천천히 바라보며 작은 발견을 모읍니다.' },
  { id: 'connect', number: '02', title: 'Connect', prompt: 'How might it work?', description: '관찰과 생각을 연결해 화면과 경험으로 만듭니다.' },
  { id: 'reflect', number: '03', title: 'Reflect', prompt: 'What stays with you?', description: '만들고 지나온 일들에서 오래 남는 생각을 기록합니다.' },
]

function App() {
  const [chapter, setChapter] = useState<Chapter>('observe')
  const [selected, setSelected] = useState<string | null>(null)
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set())
  const [article, setArticle] = useState<Article | null>(null)
  const [moonOpen, setMoonOpen] = useState(false)
  const universeRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const active = chapters.find((item) => item.id === chapter)!
  const observation = observations.find((item) => item.id === selected)

  const changeChapter = useCallback((next: Chapter) => setChapter(next), [])
  const step = useCallback((direction: number) => {
    const index = chapters.findIndex((item) => item.id === chapter)
    const next = Math.max(0, Math.min(chapters.length - 1, index + direction))
    if (next !== index) changeChapter(chapters[next].id)
  }, [chapter, changeChapter])

  useEffect(() => {
    let lastChange = 0
    let accumulated = 0
    const node = universeRef.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(event.deltaY) < 18) return
      const now = Date.now()
      if (now - lastChange < 560) { event.preventDefault(); return }
      accumulated += event.deltaY
      if (Math.abs(accumulated) < 80) { event.preventDefault(); return }
      const direction = accumulated > 0 ? 1 : -1
      const index = chapters.findIndex((item) => item.id === chapter)
      if ((direction > 0 && index < 2) || (direction < 0 && index > 0)) {
        event.preventDefault(); step(direction); lastChange = now; accumulated = 0
      } else accumulated = 0
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [chapter, step])

  const openSky = (trigger: HTMLElement) => { returnFocus.current = trigger; setMoonOpen(true) }
  const closeSky = useCallback(() => { setMoonOpen(false); requestAnimationFrame(() => returnFocus.current?.focus()) }, [])
  const navigateToArticle = (entry: Article) => {
    const parent = chapters.find((item) => item.id !== 'observe' && articles[item.id].some((candidate) => candidate.id === entry.id))
    if (parent) setChapter(parent.id)
    setArticle(entry)
    window.history.pushState({ articleId: entry.id }, '', `?article=${encodeURIComponent(entry.id)}`)
    window.scrollTo(0, 0)
  }
  const returnToWorld = useCallback(() => { window.history.back() }, [])
  const isLayerOpen = moonOpen
  useEffect(() => {
    const findArticle = (id: string | null) => id ? Object.values(articles).flat().find((item) => item.id === id) ?? null : null
    const initialId = new URLSearchParams(window.location.search).get('article')
    const initialArticle = findArticle(initialId)
    if (initialArticle) {
      window.history.replaceState({ articleId: null }, '', window.location.pathname)
      window.history.pushState({ articleId: initialArticle.id }, '', `?article=${encodeURIComponent(initialArticle.id)}`)
      setArticle(initialArticle)
      const parent = chapters.find((item) => item.id !== 'observe' && articles[item.id].some((entry) => entry.id === initialArticle.id))
      if (parent) setChapter(parent.id)
    }
    const onPopState = () => {
      const next = findArticle(new URLSearchParams(window.location.search).get('article'))
      setArticle(next)
      if (next) {
        const parent = chapters.find((item) => item.id !== 'observe' && articles[item.id].some((entry) => entry.id === next.id))
        if (parent) setChapter(parent.id)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => {
    if (!isLayerOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isLayerOpen])
  useEffect(() => {
    if (!isLayerOpen) return
    const previous = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus())
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSky()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute('disabled'))
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); if (previous && !returnFocus.current) previous.focus() }
  }, [isLayerOpen, closeSky])

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const markDiscovered = (id: string) => setDiscovered((old) => new Set(old).add(id))

  useEffect(() => {
    document.title = article ? `${article.title} · my little world.` : "my little world."
  }, [article])

  if (article) return <main className="reader-page">
    <header className="topbar"><a className="brand" href="/" onClick={(event) => { event.preventDefault(); returnToWorld() }}>my little world<span>.</span></a><span className="top-note">A PERSONAL UNIVERSE</span></header>
    <button className="back-button reader-back" onClick={returnToWorld}>← BACK TO MY WORLD</button>
    <article className="reader-content reader-page-content"><div className="reader-category">{article.category} <span>· {article.date}</span></div><h1>{article.title}</h1><p className="reader-subtitle">{article.subtitle}</p><div className="reader-rule" />{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{article.quote && <blockquote>{article.quote}</blockquote>}<p className="reader-demo">DEMO ARTICLE · 실제 글이 아닌 레이아웃 확인용 샘플입니다.</p></article>
    <footer className="reader-page-footer">© MY LITTLE WORLD · 2026</footer>
  </main>

  return <main className="page-shell">
    <header className="topbar"><a className="brand" href="#top" onClick={(event) => { event.preventDefault(); setChapter('observe'); setSelected(null) }}>my little world<span>.</span></a><span className="top-note">A PERSONAL UNIVERSE</span></header>
    <section className="layout" id="top">
      <section className="intro" aria-labelledby="intro-title">
        <div className="eyebrow"><i /> AN ONGOING COLLECTION / 001</div>
        <h1 id="intro-title">A world<br />made of<br />little things<span>.</span></h1>
        <p className="intro-copy">익숙한 것에서 새로운 질문을 찾고,<br />생각과 경험을 연결하고,<br />그 흔적을 나의 우주에 남깁니다.</p>
        <div className="intro-foot"><span>NOTICING · MAKING · REFLECTING</span><span>SEOUL, KR</span></div>
      </section>

      <section className="universe" ref={universeRef} tabIndex={0} aria-label="우주 탐색 영역. 방향키 또는 스크롤로 챕터를 바꿀 수 있습니다."
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); step(1) } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); step(-1) } }}
        onTouchStart={(e) => { const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY } }}
        onTouchEnd={(e) => { if (!touchStart.current) return; const t = e.changedTouches[0]; const dx = t.clientX - touchStart.current.x, dy = t.clientY - touchStart.current.y; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1); touchStart.current = null }}>
        <div className={`cosmos chapter-${chapter}`}>
          <div className="axis axis-one" /><div className="axis axis-two" />
          <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" /><div className="orbit orbit-d" />
          <span className="starfield star-one" /><span className="starfield star-two" /><span className="starfield star-three" /><span className="starfield star-four" />
          <div className="core"><span>my</span><span>little</span><span>world.</span><i /></div>
          {chapters.map((item, index) => <button key={item.id} className={`planet planet-${index + 1} ${chapter === item.id ? 'is-active' : ''}`} onClick={() => changeChapter(item.id)} aria-label={`${item.number} ${item.title} 챕터 선택`} aria-pressed={chapter === item.id}><span className="planet-dot" /><span className="planet-label"><small>{item.number}</small> {item.title}</span></button>)}
          <button className="moon-button" aria-label="Tonight's sky 열기" onClick={(e) => openSky(e.currentTarget)}><span className="moon-shape" /><span className="moon-caption">TONIGHT'S SKY</span></button>
        </div>
        <span className="universe-hint">A SMALL UNIVERSE, STILL IN MOTION</span>
      </section>

      <section className="chapter-panel" aria-live="polite">
        <nav className="chapter-tabs" aria-label="챕터 선택">{chapters.map((item) => <button key={item.id} onClick={() => changeChapter(item.id)} className={chapter === item.id ? 'selected' : ''} aria-current={chapter === item.id ? 'page' : undefined}><span>{item.number}</span> {item.title}</button>)}</nav>
        <div className="chapter-heading"><div className="chapter-meta">CHAPTER {active.number} / 03 <span className="meta-line" /></div><h2>{active.title}<span>.</span></h2><p>{active.description}</p><p className="chapter-question">“{active.prompt}”</p></div>
        <div className="content-area" key={chapter}>
          {chapter === 'observe' && <div className="observe-content">
            <div className="section-label">DISCOVERY ORBIT <span>{String(discovered.size).padStart(2, '0')} / 04</span></div>
            <div className="discovery-orbit" aria-label="발견 별 선택">{observations.map((item, i) => <button key={item.id} onClick={() => { setSelected(item.id); markDiscovered(item.id) }} className={`discovery-star star-${i + 1} ${selected === item.id ? 'chosen' : ''} ${discovered.has(item.id) ? 'found' : ''}`} aria-label={`${item.title} 발견`} aria-pressed={selected === item.id}><span /></button>)}<span className="orbit-core-label">4 SMALL<br />DISCOVERIES</span></div>
            {observation ? <article className="observation-note" aria-live="polite"><div className="observation-category">{observation.category}</div><h3>{observation.title}</h3><p>{observation.text}</p><span className="observation-tag">{observation.tag}</span></article> : <div className="empty-note"><span className="tiny-star">✳</span><p>별 하나를 선택해<br />작은 발견을 열어보세요.</p></div>}
            {discovered.size === 4 && <p className="complete-note" role="status">ALL FOUR STARS FOUND · CONSTELLATION COMPLETE</p>}
            <p className="demo-label">SAMPLE CONTENT · 실제 기록으로 교체할 수 있습니다.</p>
          </div>}
          {chapter !== 'observe' && <div className="article-list"><div className="section-label">{chapter === 'connect' ? 'SELECTED WORKS & EXPERIMENTS' : 'NOTES & REFLECTIONS'} <span>02 ENTRIES</span></div>{articles[chapter].map((item, i) => <button className="article-row" key={item.id} onClick={() => navigateToArticle(item)}><span className="article-index">0{i + 1}</span><span className="article-title-wrap"><strong>{item.title}</strong><small>{item.category} · {item.date}</small></span><span className="article-arrow" aria-hidden="true">↗</span></button>)}<p className="demo-label">DEMO ARTICLES · 개인 원고 및 프로젝트 정보가 확정되면 교체됩니다.</p></div>}
        </div>
        <footer className="panel-footer"><span>© MY LITTLE WORLD · 2026</span><span>SCROLL OVER THE UNIVERSE<br />TO CHANGE CHAPTER <b>↕</b></span></footer>
      </section>
    </section>
    {isLayerOpen && <div className="layer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeSky() }}>
      <div className={`dialog ${moonOpen ? 'sky-dialog' : 'reader-dialog'}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef}>
        {moonOpen && <><div className="dialog-top"><div><span className="dialog-kicker">A NOTE FROM THE SKY</span><h2 id="dialog-title">Tonight's sky<span>.</span></h2></div><button className="close-button" onClick={closeSky} aria-label="하늘 패널 닫기">×</button></div>
          <div className="sky-date">{DEMO_SKY.date} <span>{DEMO_SKY.location}</span></div>
          <div className="sky-grid"><div className="sky-card moon-card"><span className="sky-label">MOON TONIGHT · DEMO</span><div className="large-moon" /><strong>{DEMO_SKY.moonPhase}</strong><span className="sky-value">조명률 {DEMO_SKY.illumination}</span></div>
            <div className="sky-card"><span className="sky-label">NEXT FULL MOON</span><strong className="sky-value">{DEMO_SKY.nextFullMoonDate} <small>{DEMO_SKY.nextFullMoonYear}</small></strong><span>{DEMO_SKY.nextFullMoonTime}</span></div>
            <div className="sky-card"><span className="sky-label">SUN SIGN</span><strong className="sky-value">{DEMO_SKY.sunSign}</strong><span>태양의 황도 별자리</span></div>
            <div className="sky-card"><span className="sky-label">CURRENT SOLAR TERM</span><strong className="sky-value">{DEMO_SKY.currentSolarTerm}</strong><span>{DEMO_SKY.currentSolarTermDate}</span></div>
            <div className="sky-card"><span className="sky-label">NEXT SOLAR TERM</span><strong className="sky-value">{DEMO_SKY.nextSolarTerm}</strong><span>{DEMO_SKY.nextSolarTermDate}</span></div></div>
          <div className="sky-footnote">DEMO DATA · {DEMO_SKY.date} <span>천문 데이터 자동 갱신 연동 전의 시안 값입니다.</span></div>
        </>}
      </div>
    </div>}
  </main>
}

export default App

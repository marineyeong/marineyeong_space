type SiteHeaderProps = {
  onHome: () => void
}

export default function SiteHeader({ onHome }: SiteHeaderProps) {
  return <header className="topbar">
    <a className="brand" href="./" onClick={(event) => { event.preventDefault(); onHome() }}>my little world<span>.</span></a>
    <span className="top-note">A PERSONAL UNIVERSE</span>
  </header>
}

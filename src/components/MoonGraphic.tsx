import { useId } from 'react'

/** The terminator is an ellipse whose width follows the illuminated fraction. */
export default function MoonGraphic({ fraction, waxing, label }: { fraction: number; waxing: boolean; label: string }) {
  const id = useId().replace(/:/g, '')
  const value = Math.max(0, Math.min(1, fraction))
  const radius = Math.abs(1 - 2 * value) * 45
  const terminator = radius < 0.001 ? 'L50 5' : `A${radius} 45 0 0 ${value > 0.5 ? 1 : 0} 50 5`
  const path = `M50 5 A45 45 0 0 1 50 95 ${terminator}Z`
  return <svg className="large-moon" viewBox="0 0 100 100" role="img" aria-label={label}>
    <defs>
      <radialGradient id={`${id}-surface`} cx="35%" cy="30%" r="75%"><stop stopColor="#f0f1fb" /><stop offset="0.7" stopColor="#c5cada" /><stop offset="1" stopColor="#838ba5" /></radialGradient>
      <clipPath id={`${id}-lit`}><path d={path} /></clipPath>
    </defs>
    <circle cx="50" cy="50" r="45" fill="#292c49" stroke="#c7c9df25" />
    <g transform={waxing ? undefined : 'translate(100 0) scale(-1 1)'}>
      <g clipPath={`url(#${id}-lit)`}>
        <circle cx="50" cy="50" r="45" fill={`url(#${id}-surface)`} />
        <circle cx="32" cy="35" r="5" fill="#747c9840" /><circle cx="66" cy="62" r="8" fill="#747c984d" /><circle cx="40" cy="70" r="4" fill="#747c9838" />
      </g>
    </g>
  </svg>
}

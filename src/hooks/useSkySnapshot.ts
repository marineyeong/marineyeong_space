import { useEffect, useState } from 'react'
import type { SkySnapshot } from '../types/sky'

type SkyState = { status: 'loading' } | { status: 'ready'; snapshot: SkySnapshot } | { status: 'error' }

export function useSkySnapshot() {
  const [state, setState] = useState<SkyState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let disposed = false
    setState({ status: 'loading' })
    const refresh = async () => {
      try {
        const { getSkySnapshot } = await import('../sky')
        if (!disposed) setState({ status: 'ready', snapshot: getSkySnapshot(new Date()) })
      } catch {
        if (!disposed) setState({ status: 'error' })
      }
    }
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    void refresh()
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh() }, 60_000)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      disposed = true
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [attempt])
  return { state, retry: () => setAttempt((value) => value + 1) }
}

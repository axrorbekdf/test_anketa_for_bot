import { useState, useEffect } from 'react'

const BASE = ''
let _cache = null

export function useNedInfo() {
  const [info, setInfo] = useState(_cache)
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) return
    fetch(`${BASE}/api/new-anketa/ned-info`, { headers: { 'Accept': 'application/json' } })
      .then(r => {
        if (!r.ok) throw new Error(`ned-info: ${r.status}`)
        return r.json()
      })
      .then(d => { _cache = d; setInfo(d); setLoading(false); console.log('nedInfo:', d) })
      .catch(e => { console.error('nedInfo xatosi:', e); setLoading(false) })
  }, [])

  return { info, loading }
}

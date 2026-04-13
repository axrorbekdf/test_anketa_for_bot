import { useState, useEffect } from 'react'

const BASE = ''
let _cache = null

export function useNedInfo() {
  const [info, setInfo] = useState(_cache)
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) return
    fetch(`${BASE}/api/new-anketa/ned-info`)
      .then(r => r.json())
      .then(d => { _cache = d; setInfo(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { info, loading }
}

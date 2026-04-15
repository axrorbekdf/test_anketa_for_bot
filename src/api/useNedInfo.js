import { useState, useEffect } from 'react'

const BASE = 'http://10.100.104.120:8008'
let _cache = null

export function useNedInfo() {
  const [info, setInfo] = useState(_cache)
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) return
    fetch(`${BASE}/api/new-anketa/ned-info`)
      .then(r => r.json())
      .then(d => { _cache = d; setInfo(d); setLoading(false); console.log('nedInfo:', d) })
      .catch(() => setLoading(false))
  }, [])

  return { info, loading }
}

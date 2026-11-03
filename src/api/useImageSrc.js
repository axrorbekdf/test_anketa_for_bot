import { useState, useEffect } from 'react'
import { BASE, HEADERS } from './api'

// MinIO URL'i ichki tarmoqda (http://192.168...:9000/caslfit/anketa-files/...),
// shuning uchun rasmni backend proxy'si orqali olamiz. <img> ngrok header'ini
// yubora olmagani uchun fetch qilib, blob URL ko'rsatamiz.
export function useImageSrc(url) {
  const [src, setSrc] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    if (!url) { setSrc(null); return }

    const i = url.indexOf('anketa-files/')
    if (i === -1) { setSrc(url); return }

    let objectUrl = null
    let cancelled = false
    setSrc(null)
    fetch(`${BASE}/api/anketa-web-app/image/${url.slice(i)}`, { headers: HEADERS })
      .then(r => {
        if (!r.ok) throw new Error(`image: ${r.status}`)
        return r.blob()
      })
      .then(b => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(b)
        setSrc(objectUrl)
      })
      .catch(() => { if (!cancelled) setFailed(true) })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  return { src, failed }
}

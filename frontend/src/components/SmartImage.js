import { useState } from 'react'

export default function SmartImage({ localPath, fallback, alt = '', className = '', style = {} }){
  const [src, setSrc] = useState(localPath || fallback)

  return (
    // onError fallback to remote
    <img src={src} alt={alt} className={className} style={style} onError={() => {
      if (src !== fallback) setSrc(fallback)
    }} />
  )
}

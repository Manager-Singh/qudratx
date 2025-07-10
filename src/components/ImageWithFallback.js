// src/components/common/ImageWithFallback.js
import img from '../assets/common/imgPlaceholder.jpg'
import React from 'react'

function ImageWithFallback({ src, alt = '', fallback ='../assets/common/imgPlaceholder.jpg', style = {}, ...props }) {
  const handleError = (e) => {
    e.target.onerror = null
    e.target.src = fallback
  }

  return <img src={src} alt={alt} onError={handleError} style={style} {...props} />
}

export default ImageWithFallback

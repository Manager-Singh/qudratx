// src/utils/ToastProvider.js
import React, { createContext, useContext, useState, useCallback } from 'react'
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react'

const ToastContext = createContext()
export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((title, message, color = 'primary') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, message, color }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CToaster placement="top-end" className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <CToast key={toast.id} color={toast.color} autohide delay={3000}>
            <CToastHeader closeButton>{toast.title}</CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  )
}

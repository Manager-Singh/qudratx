import React from 'react'
import { CToast, CToastBody, CToastHeader } from '@coreui/react'

export const ToastExample = ({ status = 'success', message = '' }) => {
    const getColor = () => {
    if (status === 'success') return '#28a745'; 
    if (status === 'error') return '#dc3545';   
    // if (status === 'warning') return '#6c757d'; 
    if (status === 'warning') return '#fd7e14'
    return '#6c757d';
  };

  const getTitle = () => {
    if (status === 'success') return 'Success'; 
    if (status === 'error') return 'Error';   
    if (status === 'warning') return 'Warning'; 
    return ''
  }

  return (
    <CToast animation={false} autohide={false} visible={true} style={{ backgroundColor: getColor(), color: '#fff' }} >
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={getColor()}></rect>
        </svg>
        <div className="fw-bold me-auto">{getTitle()}</div>
        {/* <small>Just now</small> */}
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  )
}

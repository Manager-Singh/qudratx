import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  
  CFormInput,
  CFormLabel,
  
} from '@coreui/react'

function Benefits({benefits,setBenefits,otherBenefits,setOtherBenefits}) {
    
const handleListChange = (index, value, setter) => {
  setter((prev) =>
    prev.map((item, i) => (i === index ? { ...item, name: value } : item))
  )
}

const addToList = (setter) => {
  setter((prev) => [...prev, { name: '' }])
}

const removeFromList = (index, setter) => {
  setter((prev) => prev.filter((_, i) => i !== index))
}

  return (
   <>
  <h4>Benefits</h4>
  <CRow className="fw-bold mb-2">
    <CCol md={8}><CFormLabel>Benefit</CFormLabel></CCol>
    <CCol md={1}><CFormLabel>Action</CFormLabel></CCol>
  </CRow>

  {benefits.map((item, index) => (
    <CRow key={index} className="mb-2">
      <CCol md={8}>
        <CFormInput
          value={item.name}
          onChange={(e) => handleListChange(index, e.target.value, setBenefits)}
          placeholder="Enter benefit"
        />
      </CCol>
      <CCol md={1}>
        {benefits.length > 1 && (
          <CButton color="danger" size="sm" onClick={() => removeFromList(index, setBenefits)}>✕</CButton>
        )}
      </CCol>
    </CRow>
  ))}

  <CButton color="info" onClick={() => addToList(setBenefits)}>Add Benefit</CButton>
  <div className='mt-3'>
    <h4>Other Benefits</h4>
  <CRow className="fw-bold mb-2">
    <CCol md={8}><CFormLabel>Other Benefit</CFormLabel></CCol>
    <CCol md={1}><CFormLabel>Action</CFormLabel></CCol>
  </CRow>

  {otherBenefits.map((item, index) => (
    <CRow key={index} className="mb-2">
      <CCol md={8}>
        <CFormInput
          value={item.name}
          onChange={(e) => handleListChange(index, e.target.value, setOtherBenefits)}
          placeholder="Enter other benefit"
        />
      </CCol>
      <CCol md={1}>
        {otherBenefits.length > 1 && (
          <CButton color="danger" size="sm" onClick={() => removeFromList(index, setOtherBenefits)}>✕</CButton>
        )}
      </CCol>
    </CRow>
  ))}

  <CButton color="info" onClick={() => addToList(setOtherBenefits)}>Add Other Benefit</CButton>
  </div>
</>

  )
}

export default Benefits
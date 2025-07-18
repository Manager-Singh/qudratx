import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  
  CFormInput,
  CFormLabel,
  
} from '@coreui/react'

function RequiredDocument({requiredDocuments,setRequiredDocuments}) {
   
    const handleRequiredDocChange = (index, value) => {
  setRequiredDocuments((prev) =>
    prev.map((item, i) => (i === index ? { ...item, name: value } : item))
  )
}

const addRequiredDocument = () => {
  setRequiredDocuments((prev) => [...prev, { name: '' }])
}

const removeRequiredDocument = (index) => {
  setRequiredDocuments((prev) => prev.filter((_, i) => i !== index))
}
  return (
   <>
  <h4>Required Documents</h4>

  <CRow className="align-items-center mb-2 fw-bold">
    <CCol md={8}>
      <CFormLabel className="mb-0">Document Name</CFormLabel>
    </CCol>
    <CCol md={1}>
      <CFormLabel className="mb-0">Action</CFormLabel>
    </CCol>
  </CRow>

  {requiredDocuments.map((doc, index) => (
    <CRow key={index} className="align-items-center mb-2">
      <CCol md={8}>
        <CFormInput
          type="text"
          placeholder="Enter document name"
          value={doc.name}
          onChange={(e) => handleRequiredDocChange(index, e.target.value)}
        />
      </CCol>

      <CCol md={1}>
        {requiredDocuments.length > 1 && (
          <CButton
            color="danger"
            size="sm"
            onClick={() => removeRequiredDocument(index)}
          >
            ✕
          </CButton>
        )}
      </CCol>
    </CRow>
  ))}

  <CRow className="mt-3">
    <CCol md={6}>
      <CButton color="info" onClick={addRequiredDocument}>
        Add Document
      </CButton>
    </CCol>
  </CRow>
</>

  )
}

export default RequiredDocument
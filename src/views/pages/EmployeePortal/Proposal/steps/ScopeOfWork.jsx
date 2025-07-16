import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  
  CFormInput,
  CFormLabel,
  
} from '@coreui/react'
function ScopeOfWork() {
    const [scopeOfWork, setScopeOfWork] = useState([
  { name: 'Consultancy on Company Incorporation Procedures FZCS' },
  { name: 'Legalization and Initial Approval from Department of Economic Development, Dubai' },
  { name: 'Municipality if required FZCS' },
  { name: 'Virtual Office if Required FZCS' },
  { name: 'Preparing Local Service Agent Agreement or MOA FZCS' },
  { name: 'Court Notarization of Local Service Agent Agreement FZCS' },
  { name: 'Documentation, Legalization and Submission of Final Approval Application to Department of Economic Development FZCS' },
  { name: 'Follow-up and Collection of Trade License from Department of Economic Development FZCS' },
  { name: 'Update Trade License with Department of Economic Development FZCS' },
  { name: 'Documentation, Legalization and Registration of company with Ministry of Immigration (DNDR) FZCS' },
  { name: 'Documentation, Legalization and Registration of company with Ministry of Labor (MOL) FZCS' },
  { name: 'Introduction to Banker for opening Bank Account FZCS' },
  { name: 'Family sponsor process FZCS' },
])

const handleScopeChange = (index, value) => {
  setScopeOfWork((prev) =>
    prev.map((item, i) => (i === index ? { ...item, name: value } : item))
  )
}

const addScopeOfWork = () => {
  setScopeOfWork((prev) => [...prev, { name: '' }])
}

const removeScopeOfWork = (index) => {
  setScopeOfWork((prev) => prev.filter((_, i) => i !== index))
}

  return (
  <>
  <h4>Scope of Work</h4>

  <CRow className="fw-bold mb-2">
    <CCol md={8}><CFormLabel>Scope Item</CFormLabel></CCol>
    <CCol md={2}><CFormLabel>Action</CFormLabel></CCol>
  </CRow>

  {scopeOfWork.map((item, index) => (
    <CRow key={index} className="mb-2">
      <CCol md={8}>
        <CFormInput
          type="text"
          placeholder="Enter scope of work item"
          value={item.name}
          onChange={(e) => handleScopeChange(index, e.target.value)}
        />
      </CCol>
      <CCol md={2}>
        {scopeOfWork.length > 1 && (
          <CButton color="danger" size="sm" onClick={() => removeScopeOfWork(index)}>
            ✕
          </CButton>
        )}
      </CCol>
    </CRow>
  ))}

  <CButton color="info" onClick={addScopeOfWork}>Add Scope</CButton>
</>

  )
}

export default ScopeOfWork
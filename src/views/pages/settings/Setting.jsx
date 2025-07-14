
import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CImage,
  CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Setting = () => {
  const navigate = useNavigate()

  // 🔹 Dummy data
  const settings = {
    name: 'TechNova Solutions Pvt Ltd',
    description:
      'TechNova is a leading software company providing CRM, ERP, and AI-powered solutions to clients worldwide. Our mission is to simplify business operations.',
    logo: 'https://via.placeholder.com/150x100.png?text=Company+Logo',
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Company Settings</h5>
        <CButton color="primary" onClick={() => navigate('/setting/edit')}>
          Edit
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CRow className="mb-4">
          <CCol md={3}>
            <h6>Logo</h6>
            <CImage
              src={settings.logo}
              alt="Company Logo"
              height={100}
              className="border rounded"
            />
          </CCol>
          <CCol md={9}>
            <h6>Company Name</h6>
            <p>{settings.name}</p>

            <h6>Description</h6>
            <p>{settings.description}</p>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default Setting

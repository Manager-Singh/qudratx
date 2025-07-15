import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
} from '@coreui/react'

const Setting = () => {
  const [form, setForm] = useState({
    name: 'TechNova Solutions Pvt Ltd',
    description:
      'TechNova is a leading software company providing CRM, ERP, and AI-powered solutions to clients worldwide.',
    logo:'',
    email:'demo@gmail.com',
    icon:'',
  })
  const [logoPreview, setLogoPreview] = useState('')
  const [iconPreview, setIconPreview] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    if (type === 'logo') {
      setForm((prev) => ({ ...prev, logo: file }))
      setLogoPreview(URL.createObjectURL(file))
    }

    if (type === 'icon') {
      setForm((prev) => ({ ...prev, icon: file }))
      setIconPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
  }

  return (
    <div className='container'>
      <CRow>
      {/* Form */}
      <CCol md={12}>
        <CCard>
          <CCardHeader>
            <strong>Edit Company Info</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Company Name</CFormLabel>
              <CFormInput
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <CFormLabel>Company Email</CFormLabel>
              <CFormInput
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <CFormLabel className="mt-3">Description</CFormLabel>
              <CFormTextarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />

              <CFormLabel className="mt-3">Company Logo</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              <div className='my-2'>
                {logoPreview && (
                  <CImage src={logoPreview} height={100} className="border rounded" />
                ) }
              </div>

              <CFormLabel className="mt-3">Company Icon</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'icon')}
              />
              <div className='my-2'>
                 {iconPreview && (
                  <CImage src={iconPreview} height={80} width={80} className="border rounded" />
                ) }
              </div>
             

              <CButton type="submit" className="mt-3 custom-button">
                Update 
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

    
    
    </CRow>
    </div>
    
  )
}

export default Setting



import React, { useEffect, useState } from 'react'
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
} from '@coreui/react'
import axios from 'axios'

const UpdateSetting = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: '',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      setForm(res.data)
      if (res.data.logo) {
        setPreviewUrl(`/uploads/${res.data.logo}`) // adjust if full URL is sent
      }
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    if (logoFile) {
      formData.append('logo', logoFile)
    }

  }

  return (
    <CCard>
      <CCardHeader>
        <h5>Company Settings</h5>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="name">Company Name</CFormLabel>
              <CFormInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="logo">Company Logo</CFormLabel>
              <CFormInput
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  height={80}
                  className="mt-2 border rounded"
                />
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          <CButton type="submit" color="primary">
            Update
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default UpdateSetting

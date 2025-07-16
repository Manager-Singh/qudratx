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
import axios from 'axios'
import { postDataWithImage } from '../../../utils/api'

const Setting = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    description: '',
    logo: '',
    icon: '',
    phone: '',
    address: [
      {
        type: '',
        line1: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
      },
    ],
    terms_and_conditions: '',
    bank_details: {
      bank_title: '',
      account_number: '',
      iban_number: '',
      bank: '',
      branch: '',
      swift_code: '',
    },
  })

  const [logoPreview, setLogoPreview] = useState('')
  const [iconPreview, setIconPreview] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const previewURL = URL.createObjectURL(file)

    if (type === 'logo') {
      setForm((prev) => ({ ...prev, logo: file }))
      setLogoPreview(previewURL)
    }

    if (type === 'icon') {
      setForm((prev) => ({ ...prev, icon: file }))
      setIconPreview(previewURL)
    }
  }

  const handleAddressChange = (e, index, field) => {
    const updated = [...form.address]
    updated[index][field] = e.target.value
    setForm({ ...form, address: updated })
  }

  const handleBankChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, bank_details: { ...form.bank_details, [name]: value } })
  }

 const handleSubmit = (e) => {
  e.preventDefault()
  const payload = { ...form }

  const formData = new FormData()
  for (const key in payload) {
    if (key === 'logo' || key === 'icon') {
      if (payload[key] instanceof File) {
        formData.append(key, payload[key])
      } else {
        formData.append(key, '') // You may omit this if not needed
      }
    } else {
      formData.append(key, JSON.stringify(payload[key]))
    }
  }
for (let [key, value] of formData.entries()) {
  console.log(key, value)
}
    postDataWithImage('/admin/web-setting-info', formData)
    .then((res) => {
      console.log(res.data, "response data")
      setForm(res.data)
    })
    .catch((err) => {
      console.error('Update failed:', err)
      alert('Update failed')
    })
}

  return (
    <div className="container">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <strong>Edit Company Info</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CFormLabel>Company Name</CFormLabel>
                <CFormInput name="name" value={form.name} onChange={handleChange} />

                <CFormLabel>Company Email</CFormLabel>
                <CFormInput name="email" value={form.email} onChange={handleChange} />

                <CFormLabel className="mt-3">Phone</CFormLabel>
                <CFormInput name="phone" value={form.phone} onChange={handleChange} />

                <CFormLabel className="mt-3">Description</CFormLabel>
                <CFormTextarea name="description" rows={4} value={form.description} onChange={handleChange} />

                <CFormLabel className="mt-3">Company Logo</CFormLabel>
                <CFormInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                {logoPreview && <CImage src={logoPreview} height={100} className="my-2 border rounded" />}

                <CFormLabel className="mt-3">Company Icon</CFormLabel>
                <CFormInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} />
                {iconPreview && <CImage src={iconPreview} height={80} width={80} className="my-2 border rounded" />}

                <CFormLabel className="mt-4">Address</CFormLabel>
                {form.address.map((addr, idx) => (
                  <div key={idx} className="border p-3 mb-2 rounded">
                    <CFormLabel>Type</CFormLabel>
                    <CFormInput value={addr.type} onChange={(e) => handleAddressChange(e, idx, 'type')} />

                    <CFormLabel>Line 1</CFormLabel>
                    <CFormInput value={addr.line1} onChange={(e) => handleAddressChange(e, idx, 'line1')} />

                    <CFormLabel>City</CFormLabel>
                    <CFormInput value={addr.city} onChange={(e) => handleAddressChange(e, idx, 'city')} />

                    <CFormLabel>State</CFormLabel>
                    <CFormInput value={addr.state} onChange={(e) => handleAddressChange(e, idx, 'state')} />

                    <CFormLabel>Country</CFormLabel>
                    <CFormInput value={addr.country} onChange={(e) => handleAddressChange(e, idx, 'country')} />

                    <CFormLabel>Postal Code</CFormLabel>
                    <CFormInput value={addr.postal_code} onChange={(e) => handleAddressChange(e, idx, 'postal_code')} />
                  </div>
                ))}

                <CFormLabel className="mt-4">Terms and Conditions</CFormLabel>
                <CFormTextarea name="terms_and_conditions" rows={4} value={form.terms_and_conditions} onChange={handleChange} />

                <CFormLabel className="mt-4">Bank Details</CFormLabel>
                {['bank_title', 'account_number', 'iban_number', 'bank', 'branch', 'swift_code'].map((field) => (
                  <div key={field}>
                    <CFormLabel className="text-capitalize">{field.replace(/_/g, ' ')}</CFormLabel>
                    <CFormInput name={field} value={form.bank_details[field]} onChange={handleBankChange} />
                  </div>
                ))}

                <CButton type="submit" className="mt-4">
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

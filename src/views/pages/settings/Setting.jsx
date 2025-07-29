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
  CImage,
} from '@coreui/react'
import axios from 'axios'
import { getData, postDataWithImage } from '../../../utils/api'
import { ToastExample } from '../../../components/toast/Toast'
// Get image path
 const imageUrl = import.meta.env.VITE_IMAGE_URL;


const Setting = () => {
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
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


useEffect(() => {
  async function fetchData() {
    try {
      const res = await getData('/admin/web-setting-info')
      console.log(res, "res")

      if (res?.data) {
        const data = res.data

        // Set form state with fetched data
        setForm({
          name: data.name || '',
          email: data.email?.replace(/^"|"$/g, '') || '',
          description: data.description || '',
          logo: data.logo || '',
          icon: data.icon || '',
          phone: data.phone || '',
          address: data.address?.length ? data.address : [{
            type: '',
            line1: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
          }],
          terms_and_conditions: data.terms_and_conditions || '',
          bank_details: {
            bank_title: data.bank_details?.bank_title || '',
            account_number: data.bank_details?.account_number || '',
            iban_number: data.bank_details?.iban_number || '',
            bank: data.bank_details?.bank || '',
            branch: data.bank_details?.branch || '',
            swift_code: data.bank_details?.swift_code || '',
          },
        })

        // Set preview if logo/icon exists (if it's a URL)
        if (data.logo) setLogoPreview(data.logo)
        if (data.icon) setIconPreview(data.icon)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  fetchData()
}, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 
  // handle image preview if user choose new images
  const handleFileChange = (e, type) => {
  const file = e.target.files[0]
  if (!file) return

  const previewURL = URL.createObjectURL(file)

  if (type === 'logo') {
    if (logoPreview && logoPreview.startsWith('blob')) URL.revokeObjectURL(logoPreview)
    setForm((prev) => ({ ...prev, logo: file }))
    setLogoPreview(previewURL)
  }

  if (type === 'icon') {
    if (iconPreview && iconPreview.startsWith('blob')) URL.revokeObjectURL(iconPreview)
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
  
  const showToast = (status, message) => {
  setToastData({ show: true, status, message })
  setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
}
 const handleSubmit = (e) => {
  e.preventDefault()
  const payload = { ...form }

  const formData = new FormData()

  for (const key in payload) {
    if (key === 'logo' || key === 'icon') {
      if (payload[key] instanceof File) {
        formData.append(key, payload[key]);
      }
    } else if (typeof payload[key] === 'object') {
      formData.append(key, JSON.stringify(payload[key])); // only objects are stringified
    } else {
      formData.append(key, payload[key]); // keep plain strings untouched
    }
  }

   formData.forEach(d=>{
    console.log("d->",d);
  })


    // postDataWithImage('/admin/web-setting-info', formData)
    // .then((res) => {
    //   console.log(res.data, "response data")
    //   setForm(res.data)
    // })
    // .catch((err) => {
    //   console.error('Update failed:', err)
    //   alert('Update failed')
    // })   
    postDataWithImage('/admin/web-setting-info', formData)
    .then((res) => {
      setForm(res.data)
      showToast('success', 'Settings updated successfully!')
    })
    .catch((err) => {
      console.error('Update failed:', err)
      showToast('error', err.message || 'Update failed')
    })

}


  return (
    <div className="container">
      {toastData.show && (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        <ToastExample status={toastData.status} message={toastData.message} />
      </div>
    )}
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <strong>Company Info</strong>
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

                <div className="mb-4">
                <CFormLabel className="mt-3">Company Logo</CFormLabel>
                <CFormInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                {logoPreview && (
                  <CImage
                    src={logoPreview.startsWith('blob') ? logoPreview : `${imageUrl}${logoPreview}`}
                    height={100}
                    className="my-2 border rounded"
                  />
                )}
              </div>

              <div className="mb-4">
                <CFormLabel className="mt-3">Company Icon</CFormLabel>
                <CFormInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} />
                {iconPreview && (
                  <CImage
                    src={iconPreview.startsWith('blob') ? iconPreview : `${imageUrl}${iconPreview}`}
                    height={80}
                    width={80}
                    className="my-2 border rounded"
                  />
                )}
              </div>

                 <h5 className="mt-4 mb-3 fw-semibold">Address</h5>
                {/* {form.address.map((addr, idx) => (
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
                ))} */}

                {form.address.map((addr, idx) => (
                  <div key={idx} className="border p-3 mb-3 rounded">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <CFormLabel>Type</CFormLabel>
                        <CFormInput value={addr.type} onChange={(e) => handleAddressChange(e, idx, 'type')} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <CFormLabel>Line 1</CFormLabel>
                        <CFormInput value={addr.line1} onChange={(e) => handleAddressChange(e, idx, 'line1')} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <CFormLabel>City</CFormLabel>
                        <CFormInput value={addr.city} onChange={(e) => handleAddressChange(e, idx, 'city')} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <CFormLabel>State</CFormLabel>
                        <CFormInput value={addr.state} onChange={(e) => handleAddressChange(e, idx, 'state')} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <CFormLabel>Country</CFormLabel>
                        <CFormInput value={addr.country} onChange={(e) => handleAddressChange(e, idx, 'country')} />
                      </div>

                      <div className="col-md-6 mb-3">
                        <CFormLabel>Postal Code</CFormLabel>
                        <CFormInput value={addr.postal_code} onChange={(e) => handleAddressChange(e, idx, 'postal_code')} />
                      </div>
                    </div>
                  </div>
                ))}



                <h5 className="mt-4 mb-3 fw-semibold">Terms and Conditions</h5>
                <CFormTextarea name="terms_and_conditions" rows={4} value={form.terms_and_conditions} onChange={handleChange} />

               <h5 className="mt-4 mb-3 fw-semibold">Bank Details</h5>
                {/* {['bank_title', 'account_number', 'iban_number', 'bank', 'branch', 'swift_code'].map((field) => (
                  <div key={field}>
                    <CFormLabel className="text-capitalize">{field.replace(/_/g, ' ')}</CFormLabel>
                    <CFormInput name={field} value={form.bank_details[field]} onChange={handleBankChange} />
                  </div>
                ))} */}
                <div className="border p-3 rounded mb-3">
                  <div className="row">
                    {['bank_title', 'account_number', 'iban_number', 'bank', 'branch', 'swift_code'].map((field) => (
                      <div key={field} className="col-md-6 mb-3">
                        <CFormLabel className="text-capitalize">
                          {field.replace(/_/g, ' ')}
                        </CFormLabel>
                        <CFormInput
                          name={field}
                          value={form.bank_details[field]}
                          onChange={handleBankChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>


                <CButton type="submit" className="mt-4 custom-button">
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

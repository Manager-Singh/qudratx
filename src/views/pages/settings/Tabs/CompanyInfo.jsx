// CompanyInfo.jsx
import React from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CButton,
  CImage,
} from '@coreui/react'

const imageUrl = import.meta.env.VITE_IMAGE_URL

const CompanyInfo = ({
  form,
  handleChange,
  handleFileChange,
  handleAddressChange,
  handleBankChange,
  handleSubmit,
  logoPreview,
  iconPreview,
}) => {
  return (
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
      {form.address.map((addr, idx) => (
        <div key={idx} className="border p-3 mb-3 rounded">
          <div className="row">
            {['type', 'line1', 'city', 'state', 'country', 'postal_code'].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <CFormLabel>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</CFormLabel>
                <CFormInput value={addr[field]} onChange={(e) => handleAddressChange(e, idx, field)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <h5 className="mt-4 mb-3 fw-semibold">Terms and Conditions</h5>
      <CFormTextarea name="terms_and_conditions" rows={4} value={form.terms_and_conditions} onChange={handleChange} />

      <h5 className="mt-4 mb-3 fw-semibold">Bank Details</h5>
      <div className="border p-3 rounded mb-3">
        <div className="row">
          {['bank_title', 'account_number', 'iban_number', 'bank', 'branch', 'swift_code'].map((field) => (
            <div key={field} className="col-md-6 mb-3">
              <CFormLabel className="text-capitalize">{field.replace(/_/g, ' ')}</CFormLabel>
              <CFormInput name={field} value={form.bank_details[field]} onChange={handleBankChange} />
            </div>
          ))}
        </div>
      </div>

      <CButton type="submit" className="mt-4 custom-button">
        Update
      </CButton>
    </CForm>
  )
}

export default CompanyInfo

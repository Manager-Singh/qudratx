import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch } from 'react-redux'

const BusinessActivityForm = () => {
  const dispatch=useDispatch()
  const [formData, setFormData] = useState({
    activity_master_number: '',
    activity_code: '',
    zone: '',
    activity_name: '',
    activity_name_arabic: '',
    status: '1',
    minimum_share_capital: '',
    license_type: '',
    is_not_allowed_for_coworking_esr: false,
    is_special: false,
    activity_price: '',
    activity_group: '',
    description: '',
    qualification_requirement: '',
    documents_required: '',
    category: '',
    additional_approval: '',
    group_id: '',
    third_party: '',
    when: '',
    esr: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = ['activity_master_number', 'activity_code', 'activity_name']
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required'
    })
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    } else {
      setErrors({})
      console.log('Form Submitted:', formData)
      dispatch()
    }
  }

  // Dummy category options — replace with actual list or API data if needed
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'services', label: 'Services' },
    { value: 'educational', label: 'Educational' },
    { value: 'ecommerce', label: 'E-Commerce' },
  ]

  return (
    <div className="container">
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Activity Master Number</CFormLabel>
            <CFormInput
              name="activity_master_number"
              value={formData.activity_master_number}
              onChange={handleChange}
              invalid={!!errors.activity_master_number}
            />
            <CFormFeedback invalid>{errors.activity_master_number}</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel>Activity Code</CFormLabel>
            <CFormInput
              name="activity_code"
              value={formData.activity_code}
              onChange={handleChange}
              invalid={!!errors.activity_code}
            />
            <CFormFeedback invalid>{errors.activity_code}</CFormFeedback>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Activity Name</CFormLabel>
            <CFormInput
              name="activity_name"
              value={formData.activity_name}
              onChange={handleChange}
              invalid={!!errors.activity_name}
            />
            <CFormFeedback invalid>{errors.activity_name}</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel>Activity Name Arabic</CFormLabel>
            <CFormInput
              name="activity_name_arabic"
              value={formData.activity_name_arabic}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Category</CFormLabel>
            <CFormSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormLabel>Minimum Share Capital</CFormLabel>
            <CFormInput
              type="number"
              name="minimum_share_capital"
              value={formData.minimum_share_capital}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={4}>
            <CFormCheck
              name="is_not_allowed_for_coworking_esr"
              label="Not Allowed for Coworking ESR"
              checked={formData.is_not_allowed_for_coworking_esr}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormCheck
              name="is_special"
              label="Is Special"
              checked={formData.is_special}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Activity Price</CFormLabel>
            <CFormInput
              type="number"
              name="activity_price"
              value={formData.activity_price}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Activity Group</CFormLabel>
            <CFormInput
              name="activity_group"
              value={formData.activity_group}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol md={6}>
            <CFormLabel>Qualification Requirement</CFormLabel>
            <CFormTextarea
              name="qualification_requirement"
              value={formData.qualification_requirement}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Documents Required</CFormLabel>
            <CFormTextarea
              name="documents_required"
              value={formData.documents_required}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

      
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormLabel>Group ID</CFormLabel>
            <CFormInput
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Third Party</CFormLabel>
            <CFormInput
              name="third_party"
              value={formData.third_party}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>When</CFormLabel>
            <CFormInput
              name="when"
              value={formData.when}
              onChange={handleChange}
            />
          </CCol>
        </CRow>
         <CRow className="mb-3">
           <CCol md={6}>
            <CFormLabel>ESR</CFormLabel>
            <CFormInput name="esr" value={formData.esr} onChange={handleChange} />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Additional Approval</CFormLabel>
            <CFormInput
              name="additional_approval"
              value={formData.additional_approval}
              onChange={handleChange}
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
         
          <CCol md={6}>
            <CFormLabel>Notes</CFormLabel>
            <CFormTextarea name="notes" value={formData.notes} onChange={handleChange} />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Status</CFormLabel>
            <CFormSelect name="status" value={formData.status} onChange={handleChange}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <div className="text-start">
          <CButton color="primary" type="submit">
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  )
}

export default BusinessActivityForm

import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

function AddClient() {
  const [validated, setValidated] = useState(false)
  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    company_name: '',
    notes: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const isEdit = !!uuid

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormdata((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    const form = e.currentTarget
    e.preventDefault()
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      console.log('Form Data:', formdata)
      // TODO: dispatch here
    }

    setValidated(true)
  }

  return (
    <div className="container">
      <div className="card mt-3">
        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Client Details' : 'Add Client'}</h4>

          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={6}>
                <CFormLabel htmlFor="name">Name<span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter name..."
                  value={formdata.name}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter a name."
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel htmlFor="email">Email<span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email..."
                  value={formdata.email}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter a valid email."
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel htmlFor="phone">Phone</CFormLabel>
                <CFormInput
                   type="tel"
                   name="phone"
                    id="phone"
                    placeholder="Enter phone..."
                    value={formdata.phone}
                    onChange={handleChange}
                    
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel htmlFor="company_name">Company Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="company_name"
                  id="company_name"
                  placeholder="Enter company name..."
                  value={formdata.company_name}
                  onChange={handleChange}
                  
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel htmlFor="address">Address<span className="text-danger">*</span></CFormLabel>
                <CFormTextarea
                  name="address"
                  id="address"
                  placeholder="Enter address..."
                  value={formdata.address}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter an address."
                ></CFormTextarea>
              </CCol>

              <CCol xs={6}>
                <CFormLabel htmlFor="notes">Notes</CFormLabel>
                <CFormTextarea
                  name="notes"
                  id="notes"
                  placeholder="Enter notes..."
                  value={formdata.notes}
                  onChange={handleChange}
                ></CFormTextarea>
              </CCol>

              <CCol xs={12}>
                <CButton type="submit" className="custom-button">
                  {isEdit ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </div>
    </div>
  )
}

export default AddClient

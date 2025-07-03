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
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addClient, updateClient, getClientByUuid } from '../../../store/admin/clientSlice'
import { ToastExample } from '../../../components/toast/Toast'

function AddClient() {
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    status: 1,
    phone: '',
    company_name: '',
    address: '',
    notes: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const isEdit = !!uuid

  // Toast function (same as employee reference)
  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      dispatch(getClientByUuid(uuid)).then((res) => {
        if (res.payload) {
          setFormdata(res.payload)
        } else {
          showToast('Error', 'Failed to fetch client data')
        }
        setLoading(false)
      })
    }
  }, [uuid])

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
      const action = isEdit
        ? updateClient({ uuid, formdata })
        : addClient(formdata)

      dispatch(action)
        .then((res) => {
          if (res.payload?.success) {
            showToast('Success', res.payload.message)
            if (!isEdit) {
              setFormdata({
                name: '',
                email: '',
                status: 1,
                phone: '',
                company_name: '',
                address: '',
                notes: '',
              })
            }
            setTimeout(() => navigate('/clients'), 1500)
          } else {
            const errMsg =
              res.payload || res.error?.message || 'Operation failed'
            showToast('Error', errMsg)
          }
        })
        .catch((err) => {
          const errorMessage = err?.message || 'Something went wrong'
          showToast('Error', errorMessage)
        })
    }

    setValidated(true)
  }

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="card mt-3">
        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Client Details' : 'Add Client'}</h4>

          {loading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
            </div>
          ) : (
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
                  <CFormLabel htmlFor="status">Status</CFormLabel>
                  <CFormSelect
                    id="status"
                    name="status"
                    value={formdata.status}
                    onChange={handleChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </CFormSelect>
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

                <CCol xs={12}>
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
          )}
        </div>
      </div>
    </div>
  )
}

export default AddClient

import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import {
  addEmployee,
  updateEmployee,
  fetchEmployeeByUuid,
  getEmployees,
} from '../../../store/admin/employeeSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastExample } from '../../../components/toast/Toast'

function AddEmployee() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 1,
  })

  const isEdit = Boolean(uuid)

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchEmployeeByUuid(uuid)).then((res) => {
        if (res.payload?.employee) {
          const { name, email, status } = res.payload.employee
          setFormData({ name, email, password: '', status: status ?? 1 })
        }
      })
    }
  }, [uuid])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      const action = isEdit
        ? updateEmployee({ uuid, data: formData })
        : addEmployee(formData)

      dispatch(action)
        .then((res) => {
          if (res.payload?.success) {
            showToast('success', res.payload.message)
            if (!isEdit) setFormData({ name: '', email: '', password: '', status: 1 })
            dispatch(getEmployees())
            setTimeout(() => navigate('/employees'), 1500)
          } else {
            showToast('error', res.payload || 'Failed to save')
          }
        })
        .catch((err) => {
          showToast('error', err.message || 'Unexpected error')
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
          <h4 className="card-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h4>

          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="name">
                  Name<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please enter a name.</CFormFeedback>
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="email">
                  Email<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please enter a valid email address.</CFormFeedback>
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="password">
                  Password{!isEdit && <span className="text-danger">*</span>}
                </CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  id="password"
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Password'}
                  value={formData.password}
                  onChange={handleChange}
                  {...(!isEdit && { required: true, minLength: 6 })}
                />
                {!isEdit && (
                  <CFormFeedback invalid>Password must be at least 6 characters.</CFormFeedback>
                )}
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </CFormSelect>
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

export default AddEmployee

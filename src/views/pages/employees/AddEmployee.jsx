import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CFormFeedback
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { addEmployee, updateEmployee, fetchEmployeeByUuid, getEmployees } from '../../../store/admin/employeeSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastExample } from '../../../components/toast/Toast'

function AddEmployee() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const [validated, setValidated] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const isEdit = uuid

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchEmployeeByUuid(uuid)).then((res) => {
        if (res.payload) {
          const { name, email } = res.payload.employee
          setFormData({ name, email, password: '' }) 
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
    const form = e.currentTarget
    e.preventDefault()

    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      if (isEdit) {
        dispatch(updateEmployee({ uuid, data: formData }))
          .then((res) => {
            if (res.payload?.success) {
              showToast('Success', res.payload.message)
              setTimeout(() => navigate('/employees'), 1500)
            } else {
              showToast('Error', res.payload)
            }
          })
      } else {
        dispatch(addEmployee(formData))
          .then((data) => {
            if (data.payload?.success) {
              setFormData({ name: '', email: '', password: '' })
              showToast('Success', data.payload.message)
              dispatch(getEmployees())
              setTimeout(() => navigate('/employees'), 1500)
            } else {
              showToast('Error', data.payload)
            }
          })
          .catch((error) => {
            showToast('Error', error.message)
          })
      }
    }

    setValidated(true)
  }

  return (
    <div className='container'>
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}
      
      <div className='card mt-3'>
        <div className='card-body'>
          <h4 className='card-title'>
            {isEdit ? 'Edit Employee' : 'Add Employee'}
          </h4>

          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="name">Name<span className="text-danger me-1">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter a name."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="email">Email<span className="text-danger me-1">*</span></CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter a valid email."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="password">
                  Password{!isEdit && <span className="text-danger me-1">*</span>}
                </CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  id="password"
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Password'}
                  value={formData.password}
                  onChange={handleChange}
                  {...(!isEdit && {
                    required: true,
                    feedbackInvalid: 'Please enter a password.'
                  })}
                />
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

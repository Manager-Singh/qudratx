import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { addEmployee, updateEmployee, fetchEmployeeByUuid, getEmployees } from '../../../store/admin/employeeSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../utils/ToastProvider'

function AddOrEditEmployee() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const isEdit =uuid

  // 🟨 Fetch employee if editing
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
    e.preventDefault()

    if (isEdit) {
      dispatch(updateEmployee({ uuid, data: formData }))
        .then((res) => {
          if (res.payload?.success) {
            showToast('Success', 'User updated', 'success')
            navigate('/employees')
             
          } else {
            setError(res.payload?.message || 'Failed to update')
            setTimeout(() => setError(''), 3000)
          }
        })
    } else {
      dispatch(addEmployee(formData))
        .then((data) => {
          if (data.payload?.success) {
            setFormData({ name: '', email: '', password: '' })
            showToast('Success', data.payload.message, 'success')
           dispatch(getEmployees())
            navigate('/employees')
          } else {
            setError(data.payload || 'Something went wrong')
            setTimeout(() => setError(''), 3000)
             showToast('Success', data.payload, 'success')
          }
        })
        .catch(() => {
          setError('Failed to add employee')
          setTimeout(() => setError(''), 3000)
        })
    }
  }

  return (
    <div className='container'>
      <div className='card mt-3'>
        <div className='card-body'>
          <h4 className='card-title'>
            {isEdit ? 'Edit Employee' : 'Add Employee'}
          </h4>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  type="password"
                  name="password"
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Password'}
                  value={formData.password}
                  onChange={handleChange}
                />
              </CCol>

              {error && (
                <CCol xs={12}>
                  <div className="bg-danger text-white py-2 rounded">{error}</div>
                </CCol>
              )}

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

export default AddOrEditEmployee

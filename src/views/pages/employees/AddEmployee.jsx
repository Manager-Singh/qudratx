import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { addEmployee } from '../../../store/admin/employeeSlice'

function AddEmployee() {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

 

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(addEmployee(formData))
      .then((data) => {
        if (data.payload?.success) {
          setFormData({ name: '', email: '', password: '' })
          setError('')
        } else {
          const msg = data.payload || 'Something went wrong'
         
          setError(msg)
          setTimeout(() => setError(''), 3000)
        }
      })
      .catch((err) => {
        const msg = 'Failed to add employee'
        showToast('Error', msg, 'danger')
        setError(msg)

        setTimeout(() => setError(''), 3000)
      })
  }

  return (
    <div>
     
      
     
      {/* ✅ Form */}
      <div className='container'>
        <div className='card'>
        
        <div className='card-body'>
        <h4 className='card-title '>Add Employee</h4>
        <CForm onSubmit={handleSubmit} className=' '>  
          <CRow className="g-3 m-3">
             
            <CCol xs={12}>
              <CFormInput
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                aria-label="Name"
              />
            </CCol>
            <CCol xs={12}>
              <CFormInput
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                aria-label="Email"
              />
            </CCol>
            <CCol xs={12}>
              <CFormInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                aria-label="Password"
              />
            </CCol>

            {error && (
              <CCol xs={12}>
                <div className="bg-danger text-white py-2 rounded">{error}</div>
              </CCol>
            )}

            <CCol xs={12}>
              <CButton type="submit" className="custom-button">
                Submit
              </CButton>
            </CCol>
          </CRow>
        </CForm>
        </div>
        </div>
      </div>
    </div>
  )
}

export default AddEmployee

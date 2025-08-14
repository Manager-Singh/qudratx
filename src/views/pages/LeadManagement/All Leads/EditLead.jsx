import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CCard,
  CCardBody,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { ToastExample } from '../../../../components/toast/Toast'
import { getLeadByUuid, updateLead } from '../../../../store/admin/leadSlice'
import { getEmployees } from '../../../../store/admin/employeeSlice'
import { useParams } from 'react-router-dom'

const originOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'by_call', label: 'By Call' },
  { value: 'by_email', label: 'By Mail' },
  { value: 'in_person', label: 'In Person' }
]

function EditLead() {
  const dispatch = useDispatch()
  const { uuid } = useParams()

  const { employees } = useSelector((state) => state.employee)
  const { user } = useSelector((state) => state.auth)
  const { isUpdating, isLoading: leadLoading } = useSelector((state) => state.lead)

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)
  const [formdata, setFormdata] = useState({
    client_id: '',
    name: '',
    email: '',
    address: '',
    origin: '',
  })
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    if (uuid) {
      dispatch(getLeadByUuid(uuid)).then((res) => {
        const lead = res.payload?.data
        console.log(lead)
        if (lead) {
          setFormdata({
            client_id: lead.Client?.id?.toString() || '',
            name: lead.Client?.name || '',
            email: lead.Client?.email || '',
            address: lead.Client?.address || '',
            origin: lead.origin || '',
          })

          if (lead.assigned_to) {
            setSelectedEmployee({
              value: lead.assigned_to,
              label: lead.assigned_to_name || '',
            })
          }
        }
      })
    }
    dispatch(getEmployees())
  }, [dispatch, uuid])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    const updateData = {
      ...formdata,
      assigned_to: selectedEmployee?.value?.toString() || null,
      updated_by: user.id?.toString(),
    }
console.log("updateData",updateData)
    try {
      const res = await dispatch(updateLead({ uuid, data: updateData })).unwrap()
      showToast('success', res.message || 'Lead updated successfully!')
    } catch (err) {
      showToast('error', err.message || 'Error updating lead.')
    }

    setValidated(true)
  }

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }))

  if (leadLoading) {
    return (
      <div className="text-center my-4">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <CCard>
        <CCardBody>
          <h4 className="card-title mb-4">Edit Lead</h4>

          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              {/* Client Name (disabled) */}
              <CCol md={6}>
                <CFormLabel>Client Name</CFormLabel>
                <CFormInput value={formdata.name} disabled readOnly />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput value={formdata.email} disabled readOnly />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Address</CFormLabel>
                <CFormInput value={formdata.address} disabled readOnly />
              </CCol>

              {/* Editable Fields */}
              <CCol md={6}>
                <CFormLabel htmlFor="origin">Origin</CFormLabel>
                <Select
                  id="origin"
                  name="origin"
                  value={originOptions.find((opt) => opt.value === formdata.origin) || null}
                  onChange={(selectedOption) =>
                    setFormdata((prev) => ({
                      ...prev,
                      origin: selectedOption?.value || '',
                    }))
                  }
                  options={originOptions}
                  placeholder="Select Origin"
                  isClearable
                />
              </CCol>

              {user.role === 'admin' && (
                <CCol md={6}>
                  <CFormLabel htmlFor="employee_id">Assign to Employee</CFormLabel>
                  <Select
                    id="employee_id"
                    name="employee_id"
                    value={selectedEmployee}
                    onChange={setSelectedEmployee}
                    options={employeeOptions}
                    placeholder="Select Employee"
                    isClearable
                  />
                </CCol>
              )}

              <CCol xs={12} className="d-flex justify-content-end">
                <CButton type="submit" color="success" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Update Lead'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default EditLead

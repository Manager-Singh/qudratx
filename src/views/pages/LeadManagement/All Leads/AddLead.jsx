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
  CModal,
  CModalHeader,
  CModalBody,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { ToastExample } from '../../../../components/toast/Toast'
import { getClient, getClientByUuid } from '../../../../store/admin/clientSlice'
import { addLead, assignLead } from '../../../../store/admin/leadSlice'
import AddClient from '../clients/AddClient'
import { getEmployees } from '../../../../store/admin/employeeSlice'
import './Lead.css'
import { useParams } from 'react-router-dom'

const originOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'by_call', label: 'By Call' },
  { value: 'by_email', label: 'By Mail' },
  { value: 'in_person', label: 'In Person' }
]

function AddLead() {
  const dispatch = useDispatch()
  const { clients, isLoading: clientLoading } = useSelector((state) => state.client)
  const { employees } = useSelector((state) => state.employee)
  const { isAdding } = useSelector((state) => state.lead)
  const { user } = useSelector((state) => state.auth)
  
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const [formdata, setFormdata] = useState({
    client_id: '',
    name: '',
    email: '',
    address: '',
    origin: '', 
  })
  const {uuid}= useParams()
 

  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
  if (uuid) {
    dispatch(getClientByUuid(uuid)).then((res) => {
      const client = res.payload?.data
      if (client) {
        setFormdata((prev) => ({
          ...prev,
          client_id: client.id.toString(),
          name: client.name,
          email: client.email,
          address: client.address,
        }))
      }
    })
  } else {
    dispatch(getClient({ page: 1, limit: 10, search: ''}));
  }

  dispatch(getEmployees())
}, [dispatch, uuid])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      const selectedClient = clients.find((c) => c.id === selectedOption.value)
      if (selectedClient) {
        setFormdata((prev) => ({
          ...prev,
          client_id: selectedClient.id.toString(),
          name: selectedClient.name,
          email: selectedClient.email,
          address: selectedClient.address,
        }))
      }
    } else {
      setFormdata({
        client_id: '',
        name: '',
        email: '',
        address: '',
        origin: '',
      })
      setSelectedEmployee(null)
    }
  }

  const handleClientAdded = (newClient) => {
    setFormdata((prev) => ({
      ...prev,
      client_id: newClient.id?.toString() || '',
      name: newClient.name || '',
      email: newClient.email || '',
      address: newClient.address || '',
    }))
    setModalVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false || !formdata.client_id) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    try {
      const res = await dispatch(addLead(formdata)).unwrap()
      const leadId = res.data?.id?.toString() || ''

      showToast('success', res.message || 'Lead added successfully!')

      if (selectedEmployee && user?.id && leadId) {
        const assignData = {
          lead_id: leadId,
          assigned_to: selectedEmployee.value.toString(),
          assigned_by: user.id.toString(),
          updated_by: user.id.toString(),
          status: 'inactive',
        }

        const assignRes = await dispatch(assignLead(assignData)).unwrap()
        showToast('success', assignRes.message || 'Lead assigned successfully!')
      }

      // Reset form
      setFormdata({
        client_id: '',
        name: '',
        email: '',
        address: '',
        origin: '',
      })
      setSelectedEmployee(null)
      setValidated(false)
    } catch (err) {
      showToast('error', err.message || 'Error adding or assigning lead.')
    }

    setValidated(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setValidated(false)
  }

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }))

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }))

  const selectedClientOption = clientOptions.find(
    (opt) => opt.value.toString() === formdata.client_id
  )

  return (
    <div className="container mt-4">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <CCard>
        <CCardBody>
          <h4 className="card-title mb-4">Add Lead</h4>

          {clientLoading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
            </div>
          ) : (
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow className="g-3 m-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="client_id">
                    Client <span className="text-danger">*</span>
                  </CFormLabel>
                  <div className="d-flex gap-2">
                    <div style={{ flex: 1 }}>
                      <Select
                        id="client_id"
                        name="client_id"
                        value={selectedClientOption}
                        onChange={handleClientChange}
                        options={clientOptions}
                        placeholder="Search & Select Client"
                        isClearable
                      />
                    </div>
                    <CButton color="primary" onClick={() => setModalVisible(true)}>
                      + Add Client
                    </CButton>
                  </div>
                </CCol>

                {formdata.client_id && (
                  <>
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
                        placeholder="Select Origin "
                        isClearable
                       
                      />
                    </CCol>
                    {user.role == "admin" &&  <CCol md={6}>
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
                    </CCol>}
                   

                    <CCol xs={12} className="d-flex justify-content-end">
                      <CButton type="submit" color="success" disabled={isAdding}>
                        {isAdding ? 'Saving...' : 'Add Lead'}
                      </CButton>
                    </CCol>
                  </>
                )}
              </CRow>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      {/* Add Client Modal */}
      <CModal visible={modalVisible} onClose={handleModalClose} backdrop="static">
        <CModalHeader onClose={handleModalClose}>Add New Client</CModalHeader>
        <CModalBody>
          <AddClient onSubmit={handleClientAdded} />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default AddLead

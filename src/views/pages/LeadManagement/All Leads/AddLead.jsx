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
import { getClient } from '../../../../store/admin/clientSlice'
import { addLead } from '../../../../store/admin/leadSlice'
import AddClient from '../clients/AddClient'
import './Lead.css'; 

function AddLead() {
  const dispatch = useDispatch()

  const { clients, isLoading: clientLoading } = useSelector((state) => state.client)
  const { isAdding } = useSelector((state) => state.lead)

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [formdata, setFormdata] = useState({
    client_id: '',
    name: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    dispatch(getClient())
  }, [dispatch])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      const selectedClient = clients.find((c) => c.id === selectedOption.value)
      if (selectedClient) {
        setFormdata({
          client_id: selectedClient.id.toString(),
          name: selectedClient.name,
          email: selectedClient.email,
          address: selectedClient.address,
        })
      }
    } else {
      setFormdata({
        client_id: '',
        name: '',
        email: '',
        address: '',
      })
    }
  }

  const handleClientAdded = (newClient) => {
    setFormdata({
      client_id: newClient.id?.toString() || '',
      name: newClient.name || '',
      email: newClient.email || '',
      address: newClient.address || '',
    })
    setModalVisible(false)
  }

  const handleSubmit = (e) => {
    const form = e.currentTarget
    e.preventDefault()

    if (form.checkValidity() === false || !formdata.client_id) {
      e.stopPropagation()
    } else {
      dispatch(addLead(formdata))
        .unwrap()
        .then((res) => {
          showToast('success', res.message || 'Lead added successfully!')
          setFormdata({
            client_id: '',
            name: '',
            email: '',
            address: '',
          })
          setValidated(false)
        })
        .catch((err) => {
          showToast('error', err.message || 'Error adding lead.')
        })
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

  const selectedClientOption = clientOptions.find((opt) => opt.value.toString() === formdata.client_id)

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
                    <CCol md={4}>
                      <CFormLabel>Client Name</CFormLabel>
                      <CFormInput value={formdata.name} disabled readOnly />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput value={formdata.email} disabled readOnly />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Address</CFormLabel>
                      <CFormInput value={formdata.address} disabled readOnly />
                    </CCol>
                  </>
                )}

                <CCol xs={12}>
                  <CButton type="submit" color="success" disabled={isAdding}>
                    {isAdding ? 'Saving...' : 'Add Lead'}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      {/* Add Client Modal */}
      <CModal
        visible={modalVisible}
        onClose={handleModalClose}
        backdrop="static" // Optional: to prevent closing on backdrop click
      >
        <CModalHeader onClose={handleModalClose}>Add New Client</CModalHeader>
        <CModalBody>
          <AddClient onSubmit={handleClientAdded} />
        </CModalBody>
      </CModal>

    </div>
  )
}

export default AddLead

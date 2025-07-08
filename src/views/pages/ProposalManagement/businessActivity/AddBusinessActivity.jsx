import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
// import { addBusinessActivity, getBusinessActivityByUuid, updateBusinessActivity } from '../../../store/admin/businessActivitySlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastExample } from '../../../../components/toast/Toast'

function AddBusinessActivity() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    notes: '',
    sn: '',
    status: 1,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

//   const { businessactivity } = useSelector((state) => state.businessactivity)

  useEffect(() => {
    if (isEdit) {
      // dispatch(getBusinessActivityByUuid(id))
    }
  }, [dispatch, id])

//   useEffect(() => {
//     if (isEdit && businessactivity?.uuid === id) {
//       setFormData({
//         name: businessactivity.name || '',
//         description: businessactivity.description || '',
//         price: businessactivity.price || '',
//         notes: businessactivity.notes || '',
//         sn: businessactivity.sn || '',
//         status: businessactivity.status ?? 1,
//       })
//     }
//   }, [businessactivity, id])

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
      // dispatch(updateBusinessActivity({ id, formData })).then((data) => {
      //   if (data.payload.success) {
      //     navigate('/business-activity')
      //   } else {
      //     showToast('error', data.payload.message || 'Update failed')
      //   }
      // })
    } else {
      // dispatch(addBusinessActivity(formData)).then((data) => {
      //   if (data.payload.success) {
      //     setFormData({ name: '', description: '', price: '', notes: '', sn: '', status: 1 })
      //     showToast('success', data.payload.message || 'Added successfully')
      //     setTimeout(() => navigate('/business-activity'), 1500)
      //   } else {
      //     showToast('error', data.payload.message || 'Add failed')
      //   }
      // })
    }
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
          <h4 className="card-title">{isEdit ? 'Edit Business Activity' : 'Add Business Activity'}</h4>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter activity name"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="sn">Serial Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="sn"
                  name="sn"
                  value={formData.sn}
                  onChange={handleChange}
                  placeholder="Enter serial number"
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="price">Price</CFormLabel>
                <CFormInput
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min={0}
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {formData.status == 1 ? (
                    <>
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </>
                  ) : (
                    <>
                      <option value={0}>Inactive</option>
                      <option value={1}>Active</option>
                    </>
                  )}
                </CFormSelect>
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="notes">Notes</CFormLabel>
                <CFormTextarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
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

export default AddBusinessActivity

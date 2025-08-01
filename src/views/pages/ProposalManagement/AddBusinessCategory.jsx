import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormFeedback,
  CFormSelect
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addBusinessCategory,
  getBusinessCategoryByUuid,
  updateBusinessCategory,
} from '../../../store/admin/businessCategorySlice'
import { ToastExample } from '../../../components/toast/Toast'

function AddBusinessCategory() {
  
  const [validated, setValidated] = useState(false)
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [formData,setFormData] = useState({
    name:'',
    status:1,
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const isEdit = Boolean(uuid)

  const { business_category } = useSelector((state) => state.business_category)

  useEffect(() => {
    if (isEdit) {
      dispatch(getBusinessCategoryByUuid(uuid))
    }
  }, [dispatch, uuid])

  useEffect(() => {
    if (isEdit && business_category?.uuid === uuid) {
      setFormData({
        name: business_category.name,
        status:business_category.status
      })
    }
  }, [business_category, uuid])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'status' ? Number(value) : value,
  }));
};

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
   
      const action = isEdit
        ? updateBusinessCategory({ uuid,formData})
        : addBusinessCategory(formData)

      dispatch(action).then((res) => {
        if (res.payload?.success) {
          showToast('success', res.payload.message || 'Saved successfully')
         
          setTimeout(() => {
  navigate('/business-category');
  if (!isEdit) {
    setFormData({
      name: '',
      status: 1,
    });
  }
}, 1500);
        } else {
          showToast('error', res.payload|| 'Failed to save')
        }
      }).catch((err) => {
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
          <h4 className="card-title">{isEdit ? 'Edit Business Category' : 'Add Business Category'}</h4>

          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="name">
                  Name<span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter business activity..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please enter a name.</CFormFeedback>
              </CCol>

                            <CCol xs={12}>
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

export default AddBusinessCategory

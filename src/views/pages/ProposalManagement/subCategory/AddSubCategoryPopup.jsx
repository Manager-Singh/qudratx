import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import { useState } from 'react'

function AddSubCategoryPopup({
  visible,
  setVisible,
  handleSubmit,
  formData,
  setFormData,
  isEdit = false,
  setIsEdit,
  setSelectedSubCategory,
}) {
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModalClose = () => {
    setVisible(false)
    setIsEdit(false)
    setFormData({ name: '', status: 1 })
    setSelectedSubCategory(null)
    setValidated(false)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      handleSubmit(e)
    }
    setValidated(true)
  }

  return (
    <div className="text-center mt-5">
      <CModal visible={visible} onClose={handleModalClose} alignment="center">
        <CModalHeader>
          <CModalTitle>
            {isEdit ? 'Edit Subcategory' : 'Add Subcategory'}
          </CModalTitle>
        </CModalHeader>
        <CForm noValidate validated={validated} onSubmit={handleFormSubmit}>
          <CModalBody>
            <CCol xs={12} className="mb-3">
              <CFormLabel htmlFor="name">
                Name<span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter subcategory name..."
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
                {formData.status === 1 ? (
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
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={handleModalClose}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              {isEdit ? 'Update' : 'Submit'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default AddSubCategoryPopup

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

function AddAuthorityPopUp({
  visible,
  setVisible,
  handleSubmit,
  formData,
  setFormData,
  isEdit = false,
  setIsEdit,
  setSelectedAuthority,
  imagePreview,
  setImagePreview,
}) {
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleModalClose = () => {
    setVisible(false)
    setIsEdit(false)
    setFormData({ name: '', status: 1, image: null })
    setSelectedAuthority(null)
    setImagePreview(null)
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
    <CModal visible={visible} onClose={handleModalClose} alignment="center">
      <CModalHeader>
        <CModalTitle>
          {isEdit ? 'Edit Business Zone Authority' : 'Add Business Zone Authority'}
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
              placeholder="Enter Authority name..."
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
          <CCol xs={12} className="mb-3">
  <CFormLabel htmlFor="image">Upload Image</CFormLabel>
  <CFormInput
    type="file"
    id="image"
    name="image"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }))
        setImagePreview(URL.createObjectURL(file))
      }
    }}
  />
  {imagePreview && (
    <div className="mt-2">
      <img
        src={imagePreview}
        alt="Preview"
        style={{
          maxWidth: '100%',
          maxHeight: '200px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      />
    </div>
  )}
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
  )
}

export default AddAuthorityPopUp

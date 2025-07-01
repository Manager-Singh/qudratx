
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
} from '@coreui/react'

function AddAuthorityPopUp({ visible, setVisible, handleSubmit, name, setName, isEdit = false  ,setIsEdit,setSelectedAuthority}) {
  return (
    <div className="text-center mt-5">
      <CModal visible={visible} isEdit={isEdit} onClose={() => {setVisible(false)
        setIsEdit(false)
        setName('')
        setSelectedAuthority(null)
      }} alignment="center">
        <CModalHeader>
          <CModalTitle>{isEdit ? 'Edit Business Zone Authority' : 'Add Business Zone Authority'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Authority name..."
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() =>{ setVisible(false)
               setIsEdit(false)
               setName('')
                setSelectedAuthority(null)
          }}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {isEdit ? 'Update' : 'Submit'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AddAuthorityPopUp

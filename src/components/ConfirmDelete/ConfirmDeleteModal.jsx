// // import React from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalBody,
// //   CModalFooter,
// //   CButton
// // } from '@coreui/react';

// // const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, title = 'Confirm Delete', message = 'Are you sure you want to delete this item?' }) => {
// //   return (
// //     <CModal visible={visible} onClose={onCancel}>
// //       <CModalHeader closeButton>{title}</CModalHeader>
// //       <CModalBody>{message}</CModalBody>
// //       <CModalFooter>
// //         <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
// //         <CButton color="danger" onClick={onConfirm}>Delete</CButton>
// //       </CModalFooter>
// //     </CModal>
// //   );
// // };

// // export default ConfirmDeleteModal;

// import React from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CButton
// } from '@coreui/react';
// import './ConfirmDeleteModal.css'

// const ConfirmDeleteModal = ({
//   visible,
//   onCancel,
//   onConfirm,
//   title = 'Confirm Action',
//   message = 'Are you sure you want to perform this action?',
//   confirmLabel = 'Delete',
//   confirmColor = 'danger'
// }) => {
//   return (
//     <CModal visible={visible} onClose={onCancel} className='custom-model'>
//       <CModalHeader closeButton>{title}</CModalHeader>
//       <CModalBody>{message}</CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
//         <CButton color={confirmColor} onClick={onConfirm}>{confirmLabel}</CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };

// export default ConfirmDeleteModal;
// ConfirmDeleteModal.jsx
import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormTextarea,
} from '@coreui/react'

const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
  showTextarea = false,
  onTextareaChange,
  textareaValue = '',
}) => {
  const [internalMessage, setInternalMessage] = useState(textareaValue)

  useEffect(() => {
    setInternalMessage(textareaValue) // reset on reopen
  }, [visible, textareaValue])

  const handleConfirm = () => {
    if (showTextarea && onTextareaChange) {
      onTextareaChange(internalMessage)
    }
    onConfirm(internalMessage)
  }

  return (
    <CModal visible={visible} onClose={onCancel}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{message}</p>
        {showTextarea && (
          <CFormTextarea
            rows={4}
            value={internalMessage}
            onChange={(e) => setInternalMessage(e.target.value)}
            placeholder="Enter reason for disapproval"
            required
          />
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color={confirmColor} onClick={handleConfirm}>
          {confirmLabel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmDeleteModal

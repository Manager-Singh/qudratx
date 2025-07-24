// import React from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CButton
// } from '@coreui/react';

// const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, title = 'Confirm Delete', message = 'Are you sure you want to delete this item?' }) => {
//   return (
//     <CModal visible={visible} onClose={onCancel}>
//       <CModalHeader closeButton>{title}</CModalHeader>
//       <CModalBody>{message}</CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
//         <CButton color="danger" onClick={onConfirm}>Delete</CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };

// export default ConfirmDeleteModal;

import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';
import './ConfirmDeleteModal.css'

const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmLabel = 'Delete',
  confirmColor = 'danger'
}) => {
  return (
    <CModal visible={visible} onClose={onCancel} className='custom-model'>
      <CModalHeader closeButton>{title}</CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
        <CButton color={confirmColor} onClick={onConfirm}>{confirmLabel}</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmDeleteModal;

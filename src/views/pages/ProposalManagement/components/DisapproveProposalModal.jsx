
import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormTextarea,
} from '@coreui/react'

const DisapproveProposalModal = ({
  visible,
  onCancel,
  onConfirm,
  message,
  onMessageChange,
}) => {
  return (
    <CModal visible={visible} onClose={onCancel}>
      <CModalHeader closeButton>
        <CModalTitle>Disapprove Proposal</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Please leave a reason for disapproval:</p>
        <CFormTextarea
          rows={4}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter your reason for disapproving..."
          required
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="warning" onClick={() => onConfirm(message)} disabled={!message.trim()}>
          Disapprove
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DisapproveProposalModal

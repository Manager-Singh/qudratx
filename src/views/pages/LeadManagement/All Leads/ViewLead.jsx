

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CFormSelect,
  CRow,
  CCol,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilInfo, cilNotes, cilFile } from '@coreui/icons';
import { ToastExample } from '../../../../components/toast/Toast';
import { getLeadByUuid, handleApproveStatus } from '../../../../store/admin/leadSlice';
import './Lead.css';

const ViewLead = () => {
   const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };
  const {user} = useSelector((state)=>state.auth)
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const { lead, isLoading } = useSelector((state) => state.lead);

  // State for the dropdown
  const [status, setStatus] = useState('');
  // State for the unapproval modal
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (uuid) {
      dispatch(getLeadByUuid(uuid));
    }
  }, [uuid, dispatch]);

  useEffect(() => {
    if (lead) {
      if (lead.approval_status == 1) {
        setStatus('approve');
      } else if (lead.approval_status == 2) {
        setStatus('pending');
      } else {
        setStatus('unapprove');
      }
    }
  }, [lead]);

  // Handle dropdown changes
  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // Update UI immediately

    if (newStatus === 'unapprove') {
     
      setReason(''); // Clear previous reason
      setShowReasonModal(true);
    } else {
      // For "approve", dispatch the action directly
      dispatch(handleApproveStatus({ uuid: lead?.uuid, data: { action: newStatus } })).then(
        (data) => {
          if (data.payload.success) {
            showToast('success', data.payload.message);
            dispatch(getLeadByUuid(uuid)); // Re-fetch data to be sure
          } else {
            showToast('danger', 'Failed to approve lead.');
          }
        },
      );
    }
  };

  // Handler for the modal's confirm button
  const handleConfirmUnapprove = () => {
    if (!reason) {
        showToast('warning', 'Please provide a reason for unapproval.');
        return;
    }

    dispatch(
      handleApproveStatus({ uuid: lead?.uuid, data: { action: 'unapprove', reason: reason } }),
    ).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message);
        dispatch(getLeadByUuid(uuid)); // Re-fetch data to be sure
        setShowReasonModal(false);
      } else {
        showToast('danger', 'Failed to unapprove lead.');
      }
    });
  };

  const handleCancelModal = () => {
    setShowReasonModal(false);
    // Revert the status dropdown to its original state from Redux
     if (lead) {
      if (lead.approval_status == 1) setStatus('approve');
      else if (lead.approval_status == 2) setStatus('pending');
      else setStatus('unapprove');
    }
  }


  if (isLoading || !lead) {
    return <div className="p-4">Loading lead details...</div>;
  }

  return (
    
     <div className="container mt-4">
       {toastData.show && (
                      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                        <ToastExample status={toastData.status} message={toastData.message} />
                      </div>
                                    )}
      <CCard className="mb-4 shadow-sm border-0">
     
        <CCardHeader className="bg-light d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <CIcon icon={cilFile} size="lg" className="me-2 text-primary" />
            <CCardTitle className="h5 mb-0 fw-bold text-primary">
              Lead Details
              <span className="ms-3 badge bg-info-gradient text-dark">{lead?.lead_number || '-'}</span>
            </CCardTitle>
          </div>
          {user.role === "admin" ? <div className="d-flex align-items-center mt-2 mt-md-0">
            <label htmlFor="status-select" className="me-2 fw-semibold">Approval Status:</label>
            <CFormSelect
              id="status-select"
              onChange={handleChange}
              value={status}
              style={{ width: '150px' }}
              aria-label="Select approval status"
            >
              <option disabled value="pending">Pending</option>
              <option value="approve">Approved</option>
              <option value="unapprove">Unapproved</option>
            </CFormSelect>
          </div> :<div><span className='fw-bold'>Approval Status:</span> {lead?.approval_status == 2 ? "Pending" : lead?.approval_status == 1 ? "Approved" :"UnApproved" }</div> }
         
        </CCardHeader>

        {/* ======================= CARD BODY (with Grid Layout) ======================= */}
        <CCardBody className="p-4">
          <CRow>
            {/* --- Column 1: Client Information --- */}
            <CCol md={6} className="mb-4">
              <CCard className='h-100'>
                <CCardHeader className="fw-bold">
                  <CIcon icon={cilUser} className="me-2" />
                  Client Information
                </CCardHeader>
                <CCardBody>
                  <dl className="row">
                    <dt className="col-sm-4">Client Name</dt>
                    <dd className="col-sm-8">{lead.Client?.name || '-'}</dd>

                    <dt className="col-sm-4">Company</dt>
                    <dd className="col-sm-8">{lead.Client?.company_name || '-'}</dd>

                    <dt className="col-sm-4">Email</dt>
                    <dd className="col-sm-8">{lead.Client?.email || '-'}</dd>

                    <dt className="col-sm-4">Address</dt>
                    <dd className="col-sm-8">{lead.Client?.address || '-'}</dd>
                  </dl>
                </CCardBody>
              </CCard>
            </CCol>

            {/* --- Column 2: Lead & System Details --- */}
            <CCol md={6} className="mb-4">
              <CCard className='h-100'>
                <CCardHeader className="fw-bold">
                  <CIcon icon={cilInfo} className="me-2" />
                  Lead & System Details
                </CCardHeader>
                <CCardBody>
                  <dl className="row">
                    <dt className="col-sm-4">Lead Status</dt>
                    <dd className="col-sm-8">
                      <CBadge color="warning" shape="rounded-pill">{lead.lead_status || '-'}</CBadge>
                    </dd>

                    <dt className="col-sm-4">Origin</dt>
                    <dd className="col-sm-8">{lead.origin || '-'}</dd>

                    <dt className="col-sm-4">Assigned To</dt>
                    <dd className="col-sm-8">{lead.assignedTo?.name || '—'}</dd>

                    <dt className="col-sm-4">Created By</dt>
                    <dd className="col-sm-8">{lead.createdBy?.name || '—'}</dd>

                    <dt className="col-sm-4">Created At</dt>
                    <dd className="col-sm-8">
                      {lead.created_at ? new Date(lead.created_at).toLocaleString() : '-'}
                    </dd>
                  </dl>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          
          {/* --- Full-Width Section for Notes --- */}
          <CRow>
            <CCol>
                <CCard>
                    <CCardHeader className='fw-bold'>
                        <CIcon icon={cilNotes} className='me-2' />
                        Notes
                    </CCardHeader>
                    <CCardBody>
                        <p className='mb-0 fst-italic text-muted'>
                            {lead.Client?.notes || 'No notes provided.'}
                        </p>
                    </CCardBody>
                </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
       {/* ======================= REASON MODAL ======================= */}
      <CModal visible={showReasonModal} onClose={handleCancelModal}>
        <CModalHeader>
          <h5>Reason for Unapproval</h5>
        </CModalHeader>
        <CModalBody>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Enter the reason why this lead is being unapproved..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-3 d-flex justify-content-end gap-2">
            <CButton color="secondary" onClick={handleCancelModal}>
              Cancel
            </CButton>
            <CButton color="danger" onClick={handleConfirmUnapprove}>
              Confirm Unapproval
            </CButton>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ViewLead;

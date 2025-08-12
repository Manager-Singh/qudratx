import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCardTitle,
} from '@coreui/react'

import { getLeadByUuid } from '../../../../store/admin/leadSlice'
import './Lead.css'

const ViewLead = () => {
  const { uuid } = useParams()
  const dispatch = useDispatch()

  const { lead, isLoading } = useSelector((state) => state.lead)

  useEffect(() => {
    if (uuid) {
      dispatch(getLeadByUuid(uuid))
    }
  }, [uuid, dispatch])

  if (isLoading || !lead) return <div className="p-4">Loading lead details...</div>

  return (
    <div className="container mt-4">
      <CCard className="mb-4 mt-4 shadow-sm border-0">
        <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
          <CCardTitle className="h5 mb-0 fw-bold text-primary">Lead Details</CCardTitle>
          <span className="badge bg-info text-dark">{lead?.lead_number || '-'}</span>
        </CCardHeader>

        <CCardBody className="p-4">
          <CTable bordered responsive className="align-middle table-striped">
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Client Name</CTableHeaderCell>
                <CTableDataCell>{lead.Client?.name || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Email</CTableHeaderCell>
                <CTableDataCell>{lead.Client?.email || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Address</CTableHeaderCell>
                <CTableDataCell>{lead.Client?.address || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Company</CTableHeaderCell>
                <CTableDataCell>{lead.Client?.company_name || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Notes</CTableHeaderCell>
                <CTableDataCell>{lead.Client?.notes || '-'}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Origin</CTableHeaderCell>
                <CTableDataCell>{lead.origin || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Created Status</CTableHeaderCell>
                <CTableDataCell>{lead.created_status || '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Lead Status</CTableHeaderCell>
                <CTableDataCell>
                  <span className="badge bg-warning text-dark">{lead.lead_status || '-'}</span>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Approval Status</CTableHeaderCell>
                <CTableDataCell>
                  <span
                    className={`badge ${
                      lead.approval_status === 'approved' ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {lead.approval_status || '-'}
                  </span>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Assigned To</CTableHeaderCell>
                <CTableDataCell>{lead.assignedTo?.name || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Assigned By</CTableHeaderCell>
                <CTableDataCell>{lead.assignedBy?.name || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Created By</CTableHeaderCell>
                <CTableDataCell>{lead.createdBy?.name || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Updated By</CTableHeaderCell>
                <CTableDataCell>{lead.updated_by || '—'}</CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Created At</CTableHeaderCell>
                <CTableDataCell>
                  {lead.created_at ? new Date(lead.created_at).toLocaleString() : '-'}
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Status</CTableHeaderCell>
                <CTableDataCell>
                  <span className={`badge ${lead.status ? 'bg-success' : 'bg-danger'}`}>
                    {lead.status ? 'Active' : 'Inactive'}
                  </span>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ViewLead

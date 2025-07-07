import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCardTitle,
  CFormSelect,
  CProgress,
} from '@coreui/react'
import { ToastExample } from '../../../../components/toast/Toast'

import { getBusinessZone } from '../../../../store/admin/businessZoneSlice'
import { getBusinessActivity } from '../../../../store/admin/businessActivitySlice'
import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'
import { getLeadByUuid } from '../../../../store/admin/leadSlice'
import './Lead.css'

const dummyLicensePackages = [
  { id: 1, name: 'Basic Package', content: 'Includes basic license features.' },
  { id: 2, name: 'Standard Package', content: 'Includes standard features with support.' },
  { id: 3, name: 'Premium Package', content: 'Full access, premium support, and customization.' },
]

const ViewLead = () => {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { businesszones } = useSelector((state) => state.businesszone)
  const { business_activities } = useSelector((state) => state.business_activity)
  const { authorities } = useSelector((state) => state.businessZonesAuthority)
  const proposalFormRef = useRef(null)


  const { lead, isLoading } = useSelector((state) => state.lead)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [step, setStep] = useState(1)

  const steps = ['Business Zone', 'Authority', 'Activity', 'Package']
  const totalSteps = steps.length

  const goNext = () => step < totalSteps && setStep(step + 1)
  const goBack = () => step > 1 && setStep(step - 1)

  const [formData, setFormData] = useState({
    businessZone: '',
    authority: '',
    businessActivity: '',
    licensePackage: '',
    customPackage: '',
  })

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  useEffect(() => {
    if (uuid) {
      dispatch(getLeadByUuid(uuid))
      dispatch(getBusinessZone())
      dispatch(getBusinessActivity())
    }
  }, [uuid, dispatch])

  useEffect(() => {
    if (formData.businessZone) {
      dispatch(getBusinessZonesAuthorityByZoneId({ id: formData.businessZone }))
    }
  }, [formData.businessZone, dispatch])

  useEffect(() => {
    if (showProposalForm && proposalFormRef.current) {
      proposalFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showProposalForm])
  

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'businessZone' ? { authority: '' } : {}),
    }))
  }

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!formData.businessZone) return showToast('error', 'Please select a business zone')
        break
      case 2:
        if (!formData.authority) return showToast('error', 'Please select an authority')
        break
      case 3:
        if (!formData.businessActivity)
          return showToast('error', 'Please select a business activity')
        break
      default:
        break
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => setStep((prev) => prev - 1)

  const handleSubmitProposal = () => {
    if (
      !formData.businessZone ||
      !formData.authority ||
      !formData.businessActivity ||
      !formData.licensePackage
    ) {
      return showToast('error', 'Please complete all required fields before submitting.')
    }

    // Replace with actual API submit logic
    showToast('success', 'Proposal submitted successfully!')
    setShowProposalForm(false)
    setStep(1)
    setFormData({
      businessZone: '',
      authority: '',
      businessActivity: '',
      licensePackage: '',
      customPackage: '',
    })
  }

  if (isLoading || !lead) return <div className="p-4">Loading lead details...</div>
  return (
    <div className="container mt-4">
      {/* Toast Notification */}
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      {/* Lead Details */}
      <CCard className="mb-4 mt-4 shadow-sm border-0">
        <CCardHeader className="bg-light d-flex justify-content-between align-items-center">
          <CCardTitle className="h5 mb-0 fw-bold text-primary">Lead Details</CCardTitle>
          <span className="badge bg-info text-dark">{lead?.lead_number || '-'}</span>
        </CCardHeader>

        <CCardBody className="p-4">
          <CTable bordered responsive className="align-middle table-striped">
            <CTableBody>
              {/* Client Info */}
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

              {/* Lead Info */}
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
                  <span className={`badge ${lead.approval_status === 'approved' ? 'bg-success' : 'bg-secondary'}`}>
                    {lead.approval_status}
                  </span>
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Assigned To</CTableHeaderCell>
                <CTableDataCell>{lead.assigned_to || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Assigned By</CTableHeaderCell>
                <CTableDataCell>{lead.assigned_by || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Created By</CTableHeaderCell>
                <CTableDataCell>{lead.created_by || '—'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Updated By</CTableHeaderCell>
                <CTableDataCell>{lead.updated_by || '—'}</CTableDataCell>
              </CTableRow>

              {/* Created At */}
              <CTableRow>
                <CTableHeaderCell className="fw-semibold">Created At</CTableHeaderCell>
                <CTableDataCell>{lead.created_at ? new Date(lead.created_at).toLocaleString() : '-'}</CTableDataCell>
              </CTableRow>

              {/* Status */}
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


      {/* Show Proposal Form */}
      <CButton className="custom-button" onClick={() => setShowProposalForm(!showProposalForm)}>
        {showProposalForm ? 'Hide Proposal Form' : 'Create Proposal'}
      </CButton>

      {showProposalForm && (
        <div ref={proposalFormRef} className="proposal-form mt-4 border rounded p-4 bg-white shadow-sm">
          <h5 className="mb-4">Create Proposal</h5>

          {/* Step Indicator */}
          <CProgress value={(step / totalSteps) * 100} className="mb-4 progress-bar-custom" />
          <div className="d-flex justify-content-between mb-4 text-center step-indicator">
            {steps.map((label, idx) => {
              const currentStep = idx + 1
              const isActive = step === currentStep
              return (
                <div key={idx} className="flex-fill">
                  <div className={`step-circle ${isActive ? 'active' : ''}`}>{currentStep}</div>
                  <div className="step-label">{label}</div>
                </div>
              )
            })}
          </div>
          {/* Step Content */}
          {step === 1 && (
            <div className="mb-3">
              <label className="form-label">
                Select Business Zone <span className="text-danger">*</span>
              </label>
              <CFormSelect
                name="businessZone"
                value={formData.businessZone}
                onChange={handleChange}
                required
                className="form-select-custom"
              >
                <option value="">-- Select Zone --</option>
                {businesszones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          )}

          {step === 2 && (
            <div className="mb-3">
              <label className="form-label">
                Select Specific Authority <span className="text-danger">*</span>
              </label>
              <CFormSelect
                name="authority"
                value={formData.authority}
                onChange={handleChange}
                required
                className="form-select-custom"
              >
                <option value="">-- Select Authority --</option>
                {authorities.map((auth) => (
                  <option key={auth.id} value={auth.id}>
                    {auth.name}
                  </option>
                ))}
              </CFormSelect>
            </div>
          )}

          {step === 3 && (
            <div className="mb-3">
              <label className="form-label">
                Select Business Activity <span className="text-danger">*</span>
              </label>
              <div className="business-activities">
                {business_activities.map((activity) => (
                  <label
                    key={activity.id}
                    className={`activity-option ${
                      formData.businessActivity === String(activity.id) ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessActivity"
                      value={activity.id}
                      checked={formData.businessActivity === String(activity.id)}
                      onChange={handleChange}
                    />
                    <span className="activity-name">{activity.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <>
              <div className="mb-3">
                <label className="form-label">
                  Select License Package <span className="text-danger">*</span>
                </label>
                <div className="license-packages">
                  {dummyLicensePackages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`license-option ${
                        formData.licensePackage === String(pkg.id) ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="licensePackage"
                        value={String(pkg.id)}
                        checked={formData.licensePackage === String(pkg.id)}
                        onChange={handleChange}
                      />
                      <div>
                        <strong>{pkg.name}</strong> - <small>{pkg.content}</small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Custom Package (Optional)</label>
                <textarea
                  name="customPackage"
                  className="form-control custom-package-textarea"
                  value={formData.customPackage}
                  onChange={handleChange}
                  placeholder="Enter custom package details if any..."
                  rows={4}
                ></textarea>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="button-wrapper mt-4">
            {step > 1 && (
              <CButton className="custom-button" onClick={handleBack}>
                ← Back
              </CButton>
            )}
            {step < totalSteps ? (
              <CButton className="custom-button" onClick={handleNext}>
                Next →
              </CButton>
            ) : (
              <CButton className="custom-button" onClick={handleSubmitProposal}>
                Submit Proposal
              </CButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewLead

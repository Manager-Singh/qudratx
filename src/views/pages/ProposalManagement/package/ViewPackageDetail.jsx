import React from 'react'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CBadge
} from '@coreui/react'

function ViewPackageDetail() {
 
  
const dummyPackage = {
  name: 'Premium Immigration Package',
  description: 'Complete service including visa processing, legal consultation, and priority support.',
  feeDetails: [
    { name: 'visaFee', amount: 120 },
    { name: 'serviceFee', amount: 85 },
    { name: 'prioritySupport', amount: 50 },
    { name: 'legalConsultation', amount: 150 }
  ],
  discountAmount: 50
}


  const { name, description, feeDetails = [], discountAmount = 0 } = dummyPackage

  const subtotal = feeDetails.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
  const discount = Number(discountAmount || 0)
  const total = Math.max(subtotal - discount, 0)

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Package Details</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <strong>Name:</strong> {name}
            </CCol>
            <CCol md={6}>
              <strong>Description:</strong> {description}
            </CCol>
          </CRow>

          <hr />

          <h6>Fees</h6>
          <CListGroup className="mb-3">
            {feeDetails.length > 0 ? (
              feeDetails.map((fee, index) => (
                <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  {fee.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  <CBadge color="primary" shape="rounded-pill">
                    ADE {parseFloat(fee.amount).toFixed(2)}
                  </CBadge>
                </CListGroupItem>
              ))
            ) : (
              <CListGroupItem>No fees selected.</CListGroupItem>
            )}
          </CListGroup>

          {discount > 0 && (
            <>
              <h6>Discount</h6>
              <CListGroup className="mb-3">
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  Discount
                  <CBadge color="danger" shape="rounded-pill">-ADE {discount.toFixed(2)}</CBadge>
                </CListGroupItem>
              </CListGroup>
            </>
          )}

          <h6>Total</h6>
          <CListGroup>
            <CListGroupItem className="d-flex justify-content-between align-items-center">
              <strong>Total Payable</strong>
              <CBadge color="success" shape="rounded-pill">ADE {total.toFixed(2)}</CBadge>
            </CListGroupItem>
          </CListGroup>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ViewPackageDetail

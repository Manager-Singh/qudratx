import React, { useEffect } from 'react'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CBadge,
  CSpinner,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPackageByUUID } from '../../../../store/admin/packageSlice'


function ViewPackageDetail() {
  const { uuid } = useParams()
  const dispatch = useDispatch()

  const { package: packageData } = useSelector((state) => state.package)

  useEffect(() => {
    if (uuid) {
      dispatch(getPackageByUUID(uuid))
    }
  }, [uuid, dispatch])

  if (!packageData ) {
    return (
      <CContainer className="mt-4 text-center">
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  const {
    name = '',
    description = '',
    fee_structure = {},
    discount = 0,
    tax = 0,
    subtotal = 0,
    total_amount = 0,
    status = false,
    created_at,
    updated_at,
    last_update,
  } = packageData

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <h5 className="mb-0">Package Details</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={6}><strong>Name:</strong> {name}</CCol>
            <CCol md={6}><strong>Description:</strong> {description}</CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}><strong>Status:</strong>{' '}
              <CBadge color={status ? 'success' : 'secondary'}>
                {status ? 'Active' : 'Inactive'}
              </CBadge>
            </CCol>
           
          </CRow>

          <hr />

          <h6>Fee Structure</h6>
          <CListGroup className="mb-3">
            {Object.keys(fee_structure).length > 0 ? (
              Object.entries(fee_structure).map(([key, value], index) => (
                <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  {key}
                  <CBadge color="primary" shape="rounded-pill">ADE {parseFloat(value).toFixed(2)}</CBadge>
                </CListGroupItem>
              ))
            ) : (
              <CListGroupItem>No fees defined.</CListGroupItem>
            )}
          </CListGroup>

          <h6>Amounts</h6>
          <CListGroup className="mb-3">
            <CListGroupItem className="d-flex justify-content-between align-items-center">
              Subtotal
              <CBadge color="info" shape="rounded-pill">ADE {subtotal.toFixed(2)}</CBadge>
            </CListGroupItem>
            <CListGroupItem className="d-flex justify-content-between align-items-center">
              Discount
              <CBadge color="danger" shape="rounded-pill">-ADE {discount.toFixed(2)}</CBadge>
            </CListGroupItem>
            <CListGroupItem className="d-flex justify-content-between align-items-center">
              Tax
              <CBadge color="warning" shape="rounded-pill">ADE {tax.toFixed(2)}</CBadge>
            </CListGroupItem>
            <CListGroupItem className="d-flex justify-content-between align-items-center">
              <strong>Total Payable</strong>
              <CBadge color="success" shape="rounded-pill">ADE {total_amount.toFixed(2)}</CBadge>
            </CListGroupItem>
          </CListGroup>

         
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ViewPackageDetail

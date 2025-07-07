// import React, { useEffect, useState } from 'react'
// import {
//   CContainer,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CRow,
//   CCol,
//   CListGroup,
//   CListGroupItem,
//   CBadge,
//   CSpinner,
// } from '@coreui/react'
// import { useParams } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { getPackageByUuid } from '../../../../store/admin/packageSlice'

// function ViewPackageDetail() {
//   const { uuid } = useParams()
//   const dispatch = useDispatch()

//   const { selectedPackage, loading } = useSelector((state) => state.package)

//   useEffect(() => {
//     if (uuid) {
//       dispatch(getPackageByUuid(uuid))
//     }
//   }, [uuid, dispatch])

//   if (loading || !selectedPackage) {
//     return (
//       <CContainer className="mt-4 text-center">
//         <CSpinner color="primary" />
//       </CContainer>
//     )
//   }

//   const {
//     name,
//     description,
//     feeDetails = [],
//     discountAmount = 0,
//     taxAmount = 0,
//     totalAmount = 0
//   } = selectedPackage

//   return (
//     <CContainer className="mt-4">
//       <CCard>
//         <CCardHeader>
//           <h5 className="mb-0">Package Details</h5>
//         </CCardHeader>
//         <CCardBody>
//           <CRow className="mb-3">
//             <CCol md={6}><strong>Name:</strong> {name}</CCol>
//             <CCol md={6}><strong>Description:</strong> {description}</CCol>
//           </CRow>

//           <hr />

//           <h6>Fees</h6>
//           <CListGroup className="mb-3">
//             {feeDetails.length > 0 ? (
//               feeDetails.map((fee, index) => (
//                 <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
//                   {fee.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                   <CBadge color="primary" shape="rounded-pill">
//                     ADE {parseFloat(fee.amount).toFixed(2)}
//                   </CBadge>
//                 </CListGroupItem>
//               ))
//             ) : (
//               <CListGroupItem>No fees found.</CListGroupItem>
//             )}
//           </CListGroup>

//           {discountAmount > 0 && (
//             <>
//               <h6>Discount</h6>
//               <CListGroup className="mb-3">
//                 <CListGroupItem className="d-flex justify-content-between align-items-center">
//                   Discount
//                   <CBadge color="danger" shape="rounded-pill">-ADE {discountAmount.toFixed(2)}</CBadge>
//                 </CListGroupItem>
//               </CListGroup>
//             </>
//           )}

//           {taxAmount > 0 && (
//             <>
//               <h6>Tax</h6>
//               <CListGroup className="mb-3">
//                 <CListGroupItem className="d-flex justify-content-between align-items-center">
//                   Tax
//                   <CBadge color="warning" shape="rounded-pill">ADE {taxAmount.toFixed(2)}</CBadge>
//                 </CListGroupItem>
//               </CListGroup>
//             </>
//           )}

//           <h6>Total</h6>
//           <CListGroup>
//             <CListGroupItem className="d-flex justify-content-between align-items-center">
//               <strong>Total Payable</strong>
//               <CBadge color="success" shape="rounded-pill">ADE {totalAmount.toFixed(2)}</CBadge>
//             </CListGroupItem>
//           </CListGroup>
//         </CCardBody>
//       </CCard>
//     </CContainer>
//   )
// }

// export default ViewPackageDetail


// import React, { useState } from 'react'
// import {
//   CButton,
//   CCol,
//   CRow,
//   CFormSelect,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CFormInput,
//   CFormLabel,
  
// } from '@coreui/react'


// import { FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa'

// function Clients({selectedClientId,setSelectedClientId,clientOptions}) {
//   return (
//     <div>
//         <h4>Search & Select Client</h4>
//         <CFormSelect
//           value={selectedClient}
//           onChange={(e) => setSelectedClient(e.target.value)}
//           aria-label="Select Client"
//         >
//           <option value="">-- Select a Client --</option>
//           {clientOptions.map((client) => (
//             <option key={client.id} value={client.id}>
//               {client.name}
//             </option>
//           ))}
//         </CFormSelect>
//         <div className='mt-4'>
//             <CCard className="shadow-sm rounded-4 border-0">
//       <CCardHeader className="d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">Client Details</h5>
//         <CButton color="danger" size="sm" >Close</CButton>
//       </CCardHeader>

//       <CCardBody>
//         <CRow className="mb-3">
//           <CCol md={6}>
//             <strong>Name:</strong>
//             <div className="text-muted">name</div>
//           </CCol>
//           <CCol md={6}>
//             <strong><FaEnvelope className="me-2" />Email:</strong>
//             <div className="text-muted">email</div>
//           </CCol>
//         </CRow>

//         <CRow className="mb-3">
//           <CCol md={6}>
//             <strong><FaPhone className="me-2" />Phone:</strong>
//             <div className="text-muted">78-7393739</div>
//           </CCol>
//           <CCol md={6}>
//             <strong><FaBuilding className="me-2" />Company:</strong>
//             <div className="text-muted">"company_name"</div>
//           </CCol>
//         </CRow>

//         <CRow className="mb-3">
//           <CCol>
//             <strong><FaMapMarkerAlt className="me-2" />Address:</strong>
//             <div className="text-muted">"address"</div>
//           </CCol>
//         </CRow>

//         <CRow>
//           <CCol>
//             <strong><FaStickyNote className="me-2" />Notes:</strong>
//             <div className="text-muted border rounded p-2 bg-light"> 'No notes added.'</div>
//           </CCol>
//         </CRow>
//       </CCardBody>
//     </CCard>
//         </div>
//         </div>
//   )
// }

// export default Clients


import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaStickyNote,
} from 'react-icons/fa'
import { getClient } from '../../../../store/admin/clientSlice'

function Clients({selectedClientId,setSelectedClientId}) {
  const dispatch = useDispatch()

  const [selectedClient, setSelectedClient] = useState(null)

  const clients = useSelector((state) => state.client.clients) // ✅ your actual client list in store
  const isLoading = useSelector((state) => state.client.isLoading)

  // Fetch clients on mount
  useEffect(() => {
    dispatch(getClient())
  }, [dispatch])

  // Set selected client details when dropdown changes
  useEffect(() => {
    const client = clients.find((c) => c.id === parseInt(selectedClientId))
    setSelectedClient(client || null)
  }, [selectedClientId, clients])

  return (
    <div>
      <h4>Search & Select Client</h4>
      <CFormSelect
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
        aria-label="Select Client"
        disabled={isLoading}
      >
        <option value="">-- Select a Client --</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </CFormSelect>

      {selectedClient && (
        <div className="mt-4">
          <CCard className="shadow-sm rounded-4 border-0">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Client Details</h5>
              <CButton
                color="danger"
                size="sm"
                onClick={() => {
                  setSelectedClientId('')
                  setSelectedClient(null)
                }}
              >
                Close
              </CButton>
            </CCardHeader>

            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Name:</strong>
                  <div className="text-muted">{selectedClient.name}</div>
                </CCol>
                <CCol md={6}>
                  <strong>
                    <FaEnvelope className="me-2" />
                    Email:
                  </strong>
                  <div className="text-muted">{selectedClient.email}</div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>
                    <FaPhone className="me-2" />
                    Phone:
                  </strong>
                  <div className="text-muted">{selectedClient.phone}</div>
                </CCol>
                <CCol md={6}>
                  <strong>
                    <FaBuilding className="me-2" />
                    Company:
                  </strong>
                  <div className="text-muted">{selectedClient.company_name}</div>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <strong>
                    <FaMapMarkerAlt className="me-2" />
                    Address:
                  </strong>
                  <div className="text-muted">{selectedClient.address}</div>
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <strong>
                    <FaStickyNote className="me-2" />
                    Notes:
                  </strong>
                  <div className="text-muted border rounded p-2 bg-light">
                    {selectedClient.notes || 'No notes added.'}
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </div>
      )}
    </div>
  )
}

export default Clients

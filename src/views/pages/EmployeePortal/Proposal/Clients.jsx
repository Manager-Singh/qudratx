// import React, { useEffect, useState } from 'react'
// import {
//   CButton,
//   CCol,
//   CRow,
//   CFormSelect,
//   CCard,
//   CCardHeader,
//   CCardBody,
// } from '@coreui/react'
// import { useDispatch, useSelector } from 'react-redux'

// import {
//   FaEnvelope,
//   FaPhone,
//   FaBuilding,
//   FaMapMarkerAlt,
//   FaStickyNote,
// } from 'react-icons/fa'
// import { getClient } from '../../../../store/admin/clientSlice'

// function Clients({ selectedClient, setSelectedClient }) {
//   const dispatch = useDispatch()
//   const clients = useSelector((state) => state.client.clients)
//   const isLoading = useSelector((state) => state.client.isLoading)
//   const [selectedClientId, setSelectedClientId] = useState('')

//   // Fetch clients on mount
//   useEffect(() => {
//     dispatch(getClient())
//   }, [dispatch])

//   // When dropdown changes
//   const handleClientChange = (e) => {
//     const clientId = e.target.value
//     setSelectedClientId(clientId)

//     const clientObj = clients.find((c) => c.id === parseInt(clientId))
//     setSelectedClient(clientObj || null)
//   }

//   return (
//     <div>
//       <h4>Search & Select Client</h4>
//       <CFormSelect
//         value={selectedClientId}
//         onChange={handleClientChange}
//         aria-label="Select Client"
//         disabled={isLoading}
//       >
//         <option value="">-- Select a Client --</option>
//         {clients.map((client) => (
//           <option key={client.id} value={client.id}>
//             {client.name}
//           </option>
//         ))}
//       </CFormSelect>

//       {selectedClient && (
//         <div className="mt-4">
//           <CCard className="shadow-sm rounded-4 border-0">
//             <CCardHeader className="d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Client Details</h5>
//               <CButton
//                 color="danger"
//                 size="sm"
//                 onClick={() => {
//                   setSelectedClient(null)
//                   setSelectedClientId('')
//                 }}
//               >
//                 Close
//               </CButton>
//             </CCardHeader>

//             <CCardBody>
//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <strong>Name:</strong>
//                   <div className="text-muted">{selectedClient.name}</div>
//                 </CCol>
//                 <CCol md={6}>
//                   <strong>
//                     <FaEnvelope className="me-2" />
//                     Email:
//                   </strong>
//                   <div className="text-muted">{selectedClient.email}</div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol md={6}>
//                   <strong>
//                     <FaPhone className="me-2" />
//                     Phone:
//                   </strong>
//                   <div className="text-muted">{selectedClient.phone}</div>
//                 </CCol>
//                 <CCol md={6}>
//                   <strong>
//                     <FaBuilding className="me-2" />
//                     Company:
//                   </strong>
//                   <div className="text-muted">{selectedClient.company_name}</div>
//                 </CCol>
//               </CRow>

//               <CRow className="mb-3">
//                 <CCol>
//                   <strong>
//                     <FaMapMarkerAlt className="me-2" />
//                     Address:
//                   </strong>
//                   <div className="text-muted">{selectedClient.address}</div>
//                 </CCol>
//               </CRow>

//               <CRow>
//                 <CCol>
//                   <strong>
//                     <FaStickyNote className="me-2" />
//                     Notes:
//                   </strong>
//                   <div className="text-muted border rounded p-2 bg-light">
//                     {selectedClient.notes || 'No notes added.'}
//                   </div>
//                 </CCol>
//               </CRow>
//             </CCardBody>
//           </CCard>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Clients

import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'

import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaStickyNote,
} from 'react-icons/fa'
import { getClient } from '../../../../store/admin/clientSlice'

function Clients({ selectedClient, setSelectedClient ,lead_id}) {
  const dispatch = useDispatch()
  const clients = useSelector((state) => state.client.clients)
  const isLoading = useSelector((state) => state.client.isLoading)

  // Create options for react-select
  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }))

  // Find selected option from selectedClient
  const selectedOption = selectedClient
    ? { value: selectedClient.id, label: selectedClient.name }
    : null

  // Handle change for react-select
  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      const clientObj = clients.find((c) => c.id === selectedOption.value)
      setSelectedClient(clientObj || null)
    } else {
      setSelectedClient(null)
    }
  }

  useEffect(() => {
  dispatch(getClient({ page: 1, limit: 10, search: '' }));
}, [dispatch]);

  return (
    <div>
      <h4>Search & Select Client</h4>
      <Select
        value={selectedOption}
        onChange={handleClientChange}
        options={clientOptions}
        isClearable={!lead_id} 
        isDisabled={Boolean(lead_id)} 
        isLoading={isLoading}
        placeholder="Search & Select Client"
      />

      {selectedClient && (
        <div className="mt-4">
          <CCard className="shadow-sm rounded-4 border-0">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Client Details</h5>
              <CButton
                color="danger"
                size="sm"
                onClick={() => setSelectedClient(null)}
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

// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   CCard,
//   CCardBody,
//   CFormSelect,
//   CRow,
//   CCol,
//   CSpinner,
// } from '@coreui/react'

// // Redux actions
// import { getBusinessZone } from '../../../../store/admin/businessZoneSlice'
// import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'

// const PdfSettings = () => {
//   const dispatch = useDispatch()

//   const { businesszones } = useSelector((state) => state.businesszone)
//   const { authorities } = useSelector((state) => state.businessZonesAuthority)

//   const [selectedZoneId, setSelectedZoneId] = useState('')
//   const [selectedZone, setSelectedZone] = useState(null)
//   const [loadingZones, setLoadingZones] = useState(true)
//   const [loadingAuthorities, setLoadingAuthorities] = useState(false)

//   // Load Zones
//   useEffect(() => {
//     setLoadingZones(true)
//     dispatch(getBusinessZone()).finally(() => setLoadingZones(false))
//   }, [dispatch])

//   // Load Authorities based on selected Zone
//   useEffect(() => {
//     if (selectedZoneId) {
//       setLoadingAuthorities(true)
//       dispatch(getBusinessZonesAuthorityByZoneId({ id: selectedZoneId }))
//         .finally(() => setLoadingAuthorities(false))

//       const zone = businesszones.find((z) => z.id === parseInt(selectedZoneId))
//       setSelectedZone(zone)
//     } else {
//       setSelectedZone(null)
//     }
//   }, [selectedZoneId, businesszones, dispatch])

//   return (
//     <CCard className="mt-4 shadow-sm border-0">
//       <CCardBody>
//         {/* Zone Selection */}
//         <CRow className="mb-4">
//           <CCol md={6}>
//             <label className="form-label">Select Business Zone</label>
//             {loadingZones ? (
//               <div className="d-flex align-items-center">
//                 <CSpinner size="sm" className="me-2" />
//                 <span>Loading zones...</span>
//               </div>
//             ) : (
//               <CFormSelect
//                 value={selectedZoneId}
//                 onChange={(e) => setSelectedZoneId(e.target.value)}
//               >
//                 <option value="">-- Select Zone --</option>
//                 {businesszones.map((zone) => (
//                   <option key={zone.id} value={zone.id}>
//                     {zone.name}
//                   </option>
//                 ))}
//               </CFormSelect>
//             )}
//           </CCol>
//         </CRow>

//         {/* Zone Details */}
//         {selectedZone && (
//           <div className="text-center mb-4">
//             <h5>{selectedZone.name}</h5>
//             {/* Add back image rendering here if needed */}
//           </div>
//         )}

//         {/* Authorities Table */}
//         {selectedZoneId && (
//           <div>
//             <h6 className="mb-3">Select PDF image for each zone</h6>

//             {loadingAuthorities ? (
//               <div className="d-flex align-items-center">
//                 <CSpinner size="sm" className="me-2" />
//                 <span>Loading authorities...</span>
//               </div>
//             ) : authorities.length > 0 ? (
//               <table className="table table-bordered align-middle text-center">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Name</th>
//                     <th>Image</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {authorities.map((auth) => (
//                     <tr key={auth.id}>
//                       <td>{auth.name}</td>
//                       <td>
//                         <img
//                           src={auth.image || 'https://via.placeholder.com/100x60?text=No+Image'}
//                           alt={auth.name}
//                           style={{
//                             width: '100px',
//                             height: '60px',
//                             objectFit: 'cover',
//                             borderRadius: '6px',
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <button className="btn btn-sm btn-outline-primary me-2">
//                           Change Image
//                         </button>
//                         <button className="btn btn-sm btn-outline-danger">
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-muted">No authorities found for this zone.</p>
//             )}
//           </div>
//         )}
//       </CCardBody>
//     </CCard>
//   )
// }

// export default PdfSettings
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CFormInput,
  CButton,
} from '@coreui/react'

// Redux actions
import { getBusinessZone } from '../../../../store/admin/businessZoneSlice'
import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'
// import { updateAuthorityImage } from '../../../../store/admin/zoneAuthoritySlice' // hypothetical

const PdfSettings = () => {
  const dispatch = useDispatch()

  const { businesszones } = useSelector((state) => state.businesszone)
  const { authorities } = useSelector((state) => state.businessZonesAuthority)

  const [selectedZoneId, setSelectedZoneId] = useState('')
  const [selectedZone, setSelectedZone] = useState(null)
  const [loadingZones, setLoadingZones] = useState(true)
  const [loadingAuthorities, setLoadingAuthorities] = useState(false)
  const [editingImageId, setEditingImageId] = useState(null)

  const [imagePreviews, setImagePreviews] = useState({})
  const [imageFiles, setImageFiles] = useState({})

  // Load Zones
  useEffect(() => {
    setLoadingZones(true)
    dispatch(getBusinessZone()).finally(() => setLoadingZones(false))
  }, [dispatch])

  // Load Authorities based on selected Zone
  useEffect(() => {
    if (selectedZoneId) {
      setLoadingAuthorities(true)
      dispatch(getBusinessZonesAuthorityByZoneId({ id: selectedZoneId })).finally(() =>
        setLoadingAuthorities(false),
      )

      const zone = businesszones.find((z) => z.id === parseInt(selectedZoneId))
      setSelectedZone(zone)
    } else {
      setSelectedZone(null)
    }
  }, [selectedZoneId, businesszones, dispatch])

  const handleImageChange = (e, authorityId) => {
    const file = e.target.files[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setImagePreviews((prev) => ({ ...prev, [authorityId]: previewURL }))
      setImageFiles((prev) => ({ ...prev, [authorityId]: file }))
    }
  }

  const handleSaveImage = async (authorityId) => {
    const file = imageFiles[authorityId]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    formData.append('authorityId', authorityId)

    try {
      // Replace with your actual API call
      // await dispatch(updateAuthorityImage({ id: authorityId, data: formData }))

      console.log('Uploading image for authority ID:', authorityId, file)

      // Simulate success
      alert('Image uploaded successfully!')

      // Clean up
      setEditingImageId(null)
      setImagePreviews((prev) => {
        const updated = { ...prev }
        delete updated[authorityId]
        return updated
      })
      setImageFiles((prev) => {
        const updated = { ...prev }
        delete updated[authorityId]
        return updated
      })

      // Reload authorities
      dispatch(getBusinessZonesAuthorityByZoneId({ id: selectedZoneId }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload image.')
    }
  }

  return (
    <CCard className="mt-4 shadow-sm border-0">
      <CCardBody>
        {/* Zone Selection */}
        <CRow className="mb-4">
          <CCol md={6}>
            <label className="form-label">Select Business Zone</label>
            {loadingZones ? (
              <div className="d-flex align-items-center">
                <CSpinner size="sm" className="me-2" />
                <span>Loading zones...</span>
              </div>
            ) : (
              <CFormSelect value={selectedZoneId} onChange={(e) => setSelectedZoneId(e.target.value)}>
                <option value="">-- Select Zone --</option>
                {businesszones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </CFormSelect>
            )}
          </CCol>
        </CRow>

        {/* Zone Details */}
        {selectedZone && (
          <div className="text-center mb-4">
            <h5>{selectedZone.name}</h5>
          </div>
        )}

        {/* Authorities Table */}
        {selectedZoneId && (
          <div>
            <h6 className="mb-3">Select PDF image for each zone</h6>

            {loadingAuthorities ? (
              <div className="d-flex align-items-center">
                <CSpinner size="sm" className="me-2" />
                <span>Loading authorities...</span>
              </div>
            ) : authorities.length > 0 ? (
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authorities.map((auth) => (
                    <tr key={auth.id}>
                      <td>{auth.name}</td>
                      <td>
                        <img
                          src={
                            imagePreviews[auth.id] ||
                            auth.image ||
                            'https://via.placeholder.com/100x60?text=No+Image'
                          }
                          alt={auth.name}
                          style={{
                            width: '100px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      </td>
                      <td>
                        {editingImageId === auth.id ? (
                          <>
                            <CFormInput
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, auth.id)}
                              className="mb-2"
                            />
                            <div className="d-flex justify-content-center">
                              <CButton
                                color="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleSaveImage(auth.id)}
                              >
                                Save
                              </CButton>
                              <CButton
                                color="secondary"
                                size="sm"
                                onClick={() => setEditingImageId(null)}
                              >
                                Cancel
                              </CButton>
                            </div>
                          </>
                        ) : (
                          <CButton
                            color="primary"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingImageId(auth.id)}
                          >
                            Change Image
                          </CButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No authorities found for this zone.</p>
            )}
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default PdfSettings

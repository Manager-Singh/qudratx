
import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'

function AddBusinessActivty() {
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {uuid} = useParams() // check if we are editing
  const isEdit = uuid
  console.log(isEdit,"isEdit")

//   const {  businesszone } = useSelector((state) => state.businesszone)

//   // On mount, if editing, fetch data
//   useEffect(() => {
   
//     if (isEdit ) {
//       dispatch(getBusinessZoneByUuid(id))
//     }
//   }, [dispatch, id])

 
//   // Set form value when data arrives
//   useEffect(() => {
//     if (isEdit && businesszone?.uuid === id) {
//       setName(businesszone.name)
//     }
//   }, [businesszone, id])

//   const handleChange = (e) => {
//     setName(e.target.value)
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!name.trim()) {
//       setError('Name is required')
//       return
//     }

//     const payload = { name }
  
//     if (isEdit) {
//       dispatch(updateBusinessZone( {id, ...payload } )).then((data) => {
//         console.log(data,"data")
//         if (data.payload.success) {
//           navigate('/business-zone')
//         } else {
//           setError(data.payload)
//           setTimeout(() => setError(''), 3000)
//         }
//       })
//     } else {
//       dispatch(addBusinessZone(payload)).then((data) => {
//         if (data.payload.success) {
//           setName('')
//           navigate('/business-zone')
//         } else {
//           setError(data.payload)
//           setTimeout(() => setError(''), 3000)
//         }
//       })
//     }
//   }
const handleSubmit=()=>{

}
const handleChange=()=>{

}
  return (
    <div className="container">
      <div className="card mt-3">
        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Business Activity' : 'Add Business Activity'}</h4>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Enter business activity..."
                  value={name}
                  onChange={handleChange}
                />
              </CCol>
              

              <CCol xs={12}>
                <CButton type="submit" className="custom-button">
                  {isEdit ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </div>
    </div>
  )
}

export default AddBusinessActivty

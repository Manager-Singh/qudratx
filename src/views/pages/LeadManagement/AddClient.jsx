
import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput ,CFormTextarea,CFormLabel} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'


function AddClient() {
  const [formdata , setFormdata] = useState({
    name :'',
    email:'',
    address:'',
    phone:'',
    company_name:'',
    notes:''

  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {uuid} = useParams()
  const isEdit = uuid
  

// const {business_activity}=useSelector((state)=>state.business_activity)


//   useEffect(() => {
   
//     if (isEdit ) {
//       dispatch(getBusinessActivityByUuid(uuid))
//     }
//   }, [dispatch, uuid])

 
  // Set form value when data arrives
//   useEffect(() => {
//     if (isEdit && business_activity?.uuid === uuid) {
//       setName(business_activity.name)
//     }
//   }, [business_activity, uuid])

  const handleChange = (e) => {
    const {name,value} =e.target
    setFormdata((prev)=>({...prev,
        [name]:value})
        )
  }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     const payload = { name }
  
//     if (isEdit) {
//       dispatch(updateBusinessActivity( {uuid, ...payload } )).then((data) => {
//         if (data.payload.success) {
//           navigate('/business-activities')
//         } else {
//           // setError(data.payload)
//           // setTimeout(() => setError(''), 3000)
//         }
//       })
//     } else {
//       dispatch(addBusinessActivity(payload)).then((data) => {
//         if (data.payload.success) {
//           setName('')
//           navigate('/business-activities')
//         } else {
//           // setError(data.payload)
//           // setTimeout(() => setError(''), 3000)
//         }
//       })
//     }
//   }

const handleSubmit =(e)=>{
    e.preventDefault()
console.log('Form Data:', formdata);
}

  return (
    <div className="container">
      <div className="card mt-3">
        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Client Details' : 'Add Client'}</h4>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel >Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Enter name..."
                  value={formdata.name}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                 <CFormLabel >Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Enter email..."
                  value={formdata.email}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                 <CFormLabel >Phone</CFormLabel>
                <CFormInput
                  type="text"
                  name="phone"
                  placeholder="Enter phone..."
                  value={formdata.phone}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                 <CFormLabel >Company Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="company_name"
                  placeholder="Enter company name..."
                  value={formdata.company_name}
                  onChange={handleChange}
                />
              </CCol>
               
              <CCol xs={12}>
                 <CFormLabel >Address</CFormLabel>
                 <CFormTextarea
                 className="mb-3"
                 name="address"
                 placeholder="Enter address..."
                 value={formdata.address}
                 onChange={handleChange}
               ></CFormTextarea>
              </CCol>
                
              <CCol xs={12}>
                 <CFormLabel >Notes</CFormLabel>
                 <CFormTextarea
                 className="mb-3"
                 name="notes"
                 placeholder="Enter notes..."
                 value={formdata.notes}
                 onChange={handleChange}
               ></CFormTextarea>
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

export default AddClient

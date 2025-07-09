import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput,CFormLabel ,CFormSelect} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { addBusinessZone, getBusinessZoneByUuid, updateBusinessZone } from '../../../store/admin/businessZoneSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastExample } from '../../../components/toast/Toast'

function AddBusinessZone() {
  const [formData ,setFormData]= useState({
  name:'',
  status:1,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams() // check if we are editing
  const isEdit = id
 const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
 const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }
  const {  businesszone } = useSelector((state) => state.businesszone)

  // On mount, if editing, fetch data
  useEffect(() => {
   
    if (isEdit ) {
      dispatch(getBusinessZoneByUuid(id))
    }
  }, [dispatch, id])

 
  // Set form value when data arrives
  useEffect(() => {
    if (isEdit && businesszone?.uuid === id) {
      setFormData({
        name:businesszone.name,
        status:businesszone.status
      })
    }
  }, [businesszone, id])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev)=>({
      ...prev, [name]:value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

  
    if (isEdit) {
      dispatch(updateBusinessZone( {id, formData } )).then((data) => {
        if (data.payload.success) {
          navigate('/business-zone')
        } else {
         
        showToast('error', data.payload )
           
        }
      })
    } else {
      dispatch(addBusinessZone(formData)).then((data) => {
        if (data.payload.success) {
          setFormData({
            name:'',
            status:1
          })
            showToast('success', data.payload.message )
            setTimeout(()=>{navigate('/business-zone')},1500)
          
        } else {
       
          showToast('success', data.payload )
          
        }
      })
    }
  }

  return (
    <div className="container">
       {toastData.show && (
              <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                <ToastExample status={toastData.status} message={toastData.message} />
              </div>
            )}
      <div className="card mt-3">
        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit BusinessZone' : 'Add BusinessZone'}</h4>

          <CForm onSubmit={handleSubmit}>

            <CRow className="g-3 m-3">
              <CCol xs={12}>
                 <CFormLabel htmlFor="status">Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </CCol>
            <CCol xs={12}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {formData.status == 1 ? (
                  <>
             <option value={1}>Active</option>
             <option value={0}>Inactive</option>
                 </>
           ) : (
                <>
           <option value={0}>Inactive</option>
           <option value={1}>Active</option>
              </>
                         )}
                  
                </CFormSelect>
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

export default AddBusinessZone

// import React, { useState, useEffect } from 'react'
// import {
//   CButton,
//   CCol,
//   CRow,
//   CForm,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
// } from '@coreui/react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   addBusinessZone,
//   getBusinessZoneByUuid,
//   updateBusinessZone,
// } from '../../../store/admin/businessZoneSlice'
// import { useNavigate, useParams } from 'react-router-dom'
// import { ToastExample } from '../../../components/toast/Toast'

// function AddBusinessZone() {
//   const [formData, setFormData] = useState({
//     name: '',
//     status: 1,
//     image: null,
//   })

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const isEdit = !!id

//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
//   const showToast = (status, message) => {
//     setToastData({ show: true, status, message })
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
//   }

//   const { businesszone } = useSelector((state) => state.businesszone)

//   // Fetch business zone data if editing
//   useEffect(() => {
//     if (isEdit) {
//       dispatch(getBusinessZoneByUuid(id))
//     }
//   }, [dispatch, id])

//   // Populate form data on fetch
//   useEffect(() => {
//     if (isEdit && businesszone?.uuid === id) {
//       setFormData({
//         name: businesszone.name,
//         status: businesszone.status,
//         image: null, // Don't prefill image
//       })
//     }
//   }, [businesszone, id])

//   const handleChange = (e) => {
//     const { name, value, files } = e.target
//     if (name === 'image') {
//       setFormData((prev) => ({
//         ...prev,
//         image: files[0],
//       }))
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     const payload = new FormData()
//     payload.append('name', formData.name)
//     payload.append('status', formData.status)
//     if (formData.image) {
//       payload.append('image', formData.image)
//     }

//     if (isEdit) {
//       dispatch(updateBusinessZone({ id, formData: payload })).then((data) => {
//         if (data.payload.success) {
//           navigate('/business-zone')
//         } else {
//           showToast('error', data.payload)
//         }
//       })
//     } else {
//       dispatch(addBusinessZone(payload)).then((data) => {
//         if (data.payload.success) {
//           setFormData({ name: '', status: 1, image: null })
//           showToast('success', data.payload.message)
//           setTimeout(() => navigate('/business-zone'), 1500)
//         } else {
//           showToast('error', data.payload)
//         }
//       })
//     }
//   }

//   return (
//     <div className="container">
//       {toastData.show && (
//         <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}
//       <div className="card mt-3">
//         <div className="card-body">
//           <h4 className="card-title">{isEdit ? 'Edit BusinessZone' : 'Add BusinessZone'}</h4>

//           <CForm onSubmit={handleSubmit}>
//             <CRow className="g-3 m-3">
//               <CCol xs={12}>
//                 <CFormLabel htmlFor="name">Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </CCol>

//               <CCol xs={12}>
//                 <CFormLabel htmlFor="status">Status</CFormLabel>
//                 <CFormSelect
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value={1}>Active</option>
//                   <option value={0}>Inactive</option>
//                 </CFormSelect>
//               </CCol>

//               <CCol xs={12}>
//                 <CFormLabel htmlFor="image">Image</CFormLabel>
//                 <CFormInput
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleChange}
//                 />
//               </CCol>

//               <CCol xs={12}>
//                 <CButton type="submit" className="custom-button">
//                   {isEdit ? 'Update' : 'Submit'}
//                 </CButton>
//               </CCol>
//             </CRow>
//           </CForm>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddBusinessZone


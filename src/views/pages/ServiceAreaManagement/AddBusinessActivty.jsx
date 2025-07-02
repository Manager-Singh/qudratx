
import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate, useParams } from 'react-router-dom'
import { addBusinessActivity, getBusinessActivityByUuid, updateBusinessActivity } from '../../../store/admin/businessActivitySlice'

function AddBusinessActivty() {
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {uuid} = useParams() // check if we are editing
  const isEdit = uuid
  

const {business_activity}=useSelector((state)=>state.business_activity)


  useEffect(() => {
   
    if (isEdit ) {
      dispatch(getBusinessActivityByUuid(uuid))
    }
  }, [dispatch, uuid])

 
  // Set form value when data arrives
  useEffect(() => {
    if (isEdit && business_activity?.uuid === uuid) {
      setName(business_activity.name)
    }
  }, [business_activity, uuid])

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = { name }
  
    if (isEdit) {
      dispatch(updateBusinessActivity( {uuid, ...payload } )).then((data) => {
        if (data.payload.success) {
          navigate('/business-activities')
        } else {
          // setError(data.payload)
          // setTimeout(() => setError(''), 3000)
        }
      })
    } else {
      dispatch(addBusinessActivity(payload)).then((data) => {
        if (data.payload.success) {
          setName('')
          navigate('/business-activities')
        } else {
          // setError(data.payload)
          // setTimeout(() => setError(''), 3000)
        }
      })
    }
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

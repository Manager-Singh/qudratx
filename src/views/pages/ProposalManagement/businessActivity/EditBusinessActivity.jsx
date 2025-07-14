import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import BusinessActivityForm from './BusinessActivityForm'
import {
  getBusinessActivityByUuid,
  updateBusinessActivity,
} from '../../../../store/admin/businessActivitySlice'
import { ToastExample } from '../../../../components/toast/Toast'

const EditBusinessActivity = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
     const showToast = (status, message) => {
      setToastData({ show: true, status, message })
      setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
    }
  const { business_activity} = useSelector((state) => state.business_activity)
  
  useEffect(() => {
    dispatch(getBusinessActivityByUuid( uuid ))
  }, [uuid])
 
  const handleSubmit = (formData) => {
    dispatch(updateBusinessActivity({ uuid, data: formData })).then((res) => {
      console.log(res,"res")
      if (res.payload?.success) {
          showToast('success', res.payload.message || 'Saved successfully')
       setTimeout(() => {
       navigate(`/business-activity/${business_activity.authority.id}`)
         }, 1500)
        } else {
          showToast('error', res.payload|| 'Failed to update')
        }
    })
  }

  return (
    <div>
        {toastData.show && (
              <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                <ToastExample status={toastData.status} message={toastData.message} />
              </div>
            )}
            <BusinessActivityForm initialData={business_activity} onSubmit={handleSubmit} />
    </div>
  

)
}

export default EditBusinessActivity

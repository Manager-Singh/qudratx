import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, } from 'react-router-dom'
import BusinessActivityForm from './BusinessActivityForm'
import { addBusinessActivity } from '../../../../store/admin/businessActivitySlice'
import { getBusinessZonesAuthorityByUuid } from '../../../../store/admin/zoneAuthoritySlice'
import { ToastExample } from '../../../../components/toast/Toast'


const AddBusinessActivity = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uuid } = useParams()
  const { authority } = useSelector((state) => state.businessZonesAuthority)

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
   const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    dispatch(getBusinessZonesAuthorityByUuid({ uuid }))
    
  }, [uuid])

  const handleSubmit = (formData) => {
    const data = {
      ...formData,
      authority_id: authority?.id,
    }
    dispatch(addBusinessActivity(data)).then((res) => {
       if (res.payload?.success) {
          showToast('success', res.payload.message || 'Saved successfully')
       setTimeout(() => {
       navigate(`/business-activity/${authority.uuid}`)
         }, 1500)
        } else {
          showToast('error', res.payload|| 'Failed to save')
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
      <BusinessActivityForm onSubmit={handleSubmit} />

    </div>
  

)}
export default AddBusinessActivity

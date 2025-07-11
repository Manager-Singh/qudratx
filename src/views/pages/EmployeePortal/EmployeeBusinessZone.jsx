import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardBody, CCardTitle } from '@coreui/react'
import { getBusinessZone } from '../../../store/admin/businessZoneSlice'
import { Link } from 'react-router-dom'

function EmployeeBusinessZone() {
  const dispatch = useDispatch()

  const {businesszones} = useSelector((state) => state.businesszone) // adjust if your state shape is different

  useEffect(() => {
    dispatch(getBusinessZone())
  }, [dispatch])

  return (
    <div className="container">
      <h2 className="mb-4">Business Zones</h2>
      <div className="row">
        {businesszones.map((zone) => (
          <Link to={`/create-proposal/${zone.id}`} className="col-md-4 mb-3" key={zone.id}>
            <CCard style={{backgroundColor:"#2f1051" , color:"#ffffde"}}>
              <CCardBody className="text-center">
                <CCardTitle>{zone.name}</CCardTitle>
              </CCardBody>
            </CCard>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default EmployeeBusinessZone

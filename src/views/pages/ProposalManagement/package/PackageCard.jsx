import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { FaCheck } from 'react-icons/fa'

const PackageCard = ({item}) => {
  const features = [
    '250 Subscribers',
    '5 Team Members',
    '5 Metrics',
    'Email Notifications',
    'Basic Customization',
    'Status & Authenticated API',
  ]

  return (
    <div className="package-wrapper">
      <CCard className="rounded-2 overflow-hidden shadow" >
        <CCardHeader className="text-center  text-white py-4" style={{backgroundColor:"#2f1051"}}>
          <h4 className="fw-bold mb-2">{item.name}</h4>
          <h1 className="fw-bold mb-1">{item.total_amount}</h1>
        </CCardHeader>
        <CCardBody className="bg-white p-4">
         
          <CListGroup className="list-unstyled">
            {features.map((feature, index) => (
              <CListGroupItem key={index} className="d-flex gap-2 align-items-center border-0 ps-0">
                <FaCheck className="text-success" />
                {feature}
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PackageCard

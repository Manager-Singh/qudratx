import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { FaCheck, FaTrash, FaEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const PackageCard = ({ item, onDelete }) => {
  return (
    <div className="package-wrapper position-relative">
      <CCard className="rounded-2 overflow-hidden shadow">
        {/* Header */}
        
        <CCardHeader
          className="d-flex justify-content-between align-items-start text-white py-3"
          style={{ backgroundColor: '#2f1051' }}
        >
          
          {/* Left side → Title + Amount */}
          <div className='d-flex align-items-start justify-content-end text-center w-75'>
            <div className='d-flex  flex-column'> <h4 className="fw-bold mb-1">{item.name}</h4>
            <h1 className="fw-bold mb-0" style={{ color: '#ff770f' }}>
              {`AED ${item.total_amount}`}
            </h1></div>
           
            
          </div>
   
          <div className="d-flex gap-2 align-items-center">
            <Link to={`/edit-package/${item.uuid}`} title="Edit Package">
              <FaEdit size={20} style={{ cursor: 'pointer', color: '#fff' }} />
            </Link>
            <FaTrash
              size={18}
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
              title="Delete Package"
              onClick={() => onDelete(item.uuid)}
            />
          </div>
         
        </CCardHeader>

        {/* Body */}
        <CCardBody className="bg-white p-4">
          <p>Activity Offered: {item.activity}</p>
          <CListGroup className="list-unstyled">
            {item.fee_structure?.map((fee, index) => (
              <CListGroupItem
                key={index}
                className="d-flex gap-2 align-items-center border-0 ps-0"
              >
                <FaCheck className="text-success" />
                <span className="text-success">{`AED ${fee.amount}`}</span>
                {` ${fee.name}`}
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default PackageCard

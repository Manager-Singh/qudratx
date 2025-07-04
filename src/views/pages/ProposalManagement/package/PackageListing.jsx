
import {  useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { FaCircle ,FaTrash,} from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { ToastExample } from '../../../../components/toast/Toast'

function PackageListing() {
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()

 const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
 const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

// useEffect(()=>{
// dispatch(getBusinessActivity())
// },[dispatch])
const data = [
  {
    uuid: '1a2b3c4d',
    name: 'Retail Sales',
    description: 'Selling consumer goods in stores.',
    status: 1,
    total_amount: 120000,
    created_at: '2024-11-15T10:30:00Z',
  },
  {
    uuid: '2b3c4d5e',
    name: 'Online Services',
    description: 'Providing services through digital platforms.',
    status: 0,
    total_amount: 75000,
    created_at: '2025-01-10T14:15:00Z',
  },
  {
    uuid: '3c4d5e6f',
    name: 'Consulting',
    description: 'Business strategy and operations advice.',
    status: 1,
    total_amount: 98000,
    created_at: '2025-03-05T09:00:00Z',
  },
  {
    uuid: '4d5e6f7g',
    name: 'Logistics',
    description: 'Transport and supply chain solutions.',
    status: 1,
    total_amount: 200000,
    created_at: '2024-12-20T17:45:00Z',
  },
  {
    uuid: '5e6f7g8h',
    name: 'Marketing',
    description: 'Branding and outreach campaigns.',
    status: 0,
    total_amount: 45000,
    created_at: '2025-02-12T11:20:00Z',
  },
]


const columns = [
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Description',
    selector: row => row.description || '-',
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => (
      <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'}`}>
        {row.status == 1 ? 'Active' : 'Inactive'}
      </span>
    ),
    sortable: true,
  },
  {
    name: 'Total Amount',
    selector: row => row.total_amount ?? '₹0',
    sortable: true,
  },
  {
    name: 'Action',
    cell: row => (
      <div className='d-flex gap-2'>
        <span
          onClick={() => handleDelete(row.uuid)}
          className="p-0"
          title="Delete"
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilTrash} size="lg" />
        </span>
        <Link to={`/edit-business-activities/${row.uuid}`}>
          <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
        </Link>
      </div>
    ),
    ignoreRowClick: true,
    width: '150px',
  },
]

    const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
  );

  const handleDelete =(uuid)=>{
  dispatch(deleteBusinessActivity(uuid)).then((data)=>{
    if (data.payload.success) {
      showToast('success', data.payload.message )
      dispatch(getBusinessActivity())
    }
  })
  }
  
  return (
    <div className='container'>
      {toastData.show && (
              <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                <ToastExample status={toastData.status} message={toastData.message} />
              </div>
            )}
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-package'> <CButton className='custom-button'>Add Package </CButton></Link>
       
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or email"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        // selectableRows
        highlightOnHover
        responsive
        striped
      />
      
    </div>
   
  )
}

export default PackageListing
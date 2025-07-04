import {  useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { FaCircle ,FaTrash,} from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { deleteBusinessActivity, getBusinessActivity } from '../../../store/admin/businessActivitySlice';
import { ToastExample } from '../../../components/toast/Toast'

function BusinessActivity() {
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()
const {business_activities} = useSelector((state)=>state.business_activity)
 const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
 const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

useEffect(()=>{
dispatch(getBusinessActivity())
},[dispatch])


const columns = [
  
  {
    name: 'Business Activities',
    selector: row => row.name,
    sortable: true,
  },
   {
      name: 'Status',
      selector: row => row.status,
      cell: row => (
        <FaCircle
          color={row.status ? 'green' : 'red'}
          title={row.status ? true : false}
        />
      ),
      sortable: true,
     
    },
  
  {
    name: 'Created At',
    selector: row => new Date(row.created_at).toLocaleString(),
    sortable: true,
  },
  
 {
    name: 'Action',
    cell: row => (
      <div className='d-flex gap-2'>
        <span
  color="light"
  variant="ghost"
  size="sm"
  onClick={() => handleDelete(row.uuid)}
  className="p-0"
  title="Delete"
>
  <CIcon icon={cilTrash} size="lg" />
</span>
    <Link
        to={`/edit-business-activities/${row.uuid}`}
              
            >
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
            </Link>
      
      </div>
     
    ),
    ignoreRowClick: true,
     width: '150px',
  },
];

    const filteredData = business_activities.filter(item =>
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
        <Link to='/add-business-activities'> <CButton className='custom-button'>Add Business Activity </CButton></Link>
       
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

export default BusinessActivity
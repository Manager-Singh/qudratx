import {  useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { deleteBusinessCategory, getBusinessCategories } from '../../../store/admin/businessCategorySlice';
import { ToastExample } from '../../../components/toast/Toast'

function BusinessCategory() {
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()
const {business_categories} = useSelector((state)=>state.business_category)
 const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
 const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

useEffect(()=>{
dispatch(getBusinessCategories())
},[dispatch])


const columns = [
  
  {
    name: 'Business Category',
    selector: row => (
          <Link to={`/business-subcategory/${row.uuid}`} style={{ textDecoration: 'none' }}>
            {row.name}
          </Link>
        ),
    sortable: true,
  },
    {
    name: 'Status',
    selector: row => (
      <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'} `}>
        {row.status == 1 ? 'Active' : 'Inactive'}
      </span>
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
        to={`/edit-business-category/${row.uuid}`}
              
            >
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
            </Link>
      
      </div>
     
    ),
    ignoreRowClick: true,
     width: '150px',
  },
];

    const filteredData = business_categories.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
  );

  const handleDelete =(uuid)=>{
  dispatch(deleteBusinessCategory(uuid)).then((data)=>{
    if (data.payload.success) {
      showToast('success', data.payload.message )
      dispatch(getBusinessCategories())
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
        <Link to='/add-business-category'> <CButton className='custom-button'>Add Business Category </CButton></Link>
       
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

export default BusinessCategory
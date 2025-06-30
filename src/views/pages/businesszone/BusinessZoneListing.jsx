import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { deleteBusinessZone, getBusinessZone } from '../../../store/admin/businessZoneSlice';
import { MdEdit } from "react-icons/md";

function BusinessZone() {
  const dispatch= useDispatch()

const {businesszones}=useSelector((state)=>state.businesszone)

function handleDelete(uuid){

dispatch(deleteBusinessZone(uuid)).then((data)=>{
  if(data.payload.success){
    dispatch(getBusinessZone())
     }
})
}
useEffect(()=>{
  if (!businesszones || businesszones.length <1) {
     dispatch(getBusinessZone())
  }
 
},[dispatch])



const columns = [
  
  {
    name: 'BusinessZone',
    selector: row => row.name,
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
  to={`/edit-businesszone/${row.uuid}`}
  style={{ backgroundColor: 'transparent', padding: 0 }}
  title="Edit"
>
  <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
</Link>
      
      </div>
     
    ),
    ignoreRowClick: true,
     width: '150px',
  },
];

  const [filterText, setFilterText] = useState('');
 

  const filteredData = businesszones.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
   
  );

  return (
     <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-businesszone'> <CButton className='custom-button'>Add businessZone</CButton></Link>
       
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

export default BusinessZone
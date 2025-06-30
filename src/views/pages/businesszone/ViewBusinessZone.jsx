
import { Link, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getBusinessZonesAuthorities, getBusinessZonesAuthorityByZoneId } from '../../../store/admin/zoneAuthoritySlice'
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { MdEdit } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { getBusinessZoneByUuid } from '../../../store/admin/businessZoneSlice'

function ViewBusinessZone() {
    const {uuid} = useParams()
    
   const [name,setName]= useState('')
   const [error,setError]= useState('')
   const dispatch = useDispatch()
    const [filterText, setFilterText] = useState('');
  const {authorities}= useSelector((state)=>state.businessZonesAuthority)
  const {businesszone ,isLoading} =useSelector((state)=>state.businesszone) 

useEffect(()=>{
  dispatch(getBusinessZoneByUuid(uuid))
},[])

useEffect(() => {
  if (businesszone ) {
  
    const id = businesszone.id
    dispatch(getBusinessZonesAuthorityByZoneId({id}))
      
  }
}, [businesszone, dispatch]);
   

  const columns = [
  {
    name: 'Authority Zones',
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
  // to={`/edit-businesszone/${row.uuid}`}
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
const handleDelete= ()=>{

}

const filteredData = authorities.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
  );
  return (
  <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
       
       <div className=' d-flex justify-content-between w-75 px-3 '> 
      <h4>{businesszone?.name}</h4>
       <Link to=''> <CButton className='custom-button'>Add Zone Authority</CButton></Link>
       </div>
        
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

export default ViewBusinessZone
import { Link, useParams } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { CButton, CToaster } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import {  addBusinessZonesAuthority, deleteBusinessZonesAuthority, getBusinessZonesAuthorityByZoneId, updateBusinessZonesAuthority } from '../../../store/admin/zoneAuthoritySlice'
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { MdEdit } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { getBusinessZoneByUuid } from '../../../store/admin/businessZoneSlice'
import AddAuthorityPopUp from './components/AddAuthorityPopUp'




function ViewBusinessZone() {
    const {uuid} = useParams()
    
  const [name,setName]= useState('')
  const dispatch = useDispatch()
  const [filterText, setFilterText] = useState('');
  const {authorities}= useSelector((state)=>state.businessZonesAuthority)
  const {businesszone } =useSelector((state)=>state.businesszone) 
  const [visible,setVisible] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [selectedAuthority,setSelectedAuthority] = useState(null)
  

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
      <div onClick={() => {
    setIsEdit(true);
    setSelectedAuthority(row); // capture the full row
    setName(row.name); // preload the name into input
    setVisible(true);
  }}
  style={{ backgroundColor: 'transparent', padding: 0 }}
  title="Edit"
>
  <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
</div>
      
      </div> 
    ),
    ignoreRowClick: true,
     width: '150px',
  },
];
const handleDelete= (uuid)=>{
dispatch(deleteBusinessZonesAuthority(uuid)).then((data)=>{
  console.log(data,"data")
  if (data.payload.success) {
     const id = businesszone.id
    dispatch(getBusinessZonesAuthorityByZoneId({id}))
  }
})
}

const handleAddAuthority = (e) =>{
e.preventDefault()
const zone_id = businesszone.id
dispatch(addBusinessZonesAuthority({name,zone_id})).then((data)=>{
 
  if (data.payload.success) {
    setName('')
    setVisible(false)
  }
  else{
   console.log(data.payload,"error")
  }
})
}
const handleEditAuthority = (e) =>{

  const updatedData = {
    uuid: selectedAuthority.uuid,
    data: {
      name,
      zone_id: businesszone.id,
    }
  }

dispatch(updateBusinessZonesAuthority(updatedData)).then((data)=>{
 
  if (data.payload.success) {
       setName('')
       setVisible(false)
    
  }
})

e.preventDefault()
}



const filteredData = authorities.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
  );
  return (
  <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
       
       <div className=' d-flex justify-content-between w-75 px-3 '> 
      <h4>{businesszone?.name}</h4>
        <CButton className='custom-button' onClick={()=>setVisible(true)}>Add Zone Authority</CButton>
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
      <AddAuthorityPopUp visible={visible} setVisible={setVisible} handleSubmit={!isEdit ? handleAddAuthority :handleEditAuthority} name={name} setName={setName} isEdit={isEdit} setIsEdit={setIsEdit} 
  setSelectedAuthority={setSelectedAuthority}/>
 
   
    </div>
  )
}

export default ViewBusinessZone
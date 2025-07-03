import {  useEffect, useState } from 'react';
import { CButton,CTooltip } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash,cilDescription } from '@coreui/icons';
import { FaCircle } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import './client-style.css'
import { getClient } from '../../../store/admin/clientSlice';

function ClientListing() {
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()
// const {business_activities} = useSelector((state)=>state.business_activity)
const {clients}= useSelector((state)=>state.client)

useEffect(()=>{
dispatch(getClient()).then((data)=>{
  console.log(data,"data")
})
},[])


const columns = [
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => row.status,
    cell: row => (
      <FaCircle
        color={row.status ? 'green' : 'red'}
        title={row.status ? 'Active' : 'Inactive'}
      />
    ),
    sortable: true,
  },
  {
    name: 'Address',
    selector: row => row.address,
    sortable: true,
  },
  {
    name: 'Email',
    selector: row => row.email,
    sortable: true,
  },
  {
    name: 'Company Name',
    selector: row => row.company_name,
    sortable: true,
  },
  {
    name: 'Notes',
    selector: row => row.notes,
    sortable: false,
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
        <CTooltip content="Generate Lead" placement="top">
      <button className="icon-button">
        <CIcon icon={cilDescription} size="lg" />
      </button>
    </CTooltip>
       
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
        <Link to={`/edit-client/${row.uuid}`}>
          <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
        </Link>
      </div>
    ),
    ignoreRowClick: true,
    width: '150px',
  },
];

   const filteredData = clients.filter(item =>
  item.name.toLowerCase().includes(filterText.toLowerCase()) ||
  item.email?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.address?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.notes?.toLowerCase().includes(filterText.toLowerCase())
);

//   const handleDelete =(uuid)=>{
//   dispatch(deleteBusinessActivity(uuid)).then((data)=>{
//     if (data.payload.success) {
//       dispatch(getBusinessActivity())
//     }
//   })
//   }
  
  return (
    <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-client'> <CButton className='custom-button'>Add Client</CButton></Link>
       
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

export default ClientListing
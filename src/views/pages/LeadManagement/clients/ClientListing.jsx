import {  useEffect, useState } from 'react';
import { CButton,CTooltip } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash,cilDescription } from '@coreui/icons';
import { FaCircle } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import './client-style.css'
import { deleteClient, getClient } from '../../../../store/admin/clientSlice';
import { ToastExample } from '../../../../components/toast/Toast'
import { CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'
import { addLead } from '../../../../store/admin/leadSlice';
import { FaRegEdit } from "react-icons/fa";

function ClientListing() {
const [visible, setVisible] = useState(false)
const navigate = useNavigate()
const [id,setid]= useState('')
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()
const {clients}= useSelector((state)=>state.client)
const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
useEffect(()=>{
dispatch(getClient())
},[])

const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

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
    name: 'phone',
    selector: row => row.phone,
    sortable: true,
  },
  {
    name: 'Company Name',
    selector: row => row.company_name,
    sortable: true,
    width:"140px"
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
      <button className="icon-button"onClick={() => {
  setVisible(true)
  setid(row.id)
}}
>
        <FaRegEdit  style={{ cursor: 'pointer', color: '#333', }} size={20}/>
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

  const handleDelete =(uuid)=>{
  dispatch(deleteClient(uuid)).then((data)=>{
    if (data.payload.success) {
       showToast('success', data.payload.message,'success')     
      dispatch(getClient())
    }
  })
  }

  const handleConfirm = ()=>{
    setVisible(false)
    dispatch(addLead({ client_id:id})).then((data)=>{
      if (data.payload.success){
       const uuid = data.payload.data.uuid
        navigate(`/view-lead/${uuid}`)
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
      
     
 <CModal visible={visible} onClose={() => {setVisible(false); setid('')}}    >
        <CModalHeader>Confirm</CModalHeader>
        <CModalBody>Are you sure you want to create a lead?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleConfirm}>
            Yes, Create
          </CButton>
        </CModalFooter>
      </CModal>
    
    
     
    </div>
   
  )
}

export default ClientListing
import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { FaCircle ,FaTrash,} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmployee, getEmployees } from '../../../store/admin/employeeSlice';
import { Link } from 'react-router-dom';
import { useToast } from '../../../utils/ToastProvider'
import { MdEdit } from "react-icons/md";
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
// Columns for DataTable

function EmployeesListing() {
const { showToast } = useToast()
const dispatch= useDispatch()
const {employees,isLoading}=useSelector((state)=>state.employee)

function handleDelete(uuid){

dispatch(deleteEmployee(uuid)).then((data)=>{
  console.log(data,"deleted data ")
  if(data.payload.success){
    dispatch(getEmployees())
    console.log("employee fetch successfully")
  }
})
}
useEffect(()=>{
  if (!employees || employees.length <1) {
     dispatch(getEmployees())
  }
 
},[dispatch])

const columns = [
  
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Login Status',
    selector: row => row.login_status,
    cell: row => (
      <FaCircle
        color={row.login_status ? 'green' : 'red'}
        title={row.login_status ? 'Logged In' : 'Logged Out'}
      />
    ),
    sortable: true,
   
  },
  {
    name: 'Email',
    selector: row => row.email,
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
        onClick={() => handleDelete(row.uuid)}
        className='p-0'
      >
       <CIcon icon={cilTrash} size="lg" />
      </span>
      <Link
          to={`/edit-employee/${row.uuid}`}
          
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
 

  const filteredData = employees.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-employees'> <CButton className='custom-button'>Add Employee</CButton></Link>
       
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
  );
}

export default EmployeesListing;

import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { FaCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from '../../../store/admin/employeeSlice';
import { Link } from 'react-router-dom';


// Columns for DataTable
const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
    width: '80px',
  },
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
];

function EmployeesListing() {
const dispatch= useDispatch()
const {employees,isLoading}=useSelector((state)=>state.employee)

useEffect(()=>{
  dispatch(getEmployees()).then((data)=>{
    console.log(data,"data")
  })
},[dispatch])


  const [filterText, setFilterText] = useState('');
 

  const filteredData = employees.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.email.toLowerCase().includes(filterText.toLowerCase())
  );
console.log(employees,"employees")
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
        selectableRows
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
}

export default EmployeesListing;

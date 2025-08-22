

import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { FaCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmployee, getEmployees } from '../../../store/admin/employeeSlice';
import { Link } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import CIcon from '@coreui/icons-react';
import { cilTrash , cilBell } from '@coreui/icons';
import { ToastExample } from '../../../components/toast/Toast';
import useConfirm from '../../../components/SweetConfirm/useConfirm';

function EmployeesListing() {
    const confirm = useConfirm(); 
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  const fetchEmployees = (pageNum = page, limit = perPage, searchText = search) => {
    dispatch(getEmployees({ page: pageNum, limit, search: searchText })).then((data) => {
      if (data.payload?.success) {
        setTotal(data?.payload?.totalRecords || 0);
      }
    });
  };

  useEffect(() => {
    fetchEmployees(page, perPage, search);
  }, [page, perPage]);

  const handleDelete = async(uuid,name) => {
     const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the employee "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
       dispatch(deleteEmployee(uuid)).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message);
        fetchEmployees();
      }
    });
    }
   
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // reset to first page on search
    fetchEmployees(1, perPage, value);
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Login Status',
      selector: (row) => row.login_status,
      cell: (row) => (
        <FaCircle
          color={row.login_status ? 'green' : 'red'}
          title={row.login_status ? 'Logged In' : 'Logged Out'}
        />
      ),
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email || 'N/A',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex gap-2">
          <span onClick={() => handleDelete(row.uuid,row.name)} className="p-0">
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <Link to={`/edit-employee/${row.uuid}`}>
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
          </Link>
          <Link to={`/notification-settings/${row.uuid}`}>
            <CIcon icon={cilBell} size="lg" style={{ cursor: 'pointer', color: '#333' }} />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      width: '150px',
    },
  ];

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-employees">
          <CButton className="custom-button">Add Employee</CButton>
        </Link>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={employees || []}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={perPage}
        onChangePage={(pageNum) => setPage(pageNum)}
        onChangeRowsPerPage={(newPerPage, pageNum) => {
          setPerPage(newPerPage);
          setPage(pageNum);
        }}
        highlightOnHover
        responsive
        striped
        noDataComponent="No employees found"
      />
    </div>
  );
}

export default EmployeesListing;

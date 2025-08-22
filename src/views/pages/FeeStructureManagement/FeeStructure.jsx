import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { MdEdit } from 'react-icons/md';
import {
  getFeeStructures,
  deleteFeeStructure
} from '../../../store/admin/feeStructureSlice';
import { ToastExample } from '../../../components/toast/Toast';
import useConfirm from '../../../components/SweetConfirm/useConfirm';

function FeeStructure() {
const confirm =  useConfirm()
  const dispatch = useDispatch();
  const { feestructures } = useSelector((state) => state.feeStructure);

  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  // Toast state
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  // Fetch fee structures from API
  const fetchFeeStructures = (pageNum = page, limit = perPage, searchText = search) => {
    dispatch(getFeeStructures({ page: pageNum, limit, search: searchText })).then((res) => {
      if (res.payload?.success) {
        setTotal(res.payload.totalRecords || 0);
      }
    });
  };

  useEffect(() => {
    fetchFeeStructures(page, perPage, search);
  }, [page, perPage]);

  const handleDelete = async(uuid,name) => {
    const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the fee "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
       dispatch(deleteFeeStructure(uuid)).then((res) => {
      if (res.payload?.success) {
        showToast('success', 'Fee structure deleted successfully');
        fetchFeeStructures();
      } else {
        showToast('error', 'Failed to delete fee structure');
      }
    });
    }
   
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchFeeStructures(1, perPage, value);
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => `AED ${row.amount}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'} `}>
          {row.status == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
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
          <span
            onClick={() => handleDelete(row.uuid,row.name)}
            className="p-0"
            title="Delete"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <Link
            to={`/edit-feestructure/${row.uuid}`}
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

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-feestructure">
          <CButton className="custom-button">Add Fee Structure</CButton>
        </Link>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={feestructures || []}
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
        noDataComponent="No fee structures found"
      />
    </div>
  );
}

export default FeeStructure;

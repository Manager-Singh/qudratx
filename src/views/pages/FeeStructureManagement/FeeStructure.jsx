import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { MdEdit } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';
import {
  getFeeStructures,
  deleteFeeStructure
} from '../../../store/admin/feeStructureSlice';
import { ToastExample } from '../../../components/toast/Toast';

function FeeStructure() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { feestructures } = useSelector((state) => state.feeStructure);
  const [filterText, setFilterText] = useState('');

  // Toast state
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  useEffect(() => {
    if (!feestructures || feestructures.length < 1) {
      dispatch(getFeeStructures());
    }
  }, [dispatch]);

  function handleDelete(uuid) {
    dispatch(deleteFeeStructure(uuid)).then((res) => {
      if (res.payload?.success) {
        dispatch(getFeeStructures());
        showToast('success', 'Fee structure deleted successfully');
      } else {
        showToast(res.payload, 'Failed to delete fee structure');
      }
    });
  }

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => `AED ${row.amount}`,
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
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className='d-flex gap-2'>
          <span
            onClick={() => handleDelete(row.uuid)}
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

  const filteredData = feestructures.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className='container'>
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className='w-100 mb-3 d-flex justify-content-between align-items-center'>
        <Link to='/add-feestructure'>
          <CButton className='custom-button'>Add Fee Structure</CButton>
        </Link>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
}

export default FeeStructure;

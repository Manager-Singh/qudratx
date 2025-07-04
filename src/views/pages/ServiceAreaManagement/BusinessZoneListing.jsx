import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { deleteBusinessZone, getBusinessZone } from '../../../store/admin/businessZoneSlice';
import { MdEdit } from 'react-icons/md';
import { ToastExample } from '../../../components/toast/Toast';

function BusinessZone() {
  const dispatch = useDispatch();

  const { businesszones } = useSelector((state) => state.businesszone);

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => {
      setToastData({ show: false, status: '', message: '' });
    }, 3000);
  };

  function handleDelete(uuid) {
    dispatch(deleteBusinessZone(uuid)).then((data) => {
      if (data.payload?.success) {
        dispatch(getBusinessZone());
        showToast('success', data.payload.message );
      } else {
        showToast('error', data.payload );
      }
    })
  }

  useEffect(() => {
    if (!businesszones || businesszones.length < 1) {
      dispatch(getBusinessZone());
    }
  }, [dispatch]);

const columns = [
  {
    name: 'BusinessZone',
    selector: row => (
      <Link to={`/view-businesszone/${row.uuid}`} style={{ textDecoration: 'none' }}>
        {row.name}
      </Link>
    ),
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
    selector: row => new Date(row.created_at).toLocaleString(),
    sortable: true,
  },
  {
    name: 'Action',
    cell: row => (
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
          to={`/edit-businesszone/${row.uuid}`}
          title="Edit"
          style={{ padding: 0 }}
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
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-businesszone'>
          <CButton className='custom-button'>Add BusinessZone</CButton>
        </Link>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
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

export default BusinessZone;

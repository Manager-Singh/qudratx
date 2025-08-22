import { useEffect, useState, useCallback } from 'react';
import { CButton, CTooltip, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaCircle } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import './client-style.css';
import { deleteClient, getClient } from '../../../../store/admin/clientSlice';
import { ToastExample } from '../../../../components/toast/Toast';
import useConfirm from '../../../../components/SweetConfirm/useConfirm';

function ClientListing() {
 const confirm=  useConfirm()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients, totalCount, loading } = useSelector((state) => state.client);

  // States for pagination + search
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState('');

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  // Fetch clients from server
  const fetchClients = useCallback(() => {
    dispatch(getClient({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDelete = async(uuid,name) => {
    const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the client "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
      dispatch(deleteClient(uuid)).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message, 'success');
        fetchClients();
      }
    });
    }
    
  };

  const handleConfirm = () => {
    setVisible(false);
    navigate(`/create-lead/${id}`);
  };

  const columns = [
    { name: 'Name', selector: (row) => row.name || 'N/A', sortable: true },
    {
      name: 'Status',
      selector: (row) => (row.status ? 'Active' : 'Inactive'),
      cell: (row) => (
        <FaCircle color={row.status ? 'green' : 'red'} title={row.status ? 'Active' : 'Inactive'} />
      ),
      sortable: true,
    },
    { name: 'Address', selector: (row) => row.address || 'N/A', wrap: true, grow: 2, sortable: true },
    { name: 'Email', selector: (row) => row.email || 'N/A', wrap: true, grow: 2, sortable: true },
    { name: 'Phone', selector: (row) => row.phone || 'N/A', sortable: true },
    { name: 'Company Name', selector: (row) => row.company_name || 'N/A', sortable: true, width: '140px' },
    { name: 'Notes', selector: (row) => row.notes || 'N/A', wrap: true, grow: 2 },
    {
      name: 'Created At',
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'),
      sortable: true,
      wrap: true,
      width: '110px',
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex gap-2">
          <CTooltip content="Generate Lead" placement="top">
            <button
              className="icon-button"
              onClick={() => {
                setVisible(true);
                setId(row.uuid);
              }}
            >
              <FaRegEdit style={{ cursor: 'pointer', color: '#333' }} size={20} />
            </button>
          </CTooltip>
          <span onClick={() => handleDelete(row.uuid,row.name)} title="Delete" style={{ cursor: 'pointer' }}>
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

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-client">
          <CButton className="custom-button">Add Client</CButton>
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page when searching
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={clients}
        pagination
        paginationServer
        paginationTotalRows={totalCount}
        onChangePage={(p) => setPage(p)}
        onChangeRowsPerPage={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        progressPending={loading}
        highlightOnHover
        responsive
        striped
      />

      <CModal visible={visible} onClose={() => { setVisible(false); setId(''); }}>
        <CModalHeader>Confirm</CModalHeader>
        <CModalBody>Are you sure you want to create a lead?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleConfirm}>Yes, Create</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default ClientListing;

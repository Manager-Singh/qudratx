import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLead,
  deleteLead,
  getEmployeeLead
} from '../../../../store/admin/leadSlice';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';

function AllLead() {
  const dispatch = useDispatch();
  const { leads, total, isLoading } = useSelector((state) => state.lead);
  const user = useSelector((state) => state.auth.user);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);

  // Pagination and search states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [dispatch, page, limit, search, user.role]);

  const fetchData = () => {
    const params = { page, limit, search };
    if (user.role === 'admin') {
      dispatch(getLead(params));
    } else {
      dispatch(getEmployeeLead(params));
    }
  };

  const confirmDelete = (uuid) => {
    setSelectedUUID(uuid);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deleteLead(selectedUUID)).then(() => {
        fetchData();
      });
    }
    setDeleteModalVisible(false);
    setSelectedUUID(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedUUID(null);
  };

  const columns = [
    {
      name: 'Origin',
      selector: (row) => row.origin || '-',
      sortable: true
    },
    {
      name: 'Lead Status',
      selector: (row) => row.lead_status || '-',
      sortable: true,
      wrap: true,
      grow: 3
    },
    ...(user.role === 'admin'
      ? [
          {
            name: 'Assigned To',
            selector: (row) =>
              row.assignedTo?.name !== null ? row.assignedTo?.name : 'Unassigned',
            sortable: true,
            wrap: true,
            grow: 3
          },
          {
            name: 'Created By',
            selector: (row) => row.createdBy?.name || '-',
            sortable: true,
            wrap: true,
            grow: 3
          }
        ]
      : []),
    {
      name: 'Approval Status',
      selector: (row) => row.approval_status || '-',
      sortable: true,
      wrap: true,
      grow: 3
    },
    {
      name: 'Status',
      selector: (row) => (
        <span
          className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'} `}
        >
          {row.status == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true
    },
    {
      name: 'Created At',
      selector: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : '-',
      sortable: true,
      grow: 3
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to="/business-zones"
            state={{ lead: row }}
            title="Create Proposal"
          >
            <FaRegEdit style={{ cursor: 'pointer', color: '#333' }} size={20} />
          </Link>
          <Link title="View Lead">
            <FaEye style={{ cursor: 'pointer', color: '#333' }} size={20} />
          </Link>
          <span
            onClick={() => confirmDelete(row.uuid)}
            title="Delete Lead"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
        </div>
      ),
      ignoreRowClick: true,
      width: '120px'
    }
  ];

  return (
    <div className="container">
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-lead">
          <CButton className="custom-button">Add Lead</CButton>
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={leads}
        pagination
        paginationServer
        paginationTotalRows={total}
        onChangeRowsPerPage={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onChangePage={(newPage) => setPage(newPage)}
        highlightOnHover
        responsive
        striped
        progressPending={isLoading}
        noDataComponent="No leads found"
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this lead?"
      />
    </div>
  );
}

export default AllLead;

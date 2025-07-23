import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';
import { GetMyProposal } from '../../../../store/admin/proposalSlice';

function AllProposals() {
  const dispatch = useDispatch();
  const { proposals, isLoading } = useSelector(state => state.proposal);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(GetMyProposal()).then((data)=>{
      console.log(data,"data")
    });
  }, [dispatch]);

  const filteredData = proposals?.filter(item =>
    item.uuid?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.origin?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.created_status?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.lead_status?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.approval_status?.toLowerCase().includes(filterText.toLowerCase())
  ) || [];

  const confirmDelete = (uuid) => {
    setSelectedUUID(uuid);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deleteProposal(selectedUUID)).then(() => {
        dispatch(GetMyProposal());
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
      selector: row => row.origin || '-',
      sortable: true,
    },
    {
      name: 'Created Status',
      selector: row => row.created_status || '-',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Lead Status',
      selector: row => row.lead_status || '-',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Assigned To',
      selector: row => row.assignedTo?.name !== null ? row.assignedTo?.name : 'Unassigned',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Assigned By',
      selector: row => row.assignedBy?.name !== null ? row.assignedBy?.name : '-',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Created By',
      selector: row => row.createdBy?.name || '-',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Approval Status',
      selector: row => row.approval_status || '-',
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Status',
      selector: row => (
        <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'}`}>
          {row.status == 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.created_at ? new Date(row.created_at).toLocaleString() : '-',
      sortable: true,
      grow: 3,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex gap-2">
          <Link to={`/proposals/${row.uuid}`} title="View Proposal">
            <FaEye style={{ cursor: 'pointer', color: '#333' }} size={20} />
          </Link>
          <span
            onClick={() => confirmDelete(row.uuid)}
            title="Delete Proposal"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <ConfirmDeleteModal
            visible={deleteModalVisible}
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Confirm Delete"
            message="Are you sure you want to delete this proposal?"
          />
        </div>
      ),
      ignoreRowClick: true,
      width: '100px',
    },
  ];

  return (
    <div className="container">
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-proposal">
          <CButton className="custom-button">Add Proposal</CButton>
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search proposals..."
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
        progressPending={isLoading}
        noDataComponent="No proposals found"
      />
    </div>
  );
}

export default AllProposals;

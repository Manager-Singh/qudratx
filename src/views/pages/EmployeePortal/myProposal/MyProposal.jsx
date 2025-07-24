import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';
import { deleteProposal, GetAllProposal, GetMyProposal } from '../../../../store/admin/proposalSlice';

function AllProposals() {
  const dispatch = useDispatch();
  const { proposals, isLoading } = useSelector(state => state.proposal);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(GetMyProposal());
  }, [dispatch]);

  const filteredData = proposals?.filter(item =>
    item.uuid?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.zone_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.authority_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.package_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.client_info?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.created_by?.toLowerCase().includes(filterText.toLowerCase()) ||
    (item.approval_status === 1 ? 'approved' : 'unapproved').includes(filterText.toLowerCase())
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
const ExpandedRow = ({ data }) => (
  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <span className="fw-medium">Last Updated: </span>
      <span>
        {data.last_update
          ? new Date(data.last_update).toLocaleString()
          : 'Not updated'}
      </span>
    </div>
  </div>
);

  const columns = [
    {
      name: 'Business Zone',
      selector: row => row.zone_name || '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'Business Authority',
      selector: row => row.authority_name || '-',
      sortable: true,
    minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Package',
      selector: row => row.package_name || '-',
      sortable: true,
      minWidth: '100px',
      wrap: true,
    },
    {
      name: 'Client Name',
      selector: row => row.client_info?.name || '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
  {
  name: 'Proposal Status',
  selector: row => {
    const step = row.step?.toString()?.trim();

    if (step === 'last_step') return 'Completed';
    const stepNumber = parseInt(step, 10); // convert to number
    if (!isNaN(stepNumber) && stepNumber < 10) return 'Draft';

    return '-';
  },
  sortable: true,
  minWidth: '130px',
  wrap: true,
},

    {
      name: 'Total Amount',
      selector: row => row.total_amount ? `AED ${row.total_amount}` : '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'Approval Status',
      selector: row => {
        if (row.approval_status === 1) return 'Approved';
        if (row.approval_status === 0) return 'Unapproved';
        return '-';
      },
      sortable: true,
     minWidth: '160px',
    },
    {
      name: 'Created At',
      selector: row => row.created_at ? new Date(row.created_at).toLocaleString() : '-',
      sortable: true,
      grow: 3,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <Link to={`/create-proposal/${row.uuid}`}  title="View Proposal">
            <FaEye style={{ cursor: 'pointer', color: '#333' }} size={20} />
          </Link>
          <span
            onClick={() => confirmDelete(row.uuid)}
            title="Delete Proposal"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
        </div>
      ),
      ignoreRowClick: true,
      width: '120px',
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
        expandableRows
        expandableRowsComponent={ExpandedRow}
        expandOnRowClicked
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this proposal?"
      />
    </div>
  );
}

export default AllProposals;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';
import { deleteProposal, GetMyProposal } from '../../../../store/admin/proposalSlice';

function AllProposals() {
  const dispatch = useDispatch();
  const { proposals, isLoading } = useSelector(state => state.proposal);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(GetMyProposal());
  }, [dispatch]);

  const filteredData = proposals?.filter(item => {
  const lowerFilter = filterText.toLowerCase();

  const packageAmount = item.package_name || '';
  const totalAmount = item.total_amount ? `aed ${item.total_amount}` : '';

  const status = (() => {
    if (item.approval_status === 1) return 'approved';
    if (item.step === 'last_step') return 'waiting for send approval';
    if (item.step === 'completed') return 'unapproved';
    if (item.step) return 'draft';
    return '';
  })();

  const createdAt = item.created_at
    ? new Date(item.created_at).toLocaleString().toLowerCase()
    : '';

  return (
    (item.zone_name || '').toLowerCase().includes(lowerFilter) ||
    (item.authority_name || '').toLowerCase().includes(lowerFilter) ||
    packageAmount.toLowerCase().includes(lowerFilter) ||
    totalAmount.toLowerCase().includes(lowerFilter) ||
    (item.client_info?.name || '').toLowerCase().includes(lowerFilter) ||
    status.includes(lowerFilter) ||
    createdAt.includes(lowerFilter)
  );
}) || [];



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
      <span className="fw-medium">Reason for unapprove:</span>
      <span>
        {data.reason
          ? data.reason
          : 'N/A'}
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
    // Combined column: Package name and Total Amount together
    name: 'Package & Amount',
    selector: row => {
      const packageName = row.package_name || '-';
      const totalAmount = row.total_amount ? `AED ${row.total_amount}` : '-';
      return `${packageName} / ${totalAmount}`;
    },
    sortable: true,
    minWidth: '150px',
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
    // Combined column: Proposal and Approval status
    name: 'Status',
    selector: row => {
      // Priority: if approval_status is 1, we show "Approved"
      if (row.approval_status === 1) {
        return 'Approved';
      }
      if (row.approval_status === 0) {
        return 'UnApproved';
      }
      //  if (row.approval_status === 2) {
      //   return 'Pending';
      // }
      if (row.employee_approval == 1) {
        return ' Approval Pending';
      }
      if (row.step) {
        if (row.step === 'last_step') {
          return 'Waiting for Send Approval';
        }
        else {
          return 'Draft';
        }
      }
      return '-';
    },
    sortable: true,
    minWidth: '150px',
    wrap: true,
  },
  {
    name: 'Created At',
    selector: row => (row.created_at ? new Date(row.created_at).toLocaleString() : '-'),
    sortable: true,
    grow: 3,
  },
  {
    name: 'Actions',
    cell: row => (
      <div className="d-flex gap-2">
        <Link to={`/proposal/${row.uuid}`} title="View Proposal">
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
        <Link to="/business-zones">
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

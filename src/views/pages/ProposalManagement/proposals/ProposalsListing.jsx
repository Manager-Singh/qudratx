import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilCaretBottom } from '@coreui/icons'
import { FaEye } from 'react-icons/fa'
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal'
import {
  deleteProposal,
  GetAllProposal,
  updateTrackingStatus,
} from '../../../../store/admin/proposalSlice'
import { approveProposalStatus } from '../../../../store/admin/proposalSlice'
import './ProposalsListing.css'
import DisapproveProposalModal from '../components/DisapproveProposalModal'
import { getNotifications, readNotification } from '../../../../store/admin/notificationSlice'
import { FaRegEdit } from "react-icons/fa";
import { getDashboardData } from '../../../../store/admin/dashboardSlice'
function AllProposals() {
  const dispatch = useDispatch()
  const { proposals, isLoading } = useSelector((state) => state.proposal)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedUUID, setSelectedUUID] = useState(null)
  const [filterText, setFilterText] = useState('')

  // manage aprove / disapprove proposal status
  const [approvalModalVisible, setApprovalModalVisible] = useState(false)
  const [selectedApprovalUUID, setSelectedApprovalUUID] = useState(null)
  const [approvalAction, setApprovalAction] = useState(null) // 'approve' or 'disapprove'
  const [openDropdownUUID, setOpenDropdownUUID] = useState(null)

  const [disapprovalMessage, setDisapprovalMessage] = useState('')
   const [totalRecords,setTotalRecords] = useState('')
  
 const [page, setPage] = useState(1)
 const [limit, setLimit] = useState(10) 


  useEffect(()=>{
    const data ={
      type:"proposal"
    }
  dispatch(readNotification(data)).then((data)=>{
    console.log(data)
    if (data.payload.success) {
      dispatch(getDashboardData())
    }
  })
 },[])

 useEffect(() => {
    dispatch(GetAllProposal({ page, limit, search: filterText })).then((data)=>{
  
    if (data.payload.success) {
            setTotalRecords(data?.payload?.totalRecords)
          }
          
    })
  }, [dispatch, page, limit, filterText])

 
  const confirmDelete = (uuid) => {
    setSelectedUUID(uuid)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deleteProposal(selectedUUID)).then(() => {
       dispatch(GetAllProposal({ page, limit, search: filterText })).then((data)=>{
    
       if (data.payload.success) {
            setTotalRecords(data?.payload?.totalRecords)
          }
    })
      })
    }
    setDeleteModalVisible(false)
    setSelectedUUID(null)
  }

  const handleCancelDelete = () => {
    setDeleteModalVisible(false)
    setSelectedUUID(null)
  }

  const confirmApproval = (uuid, action) => {
    setSelectedApprovalUUID(uuid)
    setApprovalAction(action)
    if (action === 'unapprove') {
      setDisapprovalMessage('') // clear previous message
    }
    setApprovalModalVisible(true)
  }

  const handleConfirmApproval = () => {
    if (selectedApprovalUUID && approvalAction) {
      const payload = {
        uuid: selectedApprovalUUID,
        action: approvalAction,
      }

      if (approvalAction === 'unapprove') {
        payload.reason = disapprovalMessage // ✅ Only send reason on unapprove
      }

      dispatch(approveProposalStatus(payload))
        .unwrap()
        .then(() => {
          dispatch(dispatch(GetAllProposal({ page, limit, search: filterText })).then((data)=>{
    
       if (data.payload.success) {
            setTotalRecords(data?.payload?.totalRecords)
          }
    }))
        })
        .catch((error) => {
          console.error('Approval API error:', error)
        })
    }

    // Reset modal state
    setApprovalModalVisible(false)
    setSelectedApprovalUUID(null)
    setApprovalAction(null)
    setDisapprovalMessage('')
  }

  const handleCancelApproval = () => {
    setApprovalModalVisible(false)
    setSelectedApprovalUUID(null)
    setApprovalAction(null)
  }

  const columns = [
{
  name: 'Approval Status',
  cell: (row) => {
    const isPending = row.approval_status === 2
    const isApproved = row.approval_status === 1

    const currentValue = isPending ? 'Pending' : isApproved ? 'Approved' : 'Unapproved'

    return (
      <select
        className="form-select form-select-sm custom-tracking-select"
        style={{
          width: '162px',
          padding: '6px 12px',
          borderRadius: '0.375rem',
          border: '1px solid #ccc',
          backgroundColor: isApproved ? '#d4edda' : isPending ? '#fff3cd' : '#fff9db',
          color: isApproved ? '#155724' : isPending ? '#856404' : '#b58900',
          fontWeight: 500,
        }}
        value={currentValue}
        onChange={(e) => {
          const selected = e.target.value
          const newStatus = selected === 'Approved' ? 'approve' : 'unapprove'
          confirmApproval(row.uuid, newStatus)
        }}
      >
        {/* Show "Pending" as disabled option if status is pending */}
        {isPending && (
          <option value="Pending" disabled>
            Pending
          </option>
        )}
        <option value="Approved">Approved</option>
        <option value="Unapproved">Unapproved</option>
      </select>
    )
  },
  sortable: true,
  grow: 5,
},
    {
      name: 'Proposal No.',
      selector: (row) => row.proposal_number || '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'Business Zone',
      selector: (row) => row.zone_name || '-',
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'Business Authority',
      selector: (row) => row.authority_name || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Package',
      selector: (row) => row.package_name || '-',
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Total Amount',
      selector: (row) => (row.total_amount ? `AED ${row.total_amount}` : '-'),
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'Created By',
      selector: (row) => row?.creator?.name || '-',
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Created At',
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'),
      sortable: true,
      minWidth: '170px',
    },
   {
  name: 'Tracking Status',
  cell: (row) => {
    const StatusDropdownWithModal = () => {
      const dispatch = useDispatch();
      const [approvalModalVisible, setApprovalModalVisible] = useState(false);
      const [selectedStatus, setSelectedStatus] = useState(row?.proposal_status || 'Proposal Sent');
      const [approvalAction, setApprovalAction] = useState('');

      // Do NOT include "Proposal Sent" here — it's just default, not an option
      const statusOptions = [
        'Client Reviewing',
        'Follow-up Required',
        'Proposal Accepted',
        'Proposal Rejected',
      ];

      useEffect(() => {
        setSelectedStatus(row?.proposal_status || 'Proposal Sent');
      }, [row?.proposal_status]);

      const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        setApprovalAction('change status');
        setApprovalModalVisible(true);
      };

      const handleConfirmApproval = () => {
        dispatch(updateTrackingStatus({ uuid: row.uuid, proposal_status: selectedStatus }))
          .unwrap()
          .then(() => {
            dispatch(GetAllProposal());
          })
          .catch((err) => {
            console.error('Tracking status update error:', err);
          });
        setApprovalModalVisible(false);
      };

      const handleCancelApproval = () => {
        setApprovalModalVisible(false);
      };

      const getConfirmColor = (action) => {
        return action.includes('Rejected') ? 'danger' : 'primary';
      };

 
      return (
        <>
          <select
            className="form-select form-select-sm custom-tracking-select"
            style={{
              width: '162px',
              padding: '6px 12px',
              borderRadius: '0.375rem',
              border: '1px solid #ccc',
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              fontWeight: 500,
            }}
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            {/* If current status is "Proposal Sent", show it as the first option but disabled */}
            {selectedStatus === 'Proposal Sent' && (
              <option value="Proposal Sent" disabled>
                Proposal Sent
              </option>
            )}
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>

          <ConfirmDeleteModal
            visible={approvalModalVisible}
            onConfirm={handleConfirmApproval}
            onCancel={handleCancelApproval}
            message={`Are you sure you want to change status to "${selectedStatus}"?`}
            title="Confirm Status Change"
            confirmLabel="Confirm"
            confirmColor={getConfirmColor(selectedStatus)}
          />
        </>
      );
    };

    return <StatusDropdownWithModal />;
  },
  sortable: true,
  minWidth: '200px',
}
,
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link to={`/proposal/${row.uuid}`} state={{ proposal: row }} title="View Proposal">
            
            <FaRegEdit style={{ cursor: 'pointer', color: '#333' }} size={20}/>
          </Link>
          <Link to={`/view-proposal/${row.uuid}`} state={{ proposal: row }} title="View Proposal">
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
  ]

  // handle confirm model button color for approve and disapprove
  const getConfirmColor = (action) => {
    if (!action) return 'primary' // fallback color

    switch (action.toLowerCase()) {
      case 'approve':
        return 'success' // green
      case 'disapprove':
        return 'warning' // yellow
      default:
        return 'danger' // red
    }
  }

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
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
        progressPending={isLoading}
        noDataComponent="No proposals found"
      /> */}
      <DataTable
  columns={columns}
  data={proposals}
  pagination
  paginationServer
  paginationTotalRows={totalRecords}
  paginationDefaultPage={page}
  onChangePage={(p) => setPage(p)}
  onChangeRowsPerPage={(newLimit) => {
    setLimit(newLimit) // ✅ works now
    setPage(1) // reset to first page
  }}
  highlightOnHover
  responsive
  striped
  progressPending={isLoading}
  noDataComponent="No proposals found"
/>
      {/* To confirm delete  */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this proposal?"
      />

      {/* for confirmation of approval / disapproval */}
      {/* <ConfirmDeleteModal
        visible={approvalModalVisible}
        onConfirm={handleConfirmApproval}
        onCancel={handleCancelApproval}
        message={`Are you sure you want to ${approvalAction} this proposal?`}
        title={`${approvalAction}`}
        confirmLabel={approvalAction ? approvalAction.charAt(0).toUpperCase() + approvalAction.slice(1) : 'Confirm'}
        confirmColor={getConfirmColor(approvalAction)}
      /> */}
      {approvalAction === 'unapprove' ? (
        <DisapproveProposalModal
          visible={approvalModalVisible}
          onCancel={handleCancelApproval}
          onConfirm={handleConfirmApproval}
          message={disapprovalMessage}
          onMessageChange={setDisapprovalMessage}
        />
      ) : (
        <ConfirmDeleteModal
          visible={approvalModalVisible}
          onConfirm={handleConfirmApproval}
          onCancel={handleCancelApproval}
          message={`Are you sure you want to approve this proposal?`}
          title="Approve Proposal"
          confirmLabel="Approve"
          confirmColor="success"
        />
      )}
    </div>
  )
}

export default AllProposals

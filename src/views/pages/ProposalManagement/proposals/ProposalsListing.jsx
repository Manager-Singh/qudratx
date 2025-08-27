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
import {readNotification } from '../../../../store/admin/notificationSlice'
import { FaRegEdit } from "react-icons/fa";
import { getDashboardData } from '../../../../store/admin/dashboardSlice'
import { useSearchParams } from "react-router-dom"
import useConfirm from '../../../../components/SweetConfirm/useConfirm'
import Swal from 'sweetalert2';
// Optional: If you want to use React components inside your alert
import withReactContent from 'sweetalert2-react-content';
import { fetchReasons } from '../../../../store/admin/reasonSlice'

// Then create the MySwal instance if you need it
const MySwal = withReactContent(Swal);
function AllProposals() {
  const confirm = useConfirm(); 
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch()
  const { proposals, isLoading } = useSelector((state) => state.proposal)
  const [filterText, setFilterText] = useState('')
  const {reasons}= useSelector((state)=>state.reasons)
  // manage aprove / disapprove proposal status
  const [approvalModalVisible, setApprovalModalVisible] = useState(false)
  const [selectedApprovalUUID, setSelectedApprovalUUID] = useState(null)
  const [approvalAction, setApprovalAction] = useState(null) // 'approve' or 'disapprove'
  const {user} = useSelector((state)=>state.auth)

  const [disapprovalMessage, setDisapprovalMessage] = useState('')
   const [totalRecords,setTotalRecords] = useState('')
  
 const [page, setPage] = useState(1)
 const [limit, setLimit] = useState(10) 
 const [status ,setStatus]= useState(searchParams.get("search") || "")

  useEffect(()=>{
    const data ={
      type:"proposal"
    }
  dispatch(readNotification(data)).then((data)=>{
    
    if (data.payload.success) {
      dispatch(getDashboardData())
    }
  })
 },[])

 useEffect(() => {
    dispatch(GetAllProposal({ page, limit, search: filterText || status})).then((data)=>{
  
    if (data.payload.success) {
            setTotalRecords(data?.payload?.totalRecords)
          }
          
    })
  }, [dispatch, page, limit, filterText,status])


 
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
const handleDelete =async(uuid,name)=>{
const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the proposal "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
         dispatch(deleteProposal(uuid)).then(() => {
       dispatch(GetAllProposal({ page, limit, search: filterText })).then((data)=>{
    
       if (data.payload.success) {
            setTotalRecords(data?.payload?.totalRecords)
          }
    })
      })
    }
}
const handleApproval= (uuid , status,reason)=>{
 const payload = {
        uuid ,
        action: status,
      }
      console.log(uuid ,"uuid",status,"status",reason,"resaon")
      if (status === 'unapprove') {
        payload.reason = reason // ✅ Only send reason on unapprove
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


   
useEffect(()=>{
dispatch(fetchReasons())
},[dispatch])



const ExpandedComponent = ({ data }) => {
  const clientInfo = data.client_info;
 

  const cardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    border: '1px solid #dee2e6',
    display: 'grid',
    gridTemplateColumns: '0.5fr 1fr', // Creates a two-column layout
    gap: '20px'
  };

  const detailBlockStyle = {
    lineHeight: '1.6'
  };

  const headingStyle = {
    borderBottom: '2px solid #4a148c', // A nice accent color
    paddingBottom: '8px',
    marginBottom: '12px',
    color: '#4a148c'
  };
   const EmployeeReason = reasons.filter((item)=> item.modelId == data.id && item.userId != user.id && item.model == "Proposal")
   const MyReason = reasons.filter((item)=> item.modelId == data.id && item.userId == user.id && item.model == "Proposal")
  return (
    <div style={cardStyle}>
     { EmployeeReason[0]?.reason &&   <div>
    <h5 style={headingStyle}>Reasons for Resend Approval</h5>
    <p>{EmployeeReason[0]?.reason} </p>
   </div>}
 {
      MyReason[0]?.reason &&  <div>
    <h5 style={headingStyle}>Reasons for UnApproval</h5>
    <p>{MyReason[0]?.reason} </p>
   </div>
 }

  
      <div style={detailBlockStyle}>
        <h5 style={headingStyle}>Client Details</h5>
        {clientInfo ? (
          <>
            <p><strong>Name:</strong> {clientInfo.name || 'N/A'}</p>
            <p><strong>Email:</strong> {clientInfo.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {clientInfo.phone || 'N/A'}</p>
            <p><strong>Notes:</strong> {clientInfo.notes || 'No notes provided.'}</p>
          </>
        ) : (
          <p>No client details available.</p>
        )}
      </div>

      {/* Lead Details Section */}
      <div style={detailBlockStyle}>
        <h5 style={headingStyle}>Lead Details</h5>
        {data?.lead_id ? (
          <>
            {/* Example fields - adjust based on your actual lead data structure */}
            <p><strong>Lead Id:</strong> {data?.lead_id || 'N/A'}</p>
            
          </>
        ) : (
          <p>No lead associated with this proposal.</p>
        )}
      </div>
    </div>
  );
};

  const columns = [
{
  name: 'Approval Status',
  cell: (row) => {
    // Helper booleans for status checks
    const isPending = row.approval_status === 2;
    const isApproved = row.approval_status === 1;
    const isUnapproved = !isPending && !isApproved;

  
    const currentValue = isPending ? 'Pending' : isApproved ? 'Approved' : 'Unapproved';

    // This is the new handler function with SweetAlert integration
    const handleStatusChange = async(e) => {
      const selectedValue = e.target.value;

      if (selectedValue === 'Approved') {
      const isConfirmed = await confirm({
      title: 'Confirm Approve',
      text: `Are you absolutely sure you want to approve the proposal "${row.proposal_number}"?`,
      icon: 'info', // Use a more impactful icon
      confirmButtonText: 'Yes, Approve It!',
    });
    if (isConfirmed) {
        handleApproval(row.uuid, 'approve');
    }
      
      } else if (selectedValue === 'Unapproved') {
    
       Swal.fire({
  title: 'Are you sure you want to unapprove?',
  html: `Please provide a clear reason below.`,
  icon: 'warning', // Adds a warning icon for better visual context
  
  input: 'textarea',
  inputPlaceholder: 'Enter the reason for unapproval here...',
  inputAttributes: {
    'aria-label': 'Type your reason here'
  },
  
  showCancelButton: true,
  confirmButtonText: 'Yes, Unapprove It',
  confirmButtonColor: '#d33',
  cancelButtonText: 'Cancel',

  showLoaderOnConfirm: true,

  // Validate that a reason was entered
  inputValidator: (value) => {
    if (!value) {
      return 'You must provide a reason for unapproval!';
    }
    if (value.length < 10) {
      return 'The reason must be at least 10 characters long.';
    }
  },

          // This function runs after validation passes
          preConfirm: (reason) => {
            // Here, we call your original function but now include the reason
            // You can make this an async call if needed
            
            return handleApproval(row.uuid, 'unapprove', reason);
          },

          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Status Updated',
              text: 'The item has been marked as unapproved.',
              timer: 1500, // Auto-close after 1.5 seconds
              showConfirmButton: false,
            });
          }
          // Note: If the user cancels, the dropdown will visually remain on "Unapproved".
          // The table will correct itself upon the next data refresh.
        });
      }
    };

    return (
      <select
        className="form-select form-select-sm custom-tracking-select"
        style={{
          width: '162px',
          padding: '6px 12px',
          borderRadius: '0.375rem',
          border: '1px solid #ccc',
          backgroundColor: isApproved ? '#d4edda' : isPending ? '#fff3cd' : '#f8d7da',
          color: isApproved ? '#155724' : isPending ? '#856404' : '#721c24',
          fontWeight: 500,
        }}
        value={currentValue}
        onChange={handleStatusChange}
        
      >
        {isPending && <option disabled>Pending</option>}
        {isApproved && <option>Approved</option>}
        {isUnapproved && <option>Unapproved</option>}

        {/* Allow changing to other states */}
        {!isApproved && <option>Approved</option>}
        {!isUnapproved && <option>Unapproved</option>}
      </select>
    );
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
    const StatusDropdown = () => {
      const dispatch = useDispatch();
      const [selectedStatus, setSelectedStatus] = useState(row?.proposal_status || 'Proposal Sent');

      const statusOptions = [
        'Client Reviewing',
        'Follow-up Required',
        'Proposal Accepted',
        'Proposal Rejected',
      ];

      useEffect(() => {
        setSelectedStatus(row?.proposal_status || 'Proposal Sent');
      }, [row?.proposal_status]);

      const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        try {

        const isConfirmed = await confirm({
      title: 'Confirm Status Chnage ',
      text: `Are you absolutely sure you want to chnage  the proposal "${row.proposal_number} tracking status"?`,
      icon: 'question',
      confirmButtonText: 'Yes, update It!',
    });
    if (isConfirmed) {
       await dispatch(updateTrackingStatus({ uuid: row.uuid, proposal_status: newStatus })).unwrap();
    }
         
          // dispatch(GetAllProposal()); // refresh data after update
        } catch (err) {
          console.error('Tracking status update error:', err);
        }
      };

      return (
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
          {/* Show Proposal Sent only if it's the current status */}
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
      );
    };

    return <StatusDropdown />;
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
            // onClick={() => confirmDelete(row.uuid)}
            onClick={() => handleDelete(row.uuid,row.proposal_number)}
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


const handleStatusChange = (e)=>{
  setStatus(e.target.value)
  setFilterText('')
  setPage(1)
}

  return (
    <div className="container">
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/business-zones">
          <CButton className="custom-button">Add Proposal</CButton>
        </Link>
   <div className='d-flex'>
  <select
            className="form-select w-auto me-2"
           value={status}
           onChange={handleStatusChange}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="unapproved">Unapproved</option>
          </select>
        <input
          type="text"
          className="form-control"
          placeholder="Search proposals..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
   </div>
        
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
        expandableRows
      expandableRowsComponent={ExpandedComponent}

/>
      {/* To confirm delete  */}
    

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

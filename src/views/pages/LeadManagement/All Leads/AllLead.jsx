import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom"
import {
  getLead,
  deleteLead,
  getEmployeeLead,
  handleApproveStatus
} from '../../../../store/admin/leadSlice';
import { CButton, CModal, CModalBody, CModalHeader } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import { ToastExample } from '../../../../components/toast/Toast'
import { MdModeEdit } from "react-icons/md";
import { readNotification } from '../../../../store/admin/notificationSlice';
import { getDashboardData } from '../../../../store/admin/dashboardSlice';
import useConfirm from '../../../../components/SweetConfirm/useConfirm';
import { fetchReasons } from '../../../../store/admin/reasonSlice';
import Swal from 'sweetalert2';
function AllLead() {
  const confirm = useConfirm()
   const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
       const showToast = (status, message) => {
         setToastData({ show: true, status, message })
         setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
       }
       const [searchParams] = useSearchParams();
      const navigate = useNavigate()
  const dispatch = useDispatch();
  const { leads, total, isLoading } = useSelector((state) => state.lead);
  const user = useSelector((state) => state.auth.user);
  const {reasons} = useSelector((state)=>state.reasons)

  // Pagination and search states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status ,setStatus]= useState(searchParams.get("search") || "")
  useEffect(() => {
    fetchData();
  }, [dispatch, page, limit, search, user.role ,status]);

  const fetchData = () => {
    const params = { page, limit,search: search || status};
   
    if (user.role === 'admin') {
      dispatch(getLead(params));
    } else {
      dispatch(getEmployeeLead(params));
    }
  };
  useEffect(()=>{
      const data ={
        type:"lead"
      }
    dispatch(readNotification(data)).then((data)=>{
      
      if (data.payload.success) {
        dispatch(getDashboardData())
      }
    })
   },[])
   
useEffect(()=>{
dispatch(fetchReasons())
 
},[dispatch])

 const ExpandedComponent = ({ data }) => {
  const clientInfo = data.Client;
  
  const cardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    border: '1px solid #dee2e6',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    
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
 
  //  const AdminReason = reasons.filter((item)=> item.modelId == data.id && item.userId != user.id && item.model == "Lead")
  //  const MyReason = reasons.filter((item)=> item.modelId == data.id && item.userId == user.id && item.model == "Lead")
   const Reason = reasons.filter((item)=> item.modelId == data.id  && item.model == "Lead")
   
  return (
    <div style={cardStyle}>
      {/* <div>
    <h5 style={headingStyle}>Reasons for UnApproval</h5>
    {AdminReason[0]?.reason ? <p>{AdminReason[0]?.reason} </p> : <p> </p>}
   
   </div>  */}
   {/* {
    MyReason[0]?.reason && <div>
    <h5 style={headingStyle}>Reasons for Resend Approval</h5>
    <p>{MyReason[0]?.reason} </p>
   </div>
   } */}
   {
    Reason[0]?.reason &&  <div>
    <h5 style={headingStyle}>Reasons for UnApprove lead</h5>
    <p>{Reason[0]?.reason} </p>
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

    </div>
  );
};   

 
 const columns = [
 {
          name: 'Lead Number',
          selector: (row) => row.lead_number, 
          sortable: true,
          wrap: true,
          width:"125px"
        },
   ...(user.role === 'admin'
    ? [
       
     {
  name: 'Approval Status',
  cell: (row) => {
    // This component now uses SweetAlert for a consistent UX
    const LeadApprovalDropdown = () => {
      const dispatch = useDispatch();

      // --- State Derivation (No useState needed) ---
      // We derive the current state directly from props to avoid sync issues.
      const isApproved = row.approval_status === 1;
      const isPending = row.approval_status === 2;
      const isUnapproved = row.approval_status === 0;
      
      const currentValue = isApproved ? 'Approved' : isPending ? 'Pending' : 'Unapproved';

      // --- SweetAlert Handler ---
      const handleStatusChange = async (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'Approved') {
          Swal.fire({
            title: 'Confirm Approval',
            text: `Are you sure you want to approve this lead?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Approve It!',
            confirmButtonColor: '#28a745',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(handleApproveStatus({ uuid: row.uuid, data: { action: "approve" } }))
                .unwrap() // Use unwrap to handle promise states
                .then(() => {
                  showToast('success', 'Lead approved successfully');
                  dispatch(getLead({ page, limit }));
                })
                .catch((err) => {
                  showToast('error', err.message || 'Failed to approve lead');
                });
            }
          });

        } else if (selectedValue === 'Unapproved') {
          Swal.fire({
            title: 'Confirm Unapproval',
            text: 'Please provide a reason for unapproval.',
            icon: 'warning',
            input: 'textarea',
            inputPlaceholder: 'Enter the reason here...',
            showCancelButton: true,
            confirmButtonText: 'Confirm Unapproval',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You must provide a reason!';
              }
              if (value.length < 10) {
                return 'Reason must be at least 10 characters long.';
              }
            },
            preConfirm: (reason) => {
              // Dispatch the action within preConfirm to leverage the loader
              return dispatch(handleApproveStatus({ uuid: row.uuid, data: { action: "unapprove", reason } }))
                .unwrap()
                .catch((err) => {
                   Swal.showValidationMessage(`Request failed: ${err.message || 'Server error'}`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              showToast('success', 'Lead unapproved successfully');
              dispatch(getLead({ page, limit }));
            }
          });
        }
      };

      // --- Render JSX ---
      return (
        <select
          className="form-select form-select-sm"
          value={currentValue}
          onChange={handleStatusChange}
          style={{
            width: '162px',
            padding: '6px 12px',
            borderRadius: '0.375rem',
            border: '1px solid #ccc',
            backgroundColor: isApproved ? '#d4edda' : isPending ? '#fff3cd' : '#f8d7da',
            color: isApproved ? '#155724' : isPending ? '#856404' : '#721c24',
            fontWeight: 500,
          }}
        >
          {/* Show the current status as a disabled option */}
          {isPending && <option disabled>Pending</option>}
          {isApproved && <option>Approved</option>}
          {isUnapproved && <option>Unapproved</option>}

          {/* Show other available options */}
          {!isApproved && <option>Approved</option>}
          {!isUnapproved && <option>Unapproved</option>}
        </select>
      );
    };

    return <LeadApprovalDropdown />;
  },
  sortable: true,
  grow: 5,
},
]
    : [
        {
          name: 'Approval Status',
          selector: (row) =>
            row.approval_status == 1
              ? 'Approved'
              : row.approval_status == 2
              ? 'Pending'
              : 'Unapproved',
          sortable: true,
          wrap: true,
          width:"150px"
        },
      ]),


  {
    name: 'Origin',
    selector: (row) => row.origin || '-',
    sortable: true,
    width:"130px"
  },
  {
    name: 'Lead Status',
    selector: (row) => row.lead_status || '-',
    sortable: true,
    wrap: true,
    minWidth:"120px"
   
  },
  ...(user.role === 'admin'
    ? [
        {
          name: 'Assigned To',
          selector: (row) =>
            row.assignedTo?.name !== null ? row.assignedTo?.name : 'Unassigned',
          sortable: true,
          wrap: true,
         width:"120px"
        },
        {
          name: 'Created By',
          selector: (row) => row.createdBy?.name || '-',
          sortable: true,
          wrap: true,
          width:"130px",
        },
      ]
    : []),

  {
    name: 'Status',
    selector: (row) => (
      <span
        className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'} `}
      >
        {row.status == 1 ? 'Active' : 'Inactive'}
      </span>
    ),
    sortable: true,
    width:"90px"
  },
  {
    name: 'Created At',
    selector: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleString() : '-',
    sortable: true,
   wrap:true,
   width:"110px"
  },
 {
  name: 'Action',
  cell: (row) => {
    const handleCreateProposal = () => {
    
      if (
        row.approval_status === 'approved' || 
        row.approval_status === 1 
      ) {
         navigate('/business-zones', { state: { lead: row } });
        return;
      }
      showToast('warning', 'Cannot create proposal before approve lead');
    };

   

    return (
      <div className="d-flex gap-2">
        <FaRegEdit
          onClick={handleCreateProposal}
          title="Create Proposal"
          style={{ cursor: 'pointer', color: '#333' }}
          size={20}
        />
        <Link title="View Lead" to={`/view-lead/${row.uuid}`}>
          <FaEye style={{ cursor: 'pointer', color: '#333' }} size={20} />
        </Link>
         <Link title="edit Lead" to={`/edit-lead/${row.uuid}`}>
         <MdModeEdit style={{ cursor: 'pointer', color: '#333' }} size={20}  />
        </Link>
        <span
          onClick={() => handleDelete(row.uuid,row.lead_number)}
          title="Delete Lead"
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilTrash} size="lg" />
        </span>
      </div>
    );
  },
  ignoreRowClick: true,
  width: '150px',
}

]

const handleStatusChange = (e)=>{
  setStatus(e.target.value)
  setSearch('')
  setPage(1)
}

const handleDelete=async(uuid,name)=>{
const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the Lead "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
        dispatch(deleteLead(uuid)).then(() => {
        fetchData();
    })}
}

  return (
    <div className="container">
       {toastData.show && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                  <ToastExample status={toastData.status} message={toastData.message} />
                </div>
                              )}
                              
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">

        <Link to="/add-lead">
          <CButton className="custom-button">Add Lead</CButton>
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
          className="form-control "
          placeholder="Search leads..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
        />
        </div>
        
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
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandOnRowClicked
      />
     
    </div>
  );
}

export default AllLead;

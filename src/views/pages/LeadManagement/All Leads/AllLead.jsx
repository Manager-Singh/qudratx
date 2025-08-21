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
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';
import { ToastExample } from '../../../../components/toast/Toast'
import { MdModeEdit } from "react-icons/md";
import { readNotification } from '../../../../store/admin/notificationSlice';
import { getDashboardData } from '../../../../store/admin/dashboardSlice';

function AllLead() {
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

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);

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
   

    const confirmApproval = (uuid, action) => {
    setSelectedApprovalUUID(uuid)
    setApprovalAction(action)
    if (action === 'unapprove') {
      setDisapprovalMessage('') // clear previous message
    }
    setApprovalModalVisible(true)
  }
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
    const LeadApprovalDropdown = () => {
      const [selectedStatus, setSelectedStatus] = useState(row.approval_status);
      const [showReasonModal, setShowReasonModal] = useState(false);
      const [reason, setReason] = useState('');
      const dispatch = useDispatch();

      const handleChange = (e) => {
        const value = Number(e.target.value); // always a number
        setSelectedStatus(value);

        if (value === 0) {
          // Unapprove → ask for reason
          setShowReasonModal(true);
        } else if (value === 1) {
          // Approve directly
          dispatch(handleApproveStatus({ uuid: row.uuid, data: { action: "approve" } }))
            .then((data) => {
              if (data.payload.success) {
                showToast('success', 'Lead approved successfully');
                dispatch(getLead({ page, limit }));
              }
            });
        }
      };

      const handleConfirmUnapprove = () => {
        dispatch(handleApproveStatus({ uuid: row.uuid, data: { action: "unapprove", reason } }))
          .then((data) => {
            if (data.payload.success) {
              showToast('success', 'Lead unapproved successfully');
              dispatch(getLead({ page, limit }));
              setShowReasonModal(false);
            }
          });
      };

      return (
        <>
          <select
            className="form-select form-select-sm"
            value={selectedStatus}
            onChange={handleChange}
            style={{
              width: '162px',
              padding: '6px 12px',
              borderRadius: '0.375rem',
              border: '1px solid #ccc',
              backgroundColor:
                selectedStatus === 1
                  ? '#d4edda'
                  : selectedStatus === 2
                  ? '#fff3cd'
                  : '#fff9db',
              color:
                selectedStatus === 1
                  ? '#155724'
                  : selectedStatus === 2
                  ? '#856404'
                  : '#b58900',
              fontWeight: 500,
            }}
          >
            {selectedStatus === 2 && (
              <option value={2} disabled>
                Pending
              </option>
            )}
            <option value={1}>Approved</option>
            <option value={0}>Unapproved</option>
          </select>

          {/* Reason Modal */}
          <CModal
            visible={showReasonModal}
            onClose={() => setShowReasonModal(false)}
          >
            <CModalHeader>
              <h5>Reason for Unapproval</h5>
            </CModalHeader>
            <CModalBody>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="mt-3 d-flex justify-content-end gap-2">
                <CButton
                  color="secondary"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancel
                </CButton>
                <CButton color="danger" onClick={handleConfirmUnapprove}>
                  Confirm Unapproval
                </CButton>
              </div>
            </CModalBody>
          </CModal>
        </>
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
          onClick={() => confirmDelete(row.uuid)}
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
            <option value="">All Statuses</option>
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

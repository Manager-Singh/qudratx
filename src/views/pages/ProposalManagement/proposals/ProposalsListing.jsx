import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CButton , 
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge, } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash , cilCaretBottom } from '@coreui/icons'
import { FaEye } from 'react-icons/fa'
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal'
import { deleteProposal, GetAllProposal } from '../../../../store/admin/proposalSlice'
import { approveProposalStatus } from '../../../../store/admin/proposalSlice'
import "./ProposalsListing.css";

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

  useEffect(() => {
    dispatch(GetAllProposal())
  }, [dispatch])

  const filteredData =
    proposals?.filter(
      (item) =>
        item.uuid?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.zone_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.authority_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.package_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.client_info?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.created_by?.toLowerCase().includes(filterText.toLowerCase()) ||
        (item.approval_status === 1 ? 'approved' : 'unapproved').includes(filterText.toLowerCase()),
    ) || []

  const confirmDelete = (uuid) => {
    setSelectedUUID(uuid)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deleteProposal(selectedUUID)).then(() => {
        dispatch(GetAllProposal())
      })
    }
    setDeleteModalVisible(false)
    setSelectedUUID(null)
  }

  const handleCancelDelete = () => {
    setDeleteModalVisible(false)
    setSelectedUUID(null)
  }

  //approval confirmation
  const confirmApproval = (uuid, action) => {
    setSelectedApprovalUUID(uuid)
    setApprovalAction(action)
    setApprovalModalVisible(true)
  }

  // const handleConfirmApproval = () => {
  //   if (selectedApprovalUUID && approvalAction === 'approve') {
  //     dispatch(approveProposalStatus(selectedApprovalUUID)).then(() => {
  //       dispatch(GetAllProposal())
  //     })
  //   }
  //   // For disapprove, you can implement another API if available
  //   setApprovalModalVisible(false)
  //   setSelectedApprovalUUID(null)
  //   setApprovalAction(null)
  // }
const handleConfirmApproval = () => {
  if (selectedApprovalUUID && approvalAction) {
    dispatch(approveProposalStatus({ uuid: selectedApprovalUUID, action: approvalAction }))
      .then(() => {
        dispatch(GetAllProposal());
      });
  }
  setApprovalModalVisible(false);
  setSelectedApprovalUUID(null);
  setApprovalAction(null);
};



  const handleCancelApproval = () => {
    setApprovalModalVisible(false)
    setSelectedApprovalUUID(null)
    setApprovalAction(null)
  }

  const columns = [
 {
  name: 'Approval Status',
  cell: (row) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const isApproved = row.approval_status === 1
    const nextStatus = isApproved ? 'disapprove' : 'approve'

    // to track the click on dropdown
    const [dropClick , setDropClick] = useState(false)

    useEffect(()=>{
      setDropdownOpen(!dropdownOpen)
    }, [dropClick])

    return (
      <CDropdown
        className="d-inline-block"
        onVisibleChange={(visible) => setDropdownOpen(visible)}
        onClick={ () => setDropClick(!dropClick)}
      >
        <CDropdownToggle
          color="transparent"
          className="border-0 bg-transparent p-0 d-flex align-items-center gap-2"
          caret={false}
        >
          <CBadge
            color={isApproved ? 'success' : 'warning'}
            className="text-white text-capitalize px-3 py-2 d-flex align-items-center gap-1"
          >
            {isApproved ? 'Approved' : 'Unapproved'}
            <CIcon
              icon={cilCaretBottom}
              className={`transition-icon ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </CBadge>
        </CDropdownToggle>

        <CDropdownMenu  style={{ minWidth: '120px'}}>
          <CDropdownItem
            onClick={() => confirmApproval(row.uuid, nextStatus)}
            className={`text-white rounded drop-button  ${
              isApproved ? 'bg-warning' : 'bg-success'
            }`}
            style={{ fontWeight: '400', cursor:"pointer" }}
          >
            {isApproved ? 'Disapprove' : 'Approve'}
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
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
      selector: (row) => row.created_by || '-',
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
      name: 'Actions',
      cell: (row) => (
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
        </div>
      ),
      ignoreRowClick: true,
      width: '120px',
    },
  ]

  // handle confirm model button color for approve and disapprove
  const getConfirmColor = (action) => {
  if (!action) return 'primary'; // fallback color

  switch (action.toLowerCase()) {
    case 'approve':
      return 'success';  // green
    case 'disapprove':
      return 'warning';  // yellow
    default:
      return 'danger';   // red
  }
};



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
      {/* To confirm delete  */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this proposal?"
      />
      
      {/* for confirmation of approval / disapproval */}
      <ConfirmDeleteModal
        visible={approvalModalVisible}
        onConfirm={handleConfirmApproval}
        onCancel={handleCancelApproval}
        message={`Are you sure you want to ${approvalAction} this proposal?`}
        title={`${approvalAction}`}
        confirmLabel={approvalAction ? approvalAction.charAt(0).toUpperCase() + approvalAction.slice(1) : 'Confirm'}
        confirmColor={getConfirmColor(approvalAction)}
      />
    </div>
  )
}

export default AllProposals

// import { useEffect, useState, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { CButton } from '@coreui/react';
// import DataTable from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilTrash } from '@coreui/icons';
// import { FaEye } from 'react-icons/fa';
// import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal';
// import { deleteProposal, GetMyProposal } from '../../../../store/admin/proposalSlice';

// function AllProposals() {
//   const dispatch = useDispatch();
//   const { proposals, totalRecords, isLoading } = useSelector(state => state.proposal);

//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [selectedUUID, setSelectedUUID] = useState(null);
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [search, setSearch] = useState('');

//   // Fetch proposals from server
//   const fetchData = useCallback(() => {
//     dispatch(GetMyProposal({ page, limit: perPage, search }));
//   }, [dispatch, page, perPage, search]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const confirmDelete = (uuid) => {
//     setSelectedUUID(uuid);
//     setDeleteModalVisible(true);
//   };

//   const handleConfirmDelete = () => {
//     if (selectedUUID) {
//       dispatch(deleteProposal(selectedUUID)).then(() => {
//         fetchData();
//       });
//     }
//     setDeleteModalVisible(false);
//     setSelectedUUID(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteModalVisible(false);
//     setSelectedUUID(null);
//   };

//   const ExpandedRow = ({ data }) => (
//     <div className="p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
//       <div className="flex items-center space-x-2 text-sm text-gray-700">
//         <span className="fw-medium">Reason for unapprove:</span>
//         <span>{data.reason ? data.reason : 'N/A'}</span>
//       </div>
//     </div>
//   );

//   const columns = [
//     { name: 'Business Zone', selector: row => row.zone_name || '-', sortable: true, minWidth: '130px', wrap: true },
//     { name: 'Business Authority', selector: row => row.authority_name || '-', sortable: true, minWidth: '160px', wrap: true },
//     {
//       name: 'Package & Amount',
//       selector: row => {
//         const packageName = row.package_name || '-';
//         const totalAmount = row.total_amount ? `AED ${row.total_amount}` : '-';
//         return `${packageName} / ${totalAmount}`;
//       },
//       sortable: true,
//       minWidth: '150px',
//       wrap: true,
//     },
//     { name: 'Client Name', selector: row => row.client_info?.name || '-', sortable: true, minWidth: '130px', wrap: true },
//     {
//       name: 'Status',
//       selector: row => {
//         if (row.approval_status === 1) return 'Approved';
//         if (row.approval_status === 0) return 'UnApproved';
//         if (row.employee_approval === 1) return 'Approval Pending';
//         if (row.step) {
//           if (row.step === 'last_step') return 'Waiting for Send Approval';
//           else return 'Draft';
//         }
//         return '-';
//       },
//       sortable: true,
//       minWidth: '150px',
//       wrap: true,
//     },
//     {
//       name: 'Created At',
//       selector: row => (row.created_at ? new Date(row.created_at).toLocaleString() : '-'),
//       sortable: true,
//       grow: 3,
//     },
//     {
//       name: 'Actions',
//       cell: row => (
//         <div className="d-flex gap-2">
//           <Link to={`/proposal/${row.uuid}`} title="View Proposal">
//             <FaEye style={{ cursor: 'pointer', color: '#333' }} size={20} />
//           </Link>
//           <span
//             onClick={() => confirmDelete(row.uuid)}
//             title="Delete Proposal"
//             style={{ cursor: 'pointer' }}
//           >
//             <CIcon icon={cilTrash} size="lg" />
//           </span>
//         </div>
//       ),
//       ignoreRowClick: true,
//       width: '120px',
//     },
//   ];

//   return (
//     <div className="container">
//       <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
//         <Link to="/business-zones">
//           <CButton className="custom-button">Add Proposal</CButton>
//         </Link>
//         <input
//           type="text"
//           className="form-control w-25"
//           placeholder="Search proposals..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1); // reset to first page when searching
//           }}
//         />
//       </div>

//       <DataTable
//         columns={columns}
//         data={proposals}
//         pagination
//         paginationServer
//         paginationTotalRows={totalRecords}
//         paginationDefaultPage={page}
//         onChangePage={setPage}
//         onChangeRowsPerPage={(newPerPage) => {
//           setPerPage(newPerPage);
//           setPage(1);
//         }}
//         highlightOnHover
//         responsive
//         striped
//         progressPending={isLoading}
//         noDataComponent="No proposals found"
//         expandableRows
//         expandableRowsComponent={ExpandedRow}
//         expandOnRowClicked
//       />

//       <ConfirmDeleteModal
//         visible={deleteModalVisible}
//         onCancel={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         title="Confirm Delete"
//         message="Are you sure you want to delete this proposal?"
//       />
//     </div>
//   );
// }

// export default AllProposals;

import { useEffect, useState, useCallback } from 'react';
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
const [totalRecords ,setTotalRecords] = useState(0)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState(''); // for debouncing

  // ✅ Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchDebounce(search);
      setPage(1); // reset to first page when searching
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // ✅ Fetch proposals from server
  const fetchData = useCallback(() => {
    dispatch(GetMyProposal({ page, limit: perPage, search: searchDebounce })).then((data)=>{
     
      if (data.payload.success){
          setTotalRecords(data.payload.totalRecords)
      }
      
    });
  }, [dispatch, page, perPage, searchDebounce]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (uuid) => {
    setSelectedUUID(uuid);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deleteProposal(selectedUUID)).then(() => {
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

  

  // ✅ Expanded Row Component
  const ExpandedRow = ({ data }) => (
    <div className="p-3 bg-light border rounded">
      <strong>Reason for unapprove:</strong> {data.reason || 'N/A'}
    </div>
  );

  // ✅ Table Columns
  const columns = [
    { name: 'Business Zone', selector: row => row.zone_name || 'NA', sortable: true, Width: '130px', wrap: true },
    { name: 'Business Authority', selector: row => row.authority_name || 'NA', sortable: true, Width: '160px', wrap: true },
    {
      name: 'Package & Amount',
      selector: row => {
        const packageName = row.package_name || 'NA';
        const totalAmount = row.total_amount ? `AED ${row.total_amount}` : 'NA';
        return `${packageName} / ${totalAmount}`;
      },
      sortable: true,
      Width: '150px',
      wrap: true,
    },
    { name: 'Client Name', selector: row => row.client_info?.name || 'NA', sortable: true, Width: '130px', wrap: true },
    {
      name: 'Status',
      selector: row => {
        if (row.approval_status === 1) return 'Approved';
        if (row.approval_status === 0) return 'UnApproved';
        if (row.employee_approval == 1) return 'Approval Pending';
        if (row.step) {
          if (row.step === 'last_step') return 'Waiting for Send Approval';
          else return 'Draft';
        }
        return '-';
      },
      sortable: true,
      Width: '150px',
      wrap: true,
    },
    {
      name: 'Created At',
      selector: row => (row.created_at ? new Date(row.created_at).toLocaleString() : '-'),
      sortable: true,
     
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
  columns={columns}
  data={proposals}
  pagination
  paginationServer
  paginationTotalRows={totalRecords}
  paginationDefaultPage={page}
  key={page} // ✅ important for resetting on search
  onChangePage={(p) => setPage(p)}
  onChangeRowsPerPage={(newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  }}
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

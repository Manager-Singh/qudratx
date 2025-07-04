// import { useEffect, useState } from 'react';
// import { CButton } from '@coreui/react';
// import DataTable from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilTrash } from '@coreui/icons';
// import { FaEye } from 'react-icons/fa';

// function AllLead() {
//   const [filterText, setFilterText] = useState('');

//   const leads = [
//     {
//       uuid: '1a2b3c4d',
//       name: 'John Doe',
//       generated_by: 'CRM Form',
//       source: 'Facebook Ads',
//       created_at: '2025-06-20T10:30:00Z',
//     },
//     {
//       uuid: '2b3c4d5e',
//       name: 'Jane Smith',
//       generated_by: 'Landing Page',
//       source: 'Google Search',
//       created_at: '2025-06-21T11:45:00Z',
//     },
//     {
//       uuid: '3c4d5e6f',
//       name: 'Michael Johnson',
//       generated_by: 'Sales Rep',
//       source: 'Referral',
//       created_at: '2025-06-22T14:15:00Z',
//     },
//     {
//       uuid: '4d5e6f7g',
//       name: 'Emily Davis',
//       generated_by: 'Mobile App',
//       source: 'Instagram Ads',
//       created_at: '2025-06-23T09:00:00Z',
//     },
//     {
//       uuid: '5e6f7g8h',
//       name: 'David Wilson',
//       generated_by: 'Web Chat',
//       source: 'Direct',
//       created_at: '2025-06-24T13:30:00Z',
//     },
//   ];

//   const columns = [
//     {
//       name: 'Name',
//       selector: row => row.name,
//       sortable: true,
//     },
//     {
//       name: 'Generated By',
//       selector: row => row.generated_by,
//       sortable: true,
//     },
//     {
//       name: 'Source',
//       selector: row => row.source,
//       sortable: true,
//     },
//     {
//       name: 'Created At',
//       selector: row => new Date(row.created_at).toLocaleString(),
//       sortable: true,
//     },
//     {
//       name: 'Action',
//       cell: row => (
//         <div className="d-flex gap-2">
//           <Link to={`/view-lead/${row.uuid}`} title="View Lead">
//             <FaEye style={{ cursor: 'pointer', color: '#0d6efd' }} />
//           </Link>
//           <span title="Delete Lead" style={{ cursor: 'pointer' }}>
//             <CIcon icon={cilTrash} size="lg" />
//           </span>
//         </div>
//       ),
//       ignoreRowClick: true,
//       width: '150px',
//     },
//   ];

//   const filteredData = leads.filter(item =>
//     item.name.toLowerCase().includes(filterText.toLowerCase()) ||
//     item.generated_by.toLowerCase().includes(filterText.toLowerCase()) ||
//     item.source.toLowerCase().includes(filterText.toLowerCase())
//   );

//   return (
//     <div className="container">
//       <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
//         <Link to="/add-lead">
//           <CButton className="custom-button">Add Lead</CButton>
//         </Link>
//         <input
//           type="text"
//           className="form-control w-25"
//           placeholder="Search leads..."
//           value={filterText}
//           onChange={e => setFilterText(e.target.value)}
//         />
//       </div>
//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         highlightOnHover
//         responsive
//         striped
//       />
//     </div>
//   );
// }

// export default AllLead;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLead, deleteLead } from '../../../../store/admin/leadSlice'; // adjust path as needed
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';

function AllLead() {
  const dispatch = useDispatch();
  const { leads, isLoading } = useSelector(state => state.lead); // confirm slice key is 'lead'

  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(getLead());
  }, [dispatch]);

  // Filter by fields that exist in the data
  const filteredData = leads.filter(item =>
    item.name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.status?.toString().toLowerCase().includes(filterText.toLowerCase()) ||
    item.email?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.phone?.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  // Delete handler
  const handleDelete = (uuid) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(uuid));
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name || '-',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Company',
      selector: row => row.company_name || '-',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email || '-',
      sortable: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone || '-',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => (row.status === true ? 'Active' : 'Inactive'),
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.created_at ? new Date(row.created_at).toLocaleString() : '-',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex gap-2">
          <Link to={`/view-lead/${row.uuid}`} title="View Lead">
            <FaEye style={{ cursor: 'pointer', color: '#0d6efd' }} />
          </Link>
          <span
            onClick={() => handleDelete(row.uuid)}
            title="Delete Lead"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
        </div>
      ),
      ignoreRowClick: true,
      width: '150px',
    },
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
        noDataComponent="No leads found"
      />
    </div>
  );
}

export default AllLead;

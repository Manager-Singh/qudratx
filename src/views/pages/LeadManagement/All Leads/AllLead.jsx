import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLead, deleteLead } from '../../../../store/admin/leadSlice'; // Adjust path as needed
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { FaEye } from 'react-icons/fa';

function AllLead() {
  const dispatch = useDispatch();
  const { leads, isLoading } = useSelector(state => state.lead);

  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    dispatch(getLead());
  }, [dispatch]);

  // Filter by relevant fields
  const filteredData = leads.filter(item =>
    item.uuid?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.origin?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.created_status?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.lead_status?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.approval_status?.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDelete = (uuid) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(uuid));
    }
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
      wrap:true,
      grow:3,
    },
    {
      name: 'Lead Status',
      selector: row => row.lead_status || '-',
      sortable: true,
      wrap:true,
      grow:3,
    },
    {
      name: 'Assigned To',
      selector: row => row.assigned_to !== null ? row.assigned_to : 'Unassigned',
      sortable: true,
      wrap:true,
      grow:3,
    },
    {
      name: 'Assigned By',
      selector: row => row.assigned_by !== null ? row.assigned_by : '-',
      sortable: true,
      wrap:true,
      grow:3,
    },
    {
      name: 'Created By',
      selector: row => row.created_by || '-',
      sortable: true,
      wrap:true,
      grow:3,
    },
    {
      name: 'Approval Status',
      selector: row => row.approval_status || '-',
      sortable: true,
      wrap:true,
      grow:3,
    },
    {
      name: 'Status',
      selector: row => row.status === 1 ? 'Active' : 'Inactive',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => row.created_at ? new Date(row.created_at).toLocaleString() : '-',
      sortable: true,
    },
    {
      name:"UUID",
      selector:row => row . uuid,
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

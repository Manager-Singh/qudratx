import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { MdEdit } from "react-icons/md";

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([]);

  // Dummy data
  const dummyData = [
    {
      uuid: '1',
      name: 'Admission Fee',
      status: 'Active',
      created_at: '2025-06-15T10:00:00Z',
    },
    {
      uuid: '2',
      name: 'Library Fee',
      status: 'Inactive',
      created_at: '2025-06-12T14:30:00Z',
    },
    {
      uuid: '3',
      name: 'Sports Fee',
      status: 'Active',
      created_at: '2025-06-10T09:15:00Z',
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    setFeeStructures(dummyData);
  }, []);

  const handleDelete = (uuid) => {
    const filtered = feeStructures.filter((item) => item.uuid !== uuid);
    setFeeStructures(filtered);
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => (
        <span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className='d-flex gap-2'>
          <span
            title="Delete"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDelete(row.uuid)}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <Link
            to={`/edit-fee/${row.uuid}`}
            title="Edit"
            style={{ backgroundColor: 'transparent', padding: 0 }}
          >
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      width: '150px',
    },
  ];

  const [filterText, setFilterText] = useState('');
  const filteredData = feeStructures.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center'>
        <Link to='/add-fee'>
          <CButton className='custom-button'>Add Fee Structure</CButton>
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
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
      />
    </div>
  );
}

export default FeeStructure;

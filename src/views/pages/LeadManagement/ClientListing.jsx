import {  useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash} from '@coreui/icons';
import { FaCircle ,FaTrash,} from 'react-icons/fa';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';


function ClientListing() {
const [filterText, setFilterText] = useState('');
const dispatch= useDispatch()
// const {business_activities} = useSelector((state)=>state.business_activity)

// useEffect(()=>{
// dispatch(getBusinessActivity())
// },[dispatch])

const business_activities = [
  {
    uuid: '1a2b3c4d',
    name: 'Software Development',
    status: true,
    address: '123 Tech Park, Bengaluru',
    email: 'dev@example.com',
    company_name: 'TechNova Pvt Ltd',
    notes: 'Handles all custom software projects.',
    created_at: '2025-06-01T10:00:00Z',
  },
  {
    uuid: '2b3c4d5e',
    name: 'Digital Marketing',
    status: false,
    address: '456 Media Street, Mumbai',
    email: 'marketing@example.com',
    company_name: 'MarketMinds Ltd',
    notes: 'SEO and online campaigns.',
    created_at: '2025-06-05T14:30:00Z',
  },
  {
    uuid: '3c4d5e6f',
    name: 'Consulting Services',
    status: true,
    address: '789 Strategy Blvd, Delhi',
    email: 'consult@example.com',
    company_name: 'StratEdge LLP',
    notes: 'Business and tech consulting.',
    created_at: '2025-06-10T09:15:00Z',
  },
  {
    uuid: '4d5e6f7g',
    name: 'Logistics Management',
    status: false,
    address: '321 Cargo Road, Chennai',
    email: 'logistics@example.com',
    company_name: 'TransLogix Inc',
    notes: 'Warehouse and shipping management.',
    created_at: '2025-06-12T11:45:00Z',
  },
  {
    uuid: '5e6f7g8h',
    name: 'HR Solutions',
    status: true,
    address: '654 People Ave, Pune',
    email: 'hr@example.com',
    company_name: 'PeoplePros HR',
    notes: 'Recruitment and employee training.',
    created_at: '2025-06-15T08:20:00Z',
  },
];
const columns = [
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => row.status,
    cell: row => (
      <FaCircle
        color={row.status ? 'green' : 'red'}
        title={row.status ? 'Active' : 'Inactive'}
      />
    ),
    sortable: true,
  },
  {
    name: 'Address',
    selector: row => row.address,
    sortable: true,
  },
  {
    name: 'Email',
    selector: row => row.email,
    sortable: true,
  },
  {
    name: 'Company Name',
    selector: row => row.company_name,
    sortable: true,
  },
  {
    name: 'Notes',
    selector: row => row.notes,
    sortable: false,
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
          color="light"
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.uuid)}
          className="p-0"
          title="Delete"
        >
          <CIcon icon={cilTrash} size="lg" />
        </span>
        <Link to={`/edit-client/${row.uuid}`}>
          <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
        </Link>
      </div>
    ),
    ignoreRowClick: true,
    width: '150px',
  },
];

   const filteredData = business_activities.filter(item =>
  item.name.toLowerCase().includes(filterText.toLowerCase()) ||
  item.email?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.address?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.company_name?.toLowerCase().includes(filterText.toLowerCase()) ||
  item.notes?.toLowerCase().includes(filterText.toLowerCase())
);

//   const handleDelete =(uuid)=>{
//   dispatch(deleteBusinessActivity(uuid)).then((data)=>{
//     if (data.payload.success) {
//       dispatch(getBusinessActivity())
//     }
//   })
//   }
  
  return (
    <div className='container'>
      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <Link to='/add-client'> <CButton className='custom-button'>Add Client</CButton></Link>
       
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or email"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        // selectableRows
        highlightOnHover
        responsive
        striped
      />
      
    </div>
   
  )
}

export default ClientListing
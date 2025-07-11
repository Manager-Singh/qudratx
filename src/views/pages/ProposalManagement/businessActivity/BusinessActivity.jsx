

import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { Link, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { MdEdit } from 'react-icons/md'
import { ToastExample } from '../../../../components/toast/Toast'
import { useDispatch, useSelector } from 'react-redux'
// import { } from '../../../../store/admin/zoneAuthoritySlice'

const dummyData = [
  {
    uuid: '1',
    code: '9311.02',
    name: 'Operation of sports facilities',
    category: 'Education',
    group: '931',
    price: 2147.0,
    status: 1,
    created_at: '2024-07-01T12:00:00Z',
  },
  {
    uuid: '2',
    code: '4540096',
    name: 'Commercial Brokers',
    category: 'Trading',
    group: '454',
    price: 2176.0,
    status: 0,
    created_at: '2024-06-20T09:30:00Z',
  },
  {
    uuid: '3',
    code: '5811.20',
    name: 'Books Publishing & Events',
    category: 'Publishing',
    group: '581',
    price: 1255.0,
    status: 1,
    created_at: '2024-05-15T15:45:00Z',
  },
]

function BusinessActivity() {
  const [filterText, setFilterText] = useState('')
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [data, setData] = useState([])
  const {uuid} =useParams()
  const dispatch = useDispatch()
  const { authority } = useSelector((state) => state.businessZonesAuthority)
  useEffect(() => {
    if (!authority) {
    
    }
    // In real case: dispatch(getBusinessActivities())
    setData(dummyData)
  }, [])

  useEffect(()=>{
    dispatch()
  },[])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleDelete = (uuid) => {
    const updated = data.filter((item) => item.uuid !== uuid)
    setData(updated)
    showToast('success', 'Activity deleted successfully')
  }

  const columns = [
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Activity Name',
      selector: (row) => (
        <Link to={`/business-activity/${row.uuid}`} style={{ textDecoration: 'none' }}>
          {row.name}
        </Link>
      ),
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: 'Group',
      selector: (row) => row.group,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Price (AED)',
      selector: (row) => `AED ${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <span className={`badge ${row.status === 1 ? 'bg-success' : 'bg-secondary'}`}>
          {row.status === 1 ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <span onClick={() => handleDelete(row.uuid)} title="Delete" style={{ cursor: 'pointer' }}>
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <Link to={`/edit-business-activity/${row.uuid}`}>
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      width: '150px',
    },
  ]

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.code.includes(filterText) ||
      item.category.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <Link to="/add-business-activity">
          <CButton className="custom-button">Add Business Activity</CButton>
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name, code, or category"
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
      />
    </div>
  )
}

export default BusinessActivity

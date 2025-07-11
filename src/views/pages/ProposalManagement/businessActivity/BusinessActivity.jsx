import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { Link, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { MdEdit } from 'react-icons/md'
import { ToastExample } from '../../../../components/toast/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { getBusinessActivityByAuthorityId } from '../../../../store/admin/businessActivitySlice'
import { getBusinessZonesAuthorityByUuid } from '../../../../store/admin/zoneAuthoritySlice'

function BusinessActivity() {
  const [filterText, setFilterText] = useState('')
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  const { uuid } = useParams()
  const dispatch = useDispatch()
  const { authority } = useSelector((state) => state.businessZonesAuthority)
  const { business_activities } = useSelector((state) => state.business_activity)

  useEffect(() => {
    if (uuid) {
      dispatch(getBusinessZonesAuthorityByUuid({uuid}))
    }
  }, [uuid])

  useEffect(() => {
    if (authority?.id) {
      dispatch(getBusinessActivityByAuthorityId(authority.id))
    }
  }, [authority?.id])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleDelete = (uuid) => {
    // Replace with dispatch(deleteActivity(uuid)) when you have the delete API
    showToast('success', 'Activity deleted successfully')
  }

  const columns = [
    {
      name: 'Master Number',
      selector: (row) => row.activity_master_number || '-',
      sortable: true,
    },
    {
      name: 'Activity Code',
      selector: (row) => row.activity_code || '-',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <span className={`badge ${row.status ? 'bg-success' : 'bg-secondary'}`}>
          {row.status ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Authority',
      selector: (row) => row.authority?.name || '-',
      sortable: true,
    },
    {
      name: 'Zone',
      selector: (row) => row.authority?.zone?.name || '-',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <span
            onClick={() => handleDelete(row.uuid)}
            title="Delete"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <Link to={`/edit-business-activity/${row.uuid}`}>
            <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      width: '140px',
    },
  ]

  const filteredData = (business_activities || []).filter((item) =>
    (item.activity_code || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (item.activity_master_number || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (item.authority?.name || '').toLowerCase().includes(filterText.toLowerCase())
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
          placeholder="Search by code, master number or authority"
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
        noDataComponent="No activities found"
      />
    </div>
  )
}

export default BusinessActivity

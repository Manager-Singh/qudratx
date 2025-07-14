import { Link, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import img from '../../../assets/common/imgPlaceholder.jpg'
import {
  addBusinessZonesAuthority,
  deleteBusinessZonesAuthority,
  getBusinessZonesAuthorityByZoneId,
  updateBusinessZonesAuthority,
} from '../../../store/admin/zoneAuthoritySlice'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { MdEdit } from 'react-icons/md'
import DataTable from 'react-data-table-component'
import { getBusinessZoneByUuid } from '../../../store/admin/businessZoneSlice'
import AddAuthorityPopUp from './components/AddAuthorityPopUp'
import { ToastExample } from '../../../components/toast/Toast'

function BusinessAuthority() {
  const { uuid } = useParams()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    status: 1,
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  const { authorities } = useSelector((state) => state.businessZonesAuthority)
  const { businesszone } = useSelector((state) => state.businesszone)

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    dispatch(getBusinessZoneByUuid(uuid))
  }, [uuid])

  useEffect(() => {
    if (businesszone) {
      dispatch(getBusinessZonesAuthorityByZoneId({ id: businesszone.id }))
    }
  }, [businesszone, dispatch])

  const handleDelete = (uuid) => {
    dispatch(deleteBusinessZonesAuthority(uuid)).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message)
        dispatch(getBusinessZonesAuthorityByZoneId({ id: businesszone.id }))
      }
    })
  }

  const handleAddAuthority = (e) => {
    e.preventDefault()
    const newFormdata = new FormData()
    newFormdata.append('name', formData.name)
    newFormdata.append('status', formData.status)
    newFormdata.append('zone_id', businesszone.id)
    if (formData.image) {
      newFormdata.append('image', formData.image)
    }

    dispatch(addBusinessZonesAuthority(newFormdata)).then((data) => {
      if (data.payload.success) {
        setFormData({ name: '', status: 1, image: null })
        setImagePreview(null)
        showToast('success', data.payload.message)
        setVisible(false)
      } else {
        showToast('error', data.payload)
      }
    })
  }

  const handleEditAuthority = (e) => {
    e.preventDefault()
    const newFormdata = new FormData()
    newFormdata.append('name', formData.name)
    newFormdata.append('status', formData.status)
    newFormdata.append('zone_id', businesszone.id)
    if (formData.image) {
      newFormdata.append('image', formData.image)
    }

    const updatedData = {
      uuid: selectedAuthority.uuid,
      data: newFormdata,
    }

    dispatch(updateBusinessZonesAuthority(updatedData)).then((data) => {
      if (data.payload.success) {
        setFormData({ name: '', status: 1, image: null })
        setImagePreview(null)
        showToast('success', data.payload.message)
        setVisible(false)
      } else {
        showToast('error', data.payload)
      }
    })
  }

  const columns = [
   {
    name: 'Image',
    selector: (row) =>
      row.image ? (
        <img
          src={`http://localhost:5000/uploads/business-zones/${row.image}`}
          alt="Authority"
          style={{ width: '160px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = img // Fallback image
          }}
        />
      ) : (
        <img
          src={img} // Default image if row.image is not available
          alt="Authority"
          style={{ width: '160px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
        />
      ),
    sortable: false,
    width: '180px',
  },
    {
      name: 'Authority Zones',
      selector: (row) => (
        <Link to={`/business-activity/${row.uuid}`} style={{ textDecoration: 'none' }}>
          {row.name}
        </Link>
      ),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'}`}>
          {row.status == 1 ? 'Active' : 'Inactive'}
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
      name: 'Action',
      cell: (row) => (
        <div className="d-flex gap-2">
           <Link to={`/packages/${row.uuid}`} style={{ textDecoration: 'none' }} className='custom-button'>
           Add Package
        </Link>
          <span
            onClick={() => handleDelete(row.uuid)}
            className="p-0"
            title="Delete"
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <div
            onClick={() => {
              setIsEdit(true)
              setSelectedAuthority(row)
              setFormData({
                name: row.name,
                status: row.status,
                image: null,
              })
              setImagePreview(row.image ? `http://localhost:5000/uploads/business-zones/${row.image}` : null)
              setVisible(true)
            }}
            title="Edit"
            style={{ backgroundColor: 'transparent', padding: 0, cursor: 'pointer' }}
          >
            <MdEdit size={20} style={{ color: '#333' }} />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      width: '250px',
    },
  ]

  const filteredData = authorities.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}
      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between w-75 px-3">
          <h4>{businesszone?.name}</h4>
          <CButton className="custom-button" onClick={() => setVisible(true)}>
            Add Zone Authority
          </CButton>
        </div>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
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
      <AddAuthorityPopUp
        visible={visible}
        setVisible={setVisible}
        handleSubmit={!isEdit ? handleAddAuthority : handleEditAuthority}
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setSelectedAuthority={setSelectedAuthority}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />

      
    </div>
  )
}

export default BusinessAuthority

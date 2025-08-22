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
import useConfirm from '../../../components/SweetConfirm/useConfirm'

const baseImageUrl = import.meta.env.VITE_IMAGE_URL;

function BusinessAuthority() {
  const { uuid } = useParams()
  const dispatch = useDispatch()
   const confirm = useConfirm(); 
  const [formData, setFormData] = useState({ name: '', status: 1, image: null })
  const [imagePreview, setImagePreview] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  // Pagination & Search states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { authorities, total } = useSelector((state) => state.businessZonesAuthority)
  const { businesszone } = useSelector((state) => state.businesszone)
  
  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    dispatch(getBusinessZoneByUuid(uuid))
  }, [uuid])

  useEffect(() => {
    if (businesszone?.id) {
      dispatch(getBusinessZonesAuthorityByZoneId({ 
        id: businesszone.id, 
        page, 
        limit, 
        search 
      }))
    }
  }, [businesszone, dispatch, page, limit, search])

  const handleDelete = async(uuid,name) => {
    
    const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the authority "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
       dispatch(deleteBusinessZonesAuthority(uuid)).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message)
        dispatch(getBusinessZonesAuthorityByZoneId({ id: businesszone.id, page, limit, search }))
      }
    })
    }
   
  }

  const handleAddAuthority = (e) => {
    e.preventDefault()
    const newFormdata = new FormData()
    newFormdata.append('name', formData.name)
    newFormdata.append('status', formData.status)
    newFormdata.append('zone_id', businesszone.id)
    if (formData.image) newFormdata.append('image', formData.image)

    dispatch(addBusinessZonesAuthority(newFormdata)).then((data) => {
      if (data.payload.success) {
        setFormData({ name: '', status: 1, image: null })
        setImagePreview(null)
        showToast('success', data.payload.message)
        setVisible(false)
        dispatch(getBusinessZonesAuthorityByZoneId({ id: businesszone.id, page, limit, search }))
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
    if (formData.image) newFormdata.append('image', formData.image)

    const updatedData = { uuid: selectedAuthority.uuid, data: newFormdata }

    dispatch(updateBusinessZonesAuthority(updatedData)).then((data) => {
      if (data.payload.success) {
        setFormData({ name: '', status: 1, image: null })
        setImagePreview(null)
        showToast('success', data.payload.message)
        setVisible(false)
        dispatch(getBusinessZonesAuthorityByZoneId({ id: businesszone.id, page, limit, search }))
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
            src={`${baseImageUrl}${row.image}`}
            alt="Authority"
            style={{ width: '160px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = img
            }}
          />
        ) : (
          <img
            src={img}
            alt="Authority"
            style={{ width: '160px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
          />
        ),
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
          <Link to={`/packages/${row.uuid}`} style={{ textDecoration: 'none' }} className="custom-button">
            Add Package
          </Link>
          <span onClick={() => handleDelete(row.uuid,row.name)} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <div
            onClick={() => {
              setIsEdit(true)
              setSelectedAuthority(row)
              setFormData({ name: row.name, status: row.status, image: null })
              setImagePreview(row.image ? `${baseImageUrl}${row.image}` : null)
              setVisible(true)
            }}
            style={{ cursor: 'pointer' }}
          >
            <MdEdit size={20} style={{ color: '#333' }} />
          </div>
        </div>
      ),
      width: '250px',
    },
  ]

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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={authorities}
        pagination
        paginationServer
        paginationTotalRows={total}
        onChangePage={(newPage) => setPage(newPage)}
        onChangeRowsPerPage={(newLimit) => { setLimit(newLimit); setPage(1) }}
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

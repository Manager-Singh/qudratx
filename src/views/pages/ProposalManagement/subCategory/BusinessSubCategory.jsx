import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { MdEdit } from 'react-icons/md'

// import {
//   getBusinessCategoryByUuid
// } from '../../../store/admin/businessCategorySlice'
// import {
//   getSubCategoriesByCategoryId,
//   addBusinessSubCategory,
//   updateBusinessSubCategory,
//   deleteBusinessSubCategory
// } from '../../../store/admin/businessSubCategorySlice'
import { ToastExample } from '../../../../components/toast/Toast'
import AddSubCategoryPopup from './AddSubCategoryPopup'
import { getSubCategoryByUUID } from '../../../../store/admin/subCategorySlice'

function BusinessSubCategory() {
  const { uuid } = useParams()
  const dispatch = useDispatch()
  const [filterText, setFilterText] = useState('')
  const [formData, setFormData] = useState({ name: '', status: 1 })
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

    const {}
    const {sub_category} = useSelector((state)=>state.sub_category)
//   const { subcategories } = useSelector((state) => state.businessSubCategory)

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    dispatch(getSubCategoryByUUID(uuid))
  }, [uuid])

  useEffect(() => {
    if (category?.id) {
      dispatch(getSubCategoriesByCategoryId({ id: category.id }))
    }
  }, [category])

//   const handleDelete = (uuid) => {
//     dispatch(deleteBusinessSubCategory(uuid)).then((res) => {
//       if (res.payload.success) {
//         dispatch(getSubCategoriesByCategoryId({ id: category.id }))
//         showToast('success', res.payload.message)
//       }
//     })
//   }

  const handleAddSubCategory = (e) => {
    e.preventDefault()
    const newFormData = new FormData()
    newFormData.append('name', formData.name)
    newFormData.append('status', formData.status)
    newFormData.append('category_id', category.id)

    dispatch(addBusinessSubCategory(newFormData)).then((res) => {
      if (res.payload.success) {
        showToast('success', res.payload.message)
        setFormData({ name: '', status: 1 })
        setVisible(false)
      } else {
        showToast('error', res.payload)
      }
    })
  }

  const handleEditSubCategory = (e) => {
    e.preventDefault()
    const newFormData = new FormData()
    newFormData.append('name', formData.name)
    newFormData.append('status', formData.status)
    newFormData.append('category_id', category.id)

    // dispatch(updateBusinessSubCategory({
    //   uuid: selectedSubCategory.uuid,
    //   data: newFormData
    // })).then((res) => {
    //   if (res.payload.success) {
    //     showToast('success', res.payload.message)
    //     setFormData({ name: '', status: 1 })
    //     setVisible(false)
    //   } else {
    //     showToast('error', res.payload)
    //   }
    // })
  }
  const subcategories = [
  {
    id: 1,
    uuid: 'subcat-001',
    name: 'Consulting Services',
    status: 1,
    category_id: 10,
    created_at: '2024-07-01T10:15:00Z'
  },
  {
    id: 2,
    uuid: 'subcat-002',
    name: 'Legal Advisory',
    status: 1,
    category_id: 10,
    created_at: '2024-07-02T12:00:00Z'
  },
  {
    id: 3,
    uuid: 'subcat-003',
    name: 'Technical Support',
    status: 0,
    category_id: 10,
    created_at: '2024-07-03T14:30:00Z'
  },
  {
    id: 4,
    uuid: 'subcat-004',
    name: 'Accounting Services',
    status: 1,
    category_id: 10,
    created_at: '2024-07-04T09:00:00Z'
  },
  {
    id: 5,
    uuid: 'subcat-005',
    name: 'Marketing Solutions',
    status: 0,
    category_id: 10,
    created_at: '2024-07-05T11:45:00Z'
  }
]


  const filteredData = subcategories.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  )

  const columns = [
    {
      name: 'Subcategory Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => (
        <span className={`badge ${row.status == 1 ? 'bg-success' : 'bg-secondary'}`}>
          {row.status == 1 ? 'Active' : 'Inactive'}
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
            onClick={() => handleDelete(row.uuid)}
            title="Delete"
            className="p-0"
          >
            <CIcon icon={cilTrash} size="lg" />
          </span>
          <div
            onClick={() => {
              setIsEdit(true)
              setSelectedSubCategory(row)
              setFormData({ name: row.name, status: row.status })
              setVisible(true)
            }}
            title="Edit"
            style={{ cursor: 'pointer' }}
          >
            <MdEdit size={20} />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      width: '150px',
    }
  ]

  return (
    <div className='container'>
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className='w-100 mb-3 d-flex justify-content-between align-items-center '>
        <div className='d-flex justify-content-between w-75 px-3'>
          <h4>{sub_category?.name}</h4>
          <CButton className='custom-button' onClick={() => setVisible(true)}>
            Add Subcategory
          </CButton>
        </div>
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

      <AddSubCategoryPopup
        visible={visible}
        setVisible={setVisible}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={!isEdit ? handleAddSubCategory : handleEditSubCategory}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setSelectedSubCategory={setSelectedSubCategory}
      />
    </div>
  )
}

export default BusinessSubCategory

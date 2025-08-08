import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { MdEdit } from 'react-icons/md'

import { ToastExample } from '../../../../components/toast/Toast'
import AddSubCategoryPopup from './AddSubCategoryPopup'
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
  updateSubCategory,
} from '../../../../store/admin/subCategorySlice'
import { getBusinessCategoryByUuid } from '../../../../store/admin/businessCategorySlice'

function BusinessSubCategory() {
  const { uuid } = useParams()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({ name: '', status: 1 })
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

  // Pagination & Search State
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')

  const { business_category } = useSelector((state) => state.business_category)
  const { sub_categories, total } = useSelector((state) => state.sub_category)

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  useEffect(() => {
    dispatch(getBusinessCategoryByUuid(uuid))
  }, [uuid, dispatch])

  useEffect(() => {
    if (business_category?.id) {
      dispatch(
        getSubCategoryByCategoryId({
          categoryId: business_category.id,
          page,
          perPage,
          search,
        })
      )
    }
  }, [business_category, dispatch, page, perPage, search])

  const handleDelete = (uuid) => {
    dispatch(deleteSubCategory(uuid)).then((res) => {
      if (res.payload.success) {
        dispatch(
          getSubCategoryByCategoryId({
            categoryId: business_category.id,
            page,
            perPage,
            search,
          })
        )
        showToast('success', res.payload.message)
      }
    })
  }

  const handleAddSubCategory = (e) => {
    e.preventDefault()
    const newFormData = new FormData()
    newFormData.append('name', formData.name)
    newFormData.append('status', formData.status)
    newFormData.append('category_id', business_category.id)

    dispatch(addSubCategory(newFormData)).then((res) => {
      if (res.payload.success) {
        showToast('success', res.payload.message)
        setFormData({ name: '', status: 1 })
        setVisible(false)
        setPage(1) // Reset to first page
        dispatch(
          getSubCategoryByCategoryId({
            categoryId: business_category.id,
            page: 1,
            perPage,
            search,
          })
        )
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
    newFormData.append('category_id', business_category?.id)

    dispatch(
      updateSubCategory({
        uuid: selectedSubCategory.uuid,
        data: newFormData,
      })
    ).then((res) => {
      if (res.payload.success) {
        showToast('success', res.payload.message)
        setFormData({ name: '', status: 1 })
        setVisible(false)
        dispatch(
          getSubCategoryByCategoryId({
            categoryId: business_category.id,
            page,
            perPage,
            search,
          })
        )
      } else {
        showToast('error', res.payload)
      }
    })
  }

  const columns = [
    {
      name: 'Subcategory Name',
      selector: (row) => row.name,
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
          <span
            onClick={() => handleDelete(row.uuid)}
            title="Delete"
            style={{ cursor: 'pointer' }}
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
    },
  ]

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="w-100 mb-3 d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between w-75 px-3">
          <h4>{business_category?.name}</h4>
          <CButton
            className="custom-button"
            onClick={() => {
              setIsEdit(false)
              setFormData({ name: '', status: 1 })
              setVisible(true)
            }}
          >
            Add Subcategory
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
        data={sub_categories}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationDefaultPage={page}
        onChangePage={(p) => setPage(p)}
        onChangeRowsPerPage={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
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

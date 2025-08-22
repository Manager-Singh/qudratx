// import React, { useState, useEffect } from 'react'
// import { CButton } from '@coreui/react'
// import DataTable from 'react-data-table-component'
// import { Link, useParams } from 'react-router-dom'
// import CIcon from '@coreui/icons-react'
// import { cilTrash } from '@coreui/icons'
// import { MdEdit } from 'react-icons/md'
// import { ToastExample } from '../../../../components/toast/Toast'
// import { useDispatch, useSelector } from 'react-redux'
// import { deleteBusinessActivity, getBusinessActivityByAuthorityId } from '../../../../store/admin/businessActivitySlice'
// import { getBusinessZonesAuthorityByUuid } from '../../../../store/admin/zoneAuthoritySlice'

// function BusinessActivity() {
//   const [filterText, setFilterText] = useState('')
//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' })

//   const { uuid } = useParams()
//   const dispatch = useDispatch()
//   const { authority } = useSelector((state) => state.businessZonesAuthority)
//   const { business_activities } = useSelector((state) => state.business_activity)

//   useEffect(() => {
//     if (uuid) {

//   const authority_uuid = uuid;
//       dispatch(getBusinessZonesAuthorityByUuid({authority_uuid})).then((data)=>{
//         if (data.payload.success) {
//           const authority_id =data.payload.data.id
//            dispatch(getBusinessActivityByAuthorityId({authority_id}))
//         }
//       })
//     }
//   }, [uuid])

// console.log(authority,"authority")
//   const showToast = (status, message) => {
//     setToastData({ show: true, status, message })
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
//   }

//   const handleDelete = (uuid) => {
//     dispatch(deleteBusinessActivity(uuid)).then((data)=>{
//       console.log(data,"data")
//       if (data.payload.success) {
//         showToast('success', data.payload.message)
//         const authority_id= authority.id
//         dispatch(getBusinessActivityByAuthorityId({authority_id}))
//       }
//     })
    
//   }

//   const columns = [
//     {
//       name: 'Master Number',
//       selector: (row) => row.activity_master_number || 'N/A',
//       sortable: true,
//     },
//     {
//       name: 'Activity Code',
//       selector: (row) => row.activity_code || 'N/A',
//       sortable: true,
//     },
//      {
//       name: 'Activity Name',
//       selector: (row) => row.activity_name || 'N/A',
//       sortable: true,
//     },
//      {
//       name: 'Category/Type',
//       selector: (row) => row.category || 'N/A',
//       sortable: true,
//     },
//     {
//       name: 'Status',
//       selector: (row) => (
//         <span className={`badge ${row.status ? 'bg-success' : 'bg-secondary'}`}>
//           {row.status ? 'Active' : 'Inactive'}
//         </span>
//       ),
//       sortable: true,
//       width: '120px',
//     },
//     // {
//     //   name: 'Authority',
//     //   selector: (row) => row.authority?.name || 'N/A',
//     //   sortable: true,
//     // },
//     // {
//     //   name: 'Zone',
//     //   selector: (row) => row.authority?.zone?.name || 'N/A',
//     //   sortable: true,
//     // },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <div className="d-flex gap-2">
//           <span
//             onClick={() => handleDelete(row.uuid)}
//             title="Delete"
//             style={{ cursor: 'pointer' }}
//           >
//             <CIcon icon={cilTrash} size="lg" />
//           </span>
//           <Link to={`/edit-business-activity/${row.uuid}`}>
//             <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
//           </Link>
//         </div>
//       ),
//       ignoreRowClick: true,
//       width: '140px',
//     },
//   ]

//   const filteredData = (business_activities || []).filter((item) =>
//     (item.activity_code || '').toLowerCase().includes(filterText.toLowerCase()) ||
//     (item.activity_master_number || '').toLowerCase().includes(filterText.toLowerCase()) ||
//     (item.authority?.name || '').toLowerCase().includes(filterText.toLowerCase())
//   )

// const firstActivity = business_activities[0] || {}
// const fullZoneAuthority = 
//   (firstActivity.authority?.name || '') + 
//   ' ' + 
//   (firstActivity.authority?.zone?.name || '')
  
//   return (
//     <div className="container">
//       {toastData.show && (
//         <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}

//       <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
//              <div className="d-flex justify-content-between w-75 px-3">
//                <h4>{fullZoneAuthority}</h4>
               
//           <Link to={`/add-business-activity/${uuid}`}>
//           <CButton className="custom-button">
//           Add Business Activity
//           </CButton>
//           </Link>
//              </div>
//              <input
//                type="text"
//                className="form-control w-25"
//                placeholder="Search by name"
//                value={filterText}
//                onChange={(e) => setFilterText(e.target.value)}
//              />
//            </div>

//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         highlightOnHover
//         responsive
//         striped
//         noDataComponent="No activities found"
//       />
//     </div>
//   )
// }

// export default BusinessActivity

import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { Link, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { MdEdit } from 'react-icons/md'
import { ToastExample } from '../../../../components/toast/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBusinessActivity, getBusinessActivityByAuthorityId, uploadAuthorityXlsx } from '../../../../store/admin/businessActivitySlice'
import { getBusinessZonesAuthorityByUuid } from '../../../../store/admin/zoneAuthoritySlice'
import useConfirm from '../../../../components/SweetConfirm/useConfirm'


function BusinessActivity() {
   const confirm = useConfirm(); 
  const [filterText, setFilterText] = useState('')
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [file, setFile] = useState(null)
  const [showModal, setShowModal] = useState(false) // modal state
  const { uuid } = useParams()
  const dispatch = useDispatch()
  const { authority } = useSelector((state) => state.businessZonesAuthority)
  const { business_activities } = useSelector((state) => state.business_activity)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (uuid) {
      const authority_uuid = uuid
      dispatch(getBusinessZonesAuthorityByUuid({ authority_uuid })).then((data) => {
        if (data.payload.success) {
          const authority_id = data.payload.data.id
          dispatch(getBusinessActivityByAuthorityId({ authority_id, page, limit: perPage })).then((data) => {
            if (data.payload.success) {
              setTotal(data?.payload?.totalRecords)
            }
          })
        }
      })
    }
  }, [uuid, page, perPage])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleDelete = async(uuid,name) => {
     const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the business activity "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
       dispatch(deleteBusinessActivity(uuid)).then((data) => {
      if (data.payload.success) {
        showToast('success', data.payload.message)
        const authority_id = authority.id
        dispatch(getBusinessActivityByAuthorityId({ authority_id, page, limit: perPage }))
      }
    })
    }
   
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    const authority_uuid = uuid
    dispatch(getBusinessZonesAuthorityByUuid({ authority_uuid })).then((data) => {
      if (data.payload.success) {
        const authority_id = data.payload.data.id
        dispatch(getBusinessActivityByAuthorityId({ authority_id, search: e.target.value })).then((data) => {
          if (data.payload.success) {
            setTotal(data?.payload?.totalRecords)
          }
        })
      }
    })
  }

  const columns = [
    {
      name: 'Master Number',
      selector: (row) => row.activity_master_number || 'N/A',
      width: "150px",
      sortable: true,
    },
    {
      name: 'Activity Code',
      selector: (row) => row.activity_code || 'N/A',
      width: "150px",
      sortable: true,
    },
    {
      name: 'Activity Name',
      selector: (row) => row.activity_name || 'N/A',
      sortable: true,
      wrap: true,
      grow: 2,
      style: {
        whiteSpace: 'normal',
        lineHeight: '1.4',
      },
    },
    {
      name: 'Category/Type',
      selector: (row) => row.category || row.license_type || 'N/A',
      width: "150px",
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
      width: '140px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex gap-2">
          <span
            onClick={() => handleDelete(row.uuid,row.activity_name)}
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

  const fullZoneAuthority =
    (authority?.name || '') + ' ' + (authority?.zone?.name || '')

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select an XLSX file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("authority_id", authority.id);

    dispatch(uploadAuthorityXlsx(formData)).then((data) => {
      if (data.payload.success) {
        const authority_id = authority.id
        dispatch(getBusinessActivityByAuthorityId({ authority_id, page, limit: perPage }))
        setShowModal(false) // close modal after upload
        setFile(null)
      }
    })
  };

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between w-75 px-3">
          <h4>{fullZoneAuthority}</h4>
          
           <div className='d-flex gap-1'>
             <CButton className='custom-button' onClick={() => setShowModal(true)}>Upload XLSX</CButton>
             <Link to={`/add-business-activity/${uuid}`}>
            <CButton className="custom-button">Add Business Activity</CButton>
          </Link>
           </div>
        
          
        </div>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by code or master number"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={(business_activities || []).filter((item) =>
          (item.activity_code || '').toLowerCase().includes(filterText.toLowerCase()) ||
          (item.activity_master_number || '').toLowerCase().includes(filterText.toLowerCase())
        )}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={perPage}
        onChangePage={(page) => setPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setPerPage(newPerPage);
          setPage(page);
        }}
        highlightOnHover
        responsive
        striped
        noDataComponent="No activities found"
      />

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload XLSX File</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <CButton color="secondary" onClick={() => setShowModal(false)}>Cancel</CButton>
                <CButton color="primary" onClick={handleUpload}>Upload</CButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default BusinessActivity

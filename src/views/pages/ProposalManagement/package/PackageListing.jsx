
import {  useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import { Link, useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { ToastExample } from '../../../../components/toast/Toast'
import { FaEye } from 'react-icons/fa';
import { deletePackage, getPackageByAuthorityId,  } from '../../../../store/admin/packageSlice';
import ConfirmDeleteModal from '../../../../components/ConfirmDelete/ConfirmDeleteModal'; 
import PackageCard from './PackageCard';
import { getBusinessZonesAuthorityByUuid } from '../../../../store/admin/zoneAuthoritySlice';
import useConfirm from '../../../../components/SweetConfirm/useConfirm';

function PackageListing() {
const confirm = useConfirm(); 
const [filterText, setFilterText] = useState('');
const {uuid} = useParams()
const dispatch= useDispatch()
// handle model of delete 
 const [deleteModalVisible, setDeleteModalVisible] = useState(false);
 const [selectedUUID, setSelectedUUID] = useState(null);

 const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
 const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }
const {packages} = useSelector((state)=>state.package)
const {authority} = useSelector((state)=> state.businessZonesAuthority)
const authority_uuid =uuid
useEffect(()=>{
dispatch(getBusinessZonesAuthorityByUuid({authority_uuid})).then((data)=>{
 if(data.payload.success){
  const id = data.payload.data.id
    dispatch(getPackageByAuthorityId(id)).then((data)=>{
 console.log(data,"data")
})
  }
})
},[dispatch])


const confirmDelete = (uuid) => {
    setSelectedUUID(uuid);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUUID) {
      dispatch(deletePackage(selectedUUID)).then((data)=>{
    if (data.payload.success) {
      showToast('success', data.payload.message )
      const id = authority?.id
     dispatch(getPackageByAuthorityId(id))
    }
  })
    }
    setDeleteModalVisible(false);
    setSelectedUUID(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedUUID(null);
  };
const columns = [
  {
    name: 'Name',
    selector: row => row.name,
    sortable: true,
  },
  {
    name: 'Description',
    selector: row => row.description || '-',
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
    name: 'Total Amount',
    selector: row => row.total_amount ?? '₹0',
    sortable: true,
  },
  {
    name: 'Action',
    cell: row => (
      <div className='d-flex gap-2'>
        <Link to={`/view-package/${row.uuid}`} title="View package">
            <FaEye size={20} style={{ cursor: 'pointer', color: '#333' }}/>
          </Link>
        <span
          onClick={() => confirmDelete(row.uuid)}
          className="p-0"
          title="Delete"
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilTrash} size="lg" />
        </span>
         <ConfirmDeleteModal
          visible={deleteModalVisible}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this package?"
        />
        <Link to={`/edit-package/${row.uuid}`}>
          <MdEdit size={20} style={{ cursor: 'pointer', color: '#333' }} />
        </Link>
      </div>
    ),
    ignoreRowClick: true,
    width: '150px',
  },
]

    const filteredData = packages.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase()) 
  );
 
//   return (
//     <div className='container'>
//       {toastData.show && (
//               <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//                 <ToastExample status={toastData.status} message={toastData.message} />
//               </div>
//             )}
//              <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
//                     <div className="d-flex justify-content-between w-75 px-3">
//                       <h4>{authority?.name}</h4>
//                      <Link to={`/add-package/${uuid}`}> <CButton className='custom-button'>Add Package </CButton></Link>
//                     </div>
//                     <input
//                       type="text"
//                       className="form-control w-25"
//                       placeholder="Search by name"
//                       value={filterText}
//                       onChange={(e) => setFilterText(e.target.value)}
//                     />
//                   </div>
     
//       {/* <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         // selectableRows
//         highlightOnHover
//         responsive
//         striped
//       /> */}
//     <div className="row ">
//   {filteredData && filteredData.length > 0 ? (
//     filteredData.map((item) => (
//       <div key={item.uuid} className="col-4 py-2">
//         <PackageCard item={item} onDelete={confirmDelete} />
//       </div>
//     ))
//   ) : (
//     <h5 className="text-center bg-white">Packages Not Found</h5>
//   )}
// </div>
     
//     </div>
   
//   )
const handleDelete= async(uuid,name)=>{
   const isConfirmed = await confirm({
      title: 'Confirm Deletion',
      text: `Are you absolutely sure you want to delete the package "${name}"?`,
      icon: 'error', // Use a more impactful icon
      confirmButtonText: 'Yes, Delete It!',
    });
    if (isConfirmed) {
       dispatch(deletePackage(uuid)).then((data)=>{
        if (data.payload.success) {
          dispatch(getPackageByAuthorityId(authority.id))
        }
       })
    }
   
}

  return (
  <div className='container'>
    {toastData.show && (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
        <ToastExample status={toastData.status} message={toastData.message} />
      </div>
    )}

    <div className="w-100 mb-3 d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-between w-75 px-3">
        <h4>{authority?.name}</h4>
        <Link to={`/add-package/${uuid}`}>
          <CButton className='custom-button'>Add Package</CButton>
        </Link>
      </div>
      <input
        type="text"
        className="form-control w-25"
        placeholder="Search by name"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>

    {/* ---- Cards layout ---- */}
    <div className="row">
      {filteredData && filteredData.length > 0 ? (
        filteredData.map((item) => (
          <div key={item.uuid} className="col-4 py-2">
            <PackageCard item={item} onDelete={()=>{handleDelete(item.uuid,item.name)}}/>
          </div>
        ))
      ) : (
        <h5 className="text-center bg-white">Packages Not Found</h5>
      )}
    </div>

    {/* ---- Single Delete Modal (outside) ---- */}
    <ConfirmDeleteModal
      visible={deleteModalVisible}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Confirm Delete"
      message="Are you sure you want to delete this package?"
    />
  </div>
);
}

export default PackageListing
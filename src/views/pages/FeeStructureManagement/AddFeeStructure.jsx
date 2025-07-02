// import React, { useState, useEffect } from 'react';
// import {
//   CButton,
//   CCol,
//   CRow,
//   CForm,
//   CFormInput,
//   CFormSelect
// } from '@coreui/react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AiOutlineClose } from 'react-icons/ai';
// import {
//   addFeeStructure,
//   updateFeeStructure,
//   getFeeStructures
// } from '../../../store/admin/feeStructureSlice';
// import { ToastExample } from '../../../components/toast/Toast';

// function AddFeeStructure() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const { feestructures } = useSelector((state) => state.feeStructure);

//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [status, setStatus] = useState('1');
//   const [error, setError] = useState('');

//   // Toast states
//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

//   useEffect(() => {
//     if (!feestructures || feestructures.length < 1) {
//       dispatch(getFeeStructures());
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (isEdit && feestructures.length > 0) {
//       const found = feestructures.find((f) => f.uuid === id);
//       if (found) {
//         setName(found.name);
//         setAmount(found.amount);
//         setStatus(found.status);
//       } else {
//         setError('Fee structure not found');
//       }
//     }
//   }, [id, isEdit, feestructures]);

//   const showToast = (status, message) => {
//     setToastData({ show: true, status, message });
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!name.trim()) {
//       showToast('error', 'Name is required');
//       return;
//     }
//     if (!amount || isNaN(amount) || Number(amount) <= 0) {
//       showToast('error', 'Please enter a valid amount');
//       return;
//     }
    

//     const payload = {
//       name,
//       amount: Number(amount),
//       status,
//     };

//     if (isEdit) {
//       dispatch(updateFeeStructure({ id, data: payload })).then((res) => {
//         if (res.payload?.success) {
//           dispatch(getFeeStructures());
//           showToast('success', 'Fee structure added successfully');
//           setTimeout(() => {
//             navigate('/fee-structure');
//           }, 1500); // wait 1.5 seconds before navigating to show toast

//         } else {
//           showToast(res.payload, 'Failed to update fee structure');
//         }
//       });
//     } else {
//       dispatch(addFeeStructure(payload)).then((res) => {
//         if (res.payload?.success) {
//           dispatch(getFeeStructures());
//           showToast('success', 'Fee structure added successfully');
//           setTimeout(() => {
//             navigate('/fee-structure');
//           }, 1500); // wait 1.5 seconds before navigating to show toast

//         } else {
//           showToast(res.payload, 'Failed to add fee structure');
//         }
//       });
//     }
//   };

//   return (
//     <div className="container">
//       {toastData.show && (
//         <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}

//       <div className="card mt-3 position-relative">
//         <button
//           onClick={() => navigate('/fee-structure')}
//           className="btn btn-link position-absolute top-0 end-0 m-2 p-0"
//           style={{ fontSize: '1.5rem' }}
//         >
//           <AiOutlineClose />
//         </button>

//         <div className="card-body">
//           <h4 className="card-title">{isEdit ? 'Edit Fee Structure' : 'Add Fee Structure'}</h4>
//           <CForm onSubmit={handleSubmit}>
//             <CRow className="g-3 m-3">
//               <CCol xs={12}>
//                 <CFormInput
//                   type="text"
//                   placeholder="Fee Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </CCol>

//               <CCol xs={12}>
//                 <CFormInput
//                   type="number"
//                   placeholder="Amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   min={0}
//                   step="any"
//                 />
//               </CCol>

//               <CCol xs={12}>
//                 <CFormSelect
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                 >
//                   <option value="1">Active</option>
//                   <option value="0">Inactive</option>
//                 </CFormSelect>
//               </CCol>

//               {/* {error && (
//                 <CCol xs={12}>
//                   <div className="bg-danger text-white py-2 px-3 rounded">{error}</div>
//                 </CCol>
//               )} */}

//               <CCol xs={12}>
//                 <CButton type="submit" className="custom-button">
//                   {isEdit ? 'Update' : 'Submit'}
//                 </CButton>
//               </CCol>
//             </CRow>
//           </CForm>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddFeeStructure;

import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CFormFeedback,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineClose, AiFillExclamationCircle } from 'react-icons/ai';
import {
  addFeeStructure,
  updateFeeStructure,
  getFeeStructures
} from '../../../store/admin/feeStructureSlice';
import { ToastExample } from '../../../components/toast/Toast';

function AddFeeStructure() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { feestructures } = useSelector((state) => state.feeStructure);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('1');
  const [validation, setValidation] = useState({ name: false, amount: false });

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  useEffect(() => {
    if (!feestructures || feestructures.length < 1) {
      dispatch(getFeeStructures());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && feestructures.length > 0) {
      const found = feestructures.find((f) => f.uuid === id);
      if (found) {
        setName(found.name);
        setAmount(found.amount);
        setStatus(found.status);
      } else {
        showToast('error', 'Fee structure not found');
      }
    }
  }, [id, isEdit, feestructures]);

  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameValid = name.trim() !== '';
    const amountValid = amount && !isNaN(amount) && Number(amount) > 0;

    setValidation({
      name: !nameValid,
      amount: !amountValid,
    });

    if (!nameValid || !amountValid) {
      return;
    }

    const payload = {
      name,
      amount: Number(amount),
      status,
    };

    const action = isEdit
      ? updateFeeStructure({ id, data: payload })
      : addFeeStructure(payload);

    dispatch(action).then((res) => {
      if (res.payload?.success) {
        dispatch(getFeeStructures());
        showToast('success', `Fee structure ${isEdit ? 'updated' : 'added'} successfully`);
        setTimeout(() => navigate('/fee-structure'), 1500);
      } else {
        showToast('error', res.payload?.message || 'An error occurred');
      }
    });
  };

  return (
    <div className="container">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <div className="card mt-3 position-relative">
        <button
          onClick={() => navigate('/fee-structure')}
          className="btn btn-link position-absolute top-0 end-0 m-2 p-0"
          style={{ fontSize: '1.5rem' }}
        >
          <AiOutlineClose />
        </button>

        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Fee Structure' : 'Add Fee Structure'}</h4>
          <CForm onSubmit={handleSubmit} noValidate>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel>
                  Fee Name <span className="text-danger">*</span>
                </CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="text"
                    placeholder="Fee Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    invalid={validation.name}
                  />
                  <CFormFeedback invalid>Please enter a fee name.</CFormFeedback>
                </div>
              </CCol>

              <CCol xs={12}>
                <CFormLabel>
                  Amount <span className="text-danger">*</span>
                </CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={0}
                    step="any"
                    invalid={validation.amount}
                  />
                  <CFormFeedback invalid>Please enter a valid amount.</CFormFeedback>
                </div>
              </CCol>

              <CCol xs={12}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12}>
                <CButton type="submit" className="custom-button">
                  {isEdit ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </div>
    </div>
  );
}

export default AddFeeStructure;

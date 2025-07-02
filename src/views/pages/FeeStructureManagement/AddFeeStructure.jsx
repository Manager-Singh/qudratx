import React, { useState, useEffect, useRef } from 'react';
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
import { AiOutlineClose } from 'react-icons/ai';
import {
  addFeeStructure,
  updateFeeStructure,
  getFeeStructures,
} from '../../../store/admin/feeStructureSlice';
import { ToastExample } from '../../../components/toast/Toast';

function AddFeeStructure() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { feestructures } = useSelector((state) => state.feeStructure);

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('1');

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });

  const formRef = useRef(null);

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
    const form = formRef.current;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const payload = {
        name,
        amount: Number(amount),
        status,
      };

      const action = isEdit
        ? updateFeeStructure({ id, ...payload })
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
    }

    setValidated(true);
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
          <CForm noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="name">
                  Fee Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Fee Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  feedbackInvalid="Please enter a fee name."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="amount">
                  Amount <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={0}
                  required
                  feedbackInvalid="Please enter a valid amount."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
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

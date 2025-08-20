// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   CButton,
//   CCol,
//   CRow,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CCard,
//   CCardBody,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CSpinner,
// } from '@coreui/react';
// import Select from 'react-select';
// import { useDispatch, useSelector } from 'react-redux';
// import { ToastExample } from '../../../../components/toast/Toast';
// import { getClient } from '../../../../store/admin/clientSlice';
// import { addLead, assignLead, getLeadByUuid, updateLead } from '../../../../store/admin/leadSlice';
// import AddClient from '../clients/AddClient';
// import { getEmployees } from '../../../../store/admin/employeeSlice';
// import './Lead.css';
// import { useParams, useNavigate } from 'react-router-dom';

// const originOptions = [
//   { value: 'facebook', label: 'Facebook' },
//   { value: 'whatsapp', label: 'WhatsApp' },
//   { value: 'by_call', label: 'By Call' },
//   { value: 'by_email', label: 'By Mail' },
//   { value: 'in_person', label: 'In Person' },
// ];

// function AddLead() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { uuid } = useParams();

//   // --- SELECTORS ---
//   const { clients, isLoading: clientLoading } = useSelector((state) => state.client);
//   const { employees } = useSelector((state) => state.employee);
//   const { isAdding, isEditing } = useSelector((state) => state.lead);
//   const { user } = useSelector((state) => state.auth);

//   // --- STATE ---
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
//   const [validated, setValidated] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [formdata, setFormdata] = useState({
//     id: '',
//     client_id: '',
//     name: '',
//     email: '',
//     address: '',
//     origin: '',
//   });
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [pageLoading, setPageLoading] = useState(false);

//   // --- DATA FETCHING ---
//   useEffect(() => {
//     const isEditing = !!uuid;
//     setIsEditMode(isEditing);
//     dispatch(getEmployees());

//     if (isEditing) {
//       setPageLoading(true);
//       dispatch(getLeadByUuid(uuid))
//         .unwrap()
//         .then((res) => {
//           const lead = res.data;
//           if (lead) {
//             setFormdata({
//               id: lead?.id,
//               client_id: lead.Client?.id.toString(),
//               name: lead.Client?.name,
//               email: lead.Client?.email,
//               address: lead.Client?.address,
//               origin: lead?.origin,
//             });

//             if (lead.assigned_to) {
//               const assignedEmp = lead.employees.find((e) => e.id === lead.assigned_to);
//               if (assignedEmp) {
//                 setSelectedEmployee({ value: assignedEmp.id, label: assignedEmp.name });
//               }
//             }
//           }
//         })
//         .catch((err) => {
//           showToast('error', err.message || 'Failed to fetch lead data.');
//           navigate('/all-lead');
//         })
//         .finally(() => {
//           setPageLoading(false);
//         });
//     } else {
//       dispatch(getClient({ page: 1, limit: 10, search: '' }));
//     }
//   }, [dispatch, uuid, navigate]);

//   // --- HANDLERS ---
//   const showToast = useCallback((status, message) => {
//     setToastData({ show: true, status, message });
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
//   }, []);

//   const handleClientChange = (selectedOption) => {
//     if (selectedOption) {
//       const selectedClient = clients.find((c) => c.id === selectedOption.value);
//       if (selectedClient) {
//         setFormdata((prev) => ({
//           ...prev,
//           client_id: selectedClient.id.toString(),
//           name: selectedClient.name,
//           email: selectedClient.email,
//           address: selectedClient.address,
//         }));
//       }
//     } else {
//       setFormdata({ client_id: '', name: '', email: '', address: '', origin: '' });
//       setSelectedEmployee(null);
//     }
//   };

//   const handleClientAdded = (newClient) => {
//     dispatch(getClient({ page: 1, limit: 10, search: '' })).then(() => {
//       setFormdata((prev) => ({
//         ...prev,
//         client_id: newClient.id?.toString() || '',
//         name: newClient.name || '',
//         email: newClient.email || '',
//         address: newClient.address || '',
//       }));
//     });
//     setModalVisible(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     if (form.checkValidity() === false || !formdata.client_id) {
//       e.stopPropagation();
//       setValidated(true);
//       return;
//     }

//     try {
//       let leadId = formdata.id;
//       if (isEditMode) {
//         // --- EDIT LOGIC ---
//         // ✅ **FIXED**: Sending the entire formdata object for update.
//         const editPayload = {
//           uuid,
//           formdata: formdata, // Send the full form data
//         };
//         const res = await dispatch(updateLead(editPayload)).unwrap();
//         showToast('success', res.message || 'Lead updated successfully!');
//       } else {
//         // --- ADD LOGIC ---
//         const res = await dispatch(addLead(formdata)).unwrap();
//         leadId = res.data?.id?.toString() || '';
//         showToast('success', res.message || 'Lead added successfully!');
//       }

//       // --- ASSIGNMENT LOGIC (for both add and edit) ---
//       if (selectedEmployee && user?.id && leadId) {
//         const assignData = {
//           lead_id: leadId,
//           assigned_to: selectedEmployee.value.toString(),
//           assigned_by: user.id.toString(),
//           updated_by: user.id.toString(),
//           status: 'inactive',
//         };
//         const assignRes = await dispatch(assignLead(assignData)).unwrap();
//         showToast('success', assignRes.message || 'Lead assigned successfully!');
//       }

//       navigate('/all-lead');
//     } catch (err) {
//       showToast('error', err.message || `Error ${isEditMode ? 'updating' : 'adding'} lead.`);
//     }
//   };

//   // --- OPTIONS FOR SELECTS ---
//   const clientOptions = clients.map((client) => ({
//     value: client.id,
//     label: client.name,
//   }));

//   const employeeOptions = employees.map((emp) => ({
//     value: emp.id,
//     label: emp.name,
//   }));

//   const selectedClientOption =
//     clientOptions.find((opt) => opt.value.toString() === formdata.client_id) ||
//     (isEditMode && formdata.client_id ? { value: formdata.client_id, label: formdata.name } : null);

//   const isLoading = isAdding || isEditing;

//   if (pageLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       {toastData.show && (
//         <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}

//       <CCard>
//         <CCardBody>
//           <h4 className="card-title mb-4">{isEditMode ? 'Edit Lead' : 'Add Lead'}</h4>

//           {clientLoading && !isEditMode ? (
//             <div className="text-center my-4">
//               <CSpinner color="primary" />
//             </div>
//           ) : (
//             <CForm noValidate validated={validated} onSubmit={handleSubmit}>
//               <CRow className="g-3 m-3">
//                 <CCol md={6}>
//                   <CFormLabel htmlFor="client_id">
//                     Client <span className="text-danger">*</span>
//                   </CFormLabel>
//                   <div className="d-flex gap-2">
//                     <div style={{ flex: 1 }}>
//                       <Select
//                         id="client_id"
//                         name="client_id"
//                         value={selectedClientOption}
//                         onChange={handleClientChange}
//                         options={clientOptions}
//                         placeholder="Search & Select Client"
//                         isClearable
//                         isDisabled={isEditMode}
//                       />
//                     </div>
//                     {!isEditMode && (
//                       <CButton color="primary" onClick={() => setModalVisible(true)}>
//                         + Add Client
//                       </CButton>
//                     )}
//                   </div>
//                 </CCol>

//                 {formdata.client_id && (
//                   <>
//                     <CCol md={6}>
//                       <CFormLabel>Client Name</CFormLabel>
//                       <CFormInput value={formdata.name} disabled readOnly />
//                     </CCol>
//                     <CCol md={6}>
//                       <CFormLabel>Email</CFormLabel>
//                       <CFormInput value={formdata.email} disabled readOnly />
//                     </CCol>
//                     <CCol md={6}>
//                       <CFormLabel>Address</CFormLabel>
//                       <CFormInput value={formdata.address} disabled readOnly />
//                     </CCol>
//                     <CCol md={6}>
//                       <CFormLabel htmlFor="origin">Origin</CFormLabel>
//                       <Select
//                         id="origin"
//                         name="origin"
//                         value={originOptions.find((opt) => opt.value === formdata.origin) || null}
//                         onChange={(selectedOption) =>
//                           setFormdata((prev) => ({ ...prev, origin: selectedOption?.value || '' }))
//                         }
//                         options={originOptions}
//                         placeholder="Select Origin"
//                         isClearable
//                       />
//                     </CCol>
//                     {user.role === 'admin' && (
//                       <CCol md={6}>
//                         <CFormLabel htmlFor="employee_id">Assign to Employee</CFormLabel>
//                         <Select
//                           id="employee_id"
//                           name="employee_id"
//                           value={selectedEmployee}
//                           onChange={setSelectedEmployee}
//                           options={employeeOptions}
//                           placeholder="Select Employee"
//                           isClearable
//                         />
//                       </CCol>
//                     )}
//                     <CCol xs={12} className="d-flex justify-content-end">
//                       <CButton type="submit" color="success" disabled={isLoading}>
//                         {isLoading ? 'Saving...' : isEditMode ? 'Update Lead' : 'Add Lead'}
//                       </CButton>
//                     </CCol>
//                   </>
//                 )}
//               </CRow>
//             </CForm>
//           )}
//         </CCardBody>
//       </CCard>

//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
//         <CModalHeader onClose={() => setModalVisible(false)}>Add New Client</CModalHeader>
//         <CModalBody>
//           <AddClient onSubmit={handleClientAdded} onCancel={() => setModalVisible(false)} />
//         </CModalBody>
//       </CModal>
//     </div>
//   );
// }

// export default AddLead;


import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CCard,
  CCardBody,
  CModal,
  CModalHeader,
  CModalBody,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { ToastExample } from '../../../../components/toast/Toast'
import { getClient, getClientByUuid } from '../../../../store/admin/clientSlice'
import { addLead, assignLead } from '../../../../store/admin/leadSlice'
import AddClient from '../clients/AddClient'
import { getEmployees } from '../../../../store/admin/employeeSlice'
import './Lead.css'
import { useNavigate, useParams } from 'react-router-dom'

const originOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'by_call', label: 'By Call' },
  { value: 'by_email', label: 'By Mail' },
  { value: 'in_person', label: 'In Person' }
]

function AddLead() {
  const dispatch = useDispatch()
  const navigate= useNavigate()
  const { clients, isLoading: clientLoading } = useSelector((state) => state.client)
  const { employees } = useSelector((state) => state.employee)
  const { isAdding } = useSelector((state) => state.lead)
  const { user } = useSelector((state) => state.auth)
  
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [validated, setValidated] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const [formdata, setFormdata] = useState({
    client_id: '',
    name: '',
    email: '',
    address: '',
    phone:'',
    notes:'',
    origin: '', 
  })
  const {uuid}= useParams()
 

  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
  if (uuid) {
    dispatch(getClientByUuid(uuid)).then((res) => {
      const client = res.payload?.data
      if (client) {
        setFormdata((prev) => ({
          ...prev,
          client_id: client.id.toString(),
          name: client.name,
          email: client.email,
          address: client.address,
          phone:client.phone,
          notes:client.notes
        }))
      }
    })
  } else {
    dispatch(getClient({ page: 1, limit: 10, search: ''}));
  }

  dispatch(getEmployees())
}, [dispatch, uuid])

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      const selectedClient = clients.find((c) => c.id === selectedOption.value)
      if (selectedClient) {
        setFormdata((prev) => ({
          ...prev,
          client_id: selectedClient.id.toString(),
          name: selectedClient.name,
          email: selectedClient.email,
          address: selectedClient.address,
          phone:selectedClient.phone,
          notes:selectedClient.notes
        }))
      }
    } else {
      setFormdata({
        client_id: '',
        name: '',
        email: '',
        address: '',
        phone:'',
        origin: '',
        notes:'',
      })
      setSelectedEmployee(null)
    }
  }

  const handleClientAdded = (newClient) => {
    setFormdata((prev) => ({
      ...prev,
      client_id: newClient.id?.toString() || '',
      name: newClient.name || '',
      email: newClient.email || '',
      address: newClient.address || '',
      phone: newClient.phone || '',
       notes: newClient.notes || '',
    }))
    setModalVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false || !formdata.client_id) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    try {
      const res = await dispatch(addLead(formdata)).unwrap()
      const leadId = res.data?.id?.toString() || ''
             
             if (res.success) {
               showToast('success', res.message || 'Lead added successfully!')
                setTimeout(() => {
            navigate('/all-lead')
           }, 1500);
             }
     

      if (selectedEmployee && user?.id && leadId) {
        const assignData = {
          lead_id: leadId,
          assigned_to: selectedEmployee.value.toString(),
          assigned_by: user.id.toString(),
          updated_by: user.id.toString(),
          status: 'inactive',
        }

        const assignRes = await dispatch(assignLead(assignData)).unwrap()
        if (assignRes.success) {
           showToast('success', assignRes.message || 'Lead assigned successfully!')
           setTimeout(() => {
            navigate('/all-lead')
           }, 1500);
           
        }
       
      }

      // Reset form
      setFormdata({
        client_id: '',
        name: '',
        email: '',
        address: '',
        phone:'',
        notes:'',
        origin: '',
      })
      setSelectedEmployee(null)
      setValidated(false)
    } catch (err) {
      showToast('error', err.message || 'Error adding or assigning lead.')
    }

    setValidated(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setValidated(false)
  }

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }))

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }))

  const selectedClientOption = clientOptions.find(
    (opt) => opt.value.toString() === formdata.client_id
  )

  return (
    <div className="container mt-4">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}

      <CCard>
        <CCardBody>
          <h4 className="card-title mb-4">Add Lead</h4>

          {clientLoading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
            </div>
          ) : (
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow className="g-3 m-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="client_id">
                    Client <span className="text-danger">*</span>
                  </CFormLabel>
                  <div className="d-flex gap-2">
                    <div style={{ flex: 1 }}>
                      <Select
                        id="client_id"
                        name="client_id"
                        value={selectedClientOption}
                        onChange={handleClientChange}
                        options={clientOptions}
                        placeholder="Search & Select Client"
                        isClearable
                      />
                    </div>
                    <CButton color="primary" onClick={() => setModalVisible(true)}>
                      + Add Client
                    </CButton>
                  </div>
                </CCol>

                {formdata.client_id && (
                  <>
                    <CCol md={6}>
                      <CFormLabel>Client Name</CFormLabel>
                      <CFormInput value={formdata.name} disabled readOnly />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput value={formdata.email} disabled readOnly />
                    </CCol>
                     <CCol md={6}>
                      <CFormLabel>phone</CFormLabel>
                      <CFormInput value={formdata.phone} disabled readOnly />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Address</CFormLabel>
                      <CFormInput value={formdata.address} disabled readOnly />
                    </CCol>
                     <CCol md={6}>
                      <CFormLabel>Notes</CFormLabel>
                      <CFormInput value={formdata.notes} disabled readOnly />
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="origin">Origin</CFormLabel>
                      <Select
                        id="origin"
                        name="origin"
                        value={originOptions.find((opt) => opt.value === formdata.origin) || null}
                        onChange={(selectedOption) =>
                          setFormdata((prev) => ({
                            ...prev,
                            origin: selectedOption?.value || '',
                          }))
                        }
                        options={originOptions}
                        placeholder="Select Origin "
                        isClearable
                       
                      />
                    </CCol>
                    {user.role == "admin" &&  <CCol md={6}>
                      <CFormLabel htmlFor="employee_id">Assign to Employee</CFormLabel>
                      <Select
                        id="employee_id"
                        name="employee_id"
                        value={selectedEmployee}
                        onChange={setSelectedEmployee}
                        options={employeeOptions}
                        placeholder="Select Employee"
                        isClearable
                      />
                    </CCol>}
                   

                    <CCol xs={12} className="d-flex justify-content-end">
                      <CButton type="submit" color="success" disabled={isAdding}>
                        {isAdding ? 'Saving...' : 'Add Lead'}
                      </CButton>
                    </CCol>
                  </>
                )}
              </CRow>
            </CForm>
          )}
        </CCardBody>
      </CCard>

      {/* Add Client Modal */}
      <CModal visible={modalVisible} onClose={handleModalClose} backdrop="static">
        <CModalHeader onClose={handleModalClose}>Add New Client</CModalHeader>
        <CModalBody>
          <AddClient onSubmit={handleClientAdded} />
        </CModalBody>
      </CModal>
    </div>
  )
}

export default AddLead

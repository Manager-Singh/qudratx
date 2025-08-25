
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import HeadingBar from './Components/HeadingBar';
import { getData } from '../../../../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
// ✅ 1. Import the new action
import {
  updateProposal,
  updateProposalPdf,
  getProposalByUUID,
  sendToClient,
  approveProposalStatus, // Import the action
} from '../../../../../store/admin/proposalSlice';
import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CFormSelect,
} from '@coreui/react';
import { ToastExample } from '../../../../../components/toast/Toast';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import axios from 'axios';
import rakez from '../../../../../assets/proposal_images/rakez.jpg';
import shams from '../../../../../assets/proposal_images/shams.jpg';
import ifza from '../../../../../assets/proposal_images/ifza.jpg';
import dubaiSouth from '../../../../../assets/proposal_images/dubaiSouth.jpeg';
import dmcc from '../../../../../assets/proposal_images/dmcc.jpg';
import dedDubai from '../../../../../assets/proposal_images/dedDubai.jpg';
import main_cover from '../../../../../assets/proposal_images/main_proposal.jpg';
import { useParams } from 'react-router-dom';
import useConfirm from '../../../../../components/SweetConfirm/useConfirm';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const ProposalSummary = () => {
  const MySwal = withReactContent(Swal);
  const confirm = useConfirm()
  const { uuid } = useParams();
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const { proposal } = useSelector((state) => state.proposal);
  const [showClientModal, setShowClientModal] = useState(false);

  const [clientEmail, setClientEmail] = useState('');
  const dispatch = useDispatch();
  const proposalRef = useRef(null);
  const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
  const showToast = (status, message) => {
    setToastData({ show: true, status, message });
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
  };
  

  // const imageMap = {
  //   SHAMS: shams,
  //   RAKEZ: rakez,
  //   IFZA: ifza,
  //   'DUBAI SOUTH': dubaiSouth,
  //   DMCC: dmcc,
  //   'DED DUBAI': dedDubai,
  // };
const imageMap = {}
  useEffect(() => {
    if (uuid) {
      dispatch(getProposalByUUID(uuid));
    }
  }, [uuid, dispatch]);

  // ✅ 2. Sync local status with proposal data from Redux
  useEffect(() => {
    if (proposal) {
      if (proposal.approval_status == 1) {
        setStatus('approve');
      } else if (proposal.approval_status == 2) {
        setStatus('pending');
      } else {
        setStatus('unapprove');
      }
    }
  }, [proposal]);

  // ... (handleGeneratePdf, webSetting logic, etc. remain the same) ...
  const handleGeneratePdf = async () => { 
   if (proposalRef.current) { 
     const element = proposalRef.current; 
     const pdfFileName = `${proposal.proposal_number}.pdf`; 
     const opt = { 
       margin: 10, 
       filename: pdfFileName, 
       image: { type: 'jpeg', quality: 0.7 }, 
       html2canvas: { 
       scale: 2, 
       useCORS: true,       
       allowTaint: true,     
       logging: true,        
     }, 
       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
     }; 

     try { 
       const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob'); 
       const formData = new FormData(); 
       formData.append('generated_pdf', pdfBlob, pdfFileName); 
         const isConfirmed = await confirm({
      title: 'Confirm Generate PDF',
      text: `Are you absolutely sure you want to generate the pdf "${proposal.proposal_number}"?`,
      icon: 'info', // Use a more impactful icon
      confirmButtonText: 'Yes, Generate It!',
    });
    if (isConfirmed) {
       dispatch(updateProposalPdf({ 
         uuid: proposal.uuid,
         data:formData 
       })).then((data)=>{ 
         if (data.payload.success) { 
            showToast('success', 'Proposal generated successfully'); 
            dispatch(getProposalByUUID(proposal.uuid)) 
         } 
       }) 
    }
      

     } catch (error) { 
       console.error('PDF generation/upload failed:', error); 
     } 
   } 
 }; 
   const [webSetting, setWebSetting] = useState({ 
     id: null, 
     uuid: '', 
     name: '', 
     email: '', 
     phone: '', 
     address: { 
       city: '', 
       type: '', 
       line1: '', 
       state: '', 
       country: '', 
       postal_code: '', 
     }, 
     terms_and_conditions: '', 
     bank_details: { 
       bank: '', 
       branch: '', 
       bank_title: '', 
       swift_code: '', 
       iban_number: '', 
       account_number: '', 
     }, 
     description: '', 
     logo: '', 
     icon: null, 
     created_at: '', 
     updated_at: '', 
     deleted_at: null, 
     updated_by: null, 
     last_update: null, 
   }); 

   useEffect(() => { 
     const fetchWebSetting = async () => { 
       try { 
         const res = await getData('/admin/web-setting-info'); 
         if (res.success) { 
           const data = res.data; 
          
           setWebSetting({ 
             id: data.id, 
             uuid: data.uuid, 
             name: data.name?.replace(/^"|"$/g, ''), 
             email: data.email?.replace(/^"|"$/g, ''), 
             phone: data.phone?.replace(/^"|"$/g, ''), 
             address: { 
               city: data.address?.[0]?.city || '', 
               type: data.address?.[0]?.type || '', 
               line1: data.address?.[0]?.line1 || '', 
               state: data.address?.[0]?.state || '', 
               country: data.address?.[0]?.country || '', 
               postal_code: data.address?.[0]?.postal_code || '', 
             }, 
             terms_and_conditions: data.terms_and_conditions?.replace(/^"|"$/g, ''), 
             bank_details: { 
               bank: data.bank_details?.bank || '', 
               branch: data.bank_details?.branch || '', 
               bank_title: data.bank_details?.bank_title || '', 
               swift_code: data.bank_details?.swift_code || '', 
               iban_number: data.bank_details?.iban_number || '', 
               account_number: data.bank_details?.account_number || '', 
             }, 
             description: data.description?.replace(/^"|"$/g, '') || '', 
             logo: data.logo, 
             icon: data.icon, 
             created_at: data.created_at, 
             updated_at: data.updated_at, 
             deleted_at: data.deleted_at, 
             updated_by: data.updated_by, 
             last_update: data.last_update, 
           }); 
         } else { 
           console.error('Error fetching company info:', res.message); 
         } 
       } catch (error) { 
         console.error('API call failed:', error); 
       } 
     }; 
     fetchWebSetting(); 
   }, []); 
   const user = useSelector((state) => state.auth.user); 
   // handle proposal approval
   const HandleSendApproval = async () => {
    
    const basePayload = {
      employee_approval: 1,
      approval_status: 2,
    };

    // Case 1: The proposal was unapproved (status is 0) and needs to be resent with a reason.
    if (proposal.approval_status === 0) {
      MySwal.fire({
        title: 'Resend Proposal for Approval',
        html: `Please provide a brief reason for resubmitting proposal <strong>#${proposal.proposal_number}</strong>.`,
        input: 'textarea', // Use a textarea for the reason
        inputLabel: 'Reason for Resubmission',
        inputPlaceholder: 'Type your reason here...',
        showCancelButton: true,
        confirmButtonText: 'Resend for Approval',
        showLoaderOnConfirm: true,
        
        // Validate that a reason was entered
        inputValidator: (value) => {
          if (!value || value.trim().length < 10) {
            return 'Please enter a meaningful reason (at least 10 characters).';
          }
        },

        // This runs after the user enters a reason and clicks confirm
        preConfirm: (reason) => {
          const finalPayload = { ...basePayload, reason }; // Add the reason to the payload

          // Dispatch the update action and return the promise for the loading state
          return dispatch(updateProposal({ uuid: proposal.uuid, data: finalPayload }))
            .unwrap()
            .catch(error => {
              Swal.showValidationMessage(`Request failed: ${error.message}`);
            });
        },

        allowOutsideClick: () => !Swal.isLoading(),

      }).then((result) => {
        if (result.isConfirmed) {
          showToast('success', 'Proposal has been resent for approval.');
          dispatch(getProposalByUUID(proposal.uuid)); // Refresh the data
        }
      });
    } 
    // Case 2: This is the first time the proposal is being sent for approval.
    else {
      const isConfirmed = await confirm({
        title: 'Confirm Send Approval',
        text: `Are you absolutely sure you want to send proposal #${proposal.proposal_number} for approval?`,
        icon: 'info',
        confirmButtonText: 'Yes, Send It!',
      });

      if (isConfirmed) {
        dispatch(updateProposal({ uuid: proposal.uuid, data: basePayload }))
          .unwrap()
          .then(() => {
            showToast('success', 'Proposal sent for approval.');
            dispatch(getProposalByUUID(proposal.uuid));
          })
          .catch((error) => {
            showToast('error', `Failed to send: ${error.message}`);
          });
      }
    }
  };
   const HandleSendToClient = async() => { 
   if (proposal?.client_info && Object.keys(proposal.client_info).length > 0) { 
    const isConfirmed = await confirm({
      title: 'Confirm Send To Client',
      text: `Are you absolutely sure you want to send the proposal to client. proposal number is "${proposal.proposal_number}"?`,
      icon: 'info', // Use a more impactful icon
      confirmButtonText: 'Yes, Send It!',
    });
    if (isConfirmed) {
      dispatch(sendToClient({uuid:proposal.uuid})).then((data)=>{ 
       if (data.payload.success) { 
         showToast('success', 'Proposal sent to client successfully.'); 
       } 
     }) 
    }
       
   } else { 
    
     handleSendToClientWithAlert() 
   } 
 }; 
  const handleDownload = async () => { 
   try { 
     const fileUrl = `${import.meta.env.VITE_SERVER_URL}/${proposal.pdf_path}`; 
     const response = await axios.get(fileUrl, { responseType: 'blob' }); 
      
     const blob = response.data; 
     const link = document.createElement('a'); 
     link.href = URL.createObjectURL(blob); 
     link.download = 'proposal_summary.pdf'; 
     document.body.appendChild(link); 
     link.click(); 
     document.body.removeChild(link); 
     URL.revokeObjectURL(link.href); 
   } catch (error) { 
       showToast('error', 'Can not find Pdf. please generate first'); 
     console.error('Download error:', error); 
   } 
 }; 
 const selectedImage = imageMap[proposal?.authority_name?.toUpperCase()]  
                       || main_cover; 


  // ✅ 3. Centralized function to handle the API dispatch
  const handleConfirmApproval = (action, reason = null) => {
    const payload = {
      uuid: proposal.uuid,
      action: action,
    };

    if (reason) {
      payload.reason = reason;
    }

    dispatch(approveProposalStatus(payload))
      .unwrap()
      .then(() => {
        showToast('success', `Proposal ${action}ed successfully.`);
        setShowReasonModal(false); // Close modal on success
        dispatch(getProposalByUUID(uuid)); // Re-fetch the proposal data
      })
      .catch((error) => {
        showToast('danger', error.message || `Failed to ${action} proposal.`);
        console.error('API Error:', error);
      });
  };

  // ✅ 4. Updated handleChange to open modal or dispatch directly
  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // Update UI immediately

    if (newStatus === 'unapprove') {
      setReason(''); // Clear any previous reason
      setShowReasonModal(true);
    } else if (newStatus === 'approve') {
      handleConfirmApproval('approve');
    }
  };
  
  // ✅ 5. Updated handleConfirmUnapprove to use the central handler
  const handleConfirmUnapprove = () => {
    if (!reason.trim()) {
      showToast('warning', 'Please provide a reason for unapproval.');
      return;
    }
    handleConfirmApproval('unapprove', reason);
  };

  // ✅ 6. Updated handleCancelModal to revert the state correctly
  const handleCancelModal = () => {
    setShowReasonModal(false);
    // Revert the status dropdown to its original state from Redux
    if (proposal) {
      if (proposal.approval_status == 1) setStatus('approve');
      else if (proposal.approval_status == 2) setStatus('pending');
      else setStatus('unapprove');
    }
  };

 

  // Add this new handler function to your component
  const handleSendToClientWithAlert = () => {
    MySwal.fire({
      title: 'Send Proposal to Client',
      html: `Enter the client's email to send proposal <strong>#${proposal.proposal_number}</strong>.`,
      input: 'email', // Use the built-in email input
      inputLabel: 'Client Email Address',
      inputPlaceholder: 'name@example.com',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send It!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showLoaderOnConfirm: true,
       allowOutsideClick:false,
       allowEscapeKey:false,
      

       
      // 1. Handle validation directly inside the alert
      inputValidator: (value) => {
        if (!value) {
          return 'An email address is required!';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.';
        }
      },

      // 2. This function runs after validation passes but before the alert closes
      preConfirm: (clientEmail) => {
        // This is where you dispatch your Redux action.
        // We return the dispatch promise so SweetAlert can handle the loading state.
        return dispatch(sendToClient({ uuid: proposal.uuid, client_email: clientEmail }))
          .unwrap() // Use unwrap() to easily catch errors
          .catch(error => {
            Swal.showValidationMessage(`Request failed: ${error.message}`);
          });
      },
      
      // allowOutsideClick: () => !Swal.isLoading()

    }).then((result) => {
      // 3. This block runs only after the preConfirm promise succeeds
      if (result.isConfirmed) {
        // The result.value is the payload from your successful Redux action
        if (result.value && result.value.success) {
           MySwal.fire({
            icon: 'success',
            title: 'Proposal Sent!',
            text: `The proposal has been successfully sent to the client.`,
          });
        }
      }
    });
  };

  return proposal ? (
    <div>
       {/* Modal remains the same */}
      <CModal visible={showReasonModal} onClose={handleCancelModal}>
        <CModalHeader>
          <h5>Reason for Unapproval</h5>
        </CModalHeader>
        <CModalBody>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Enter the reason why this proposal is being unapproved..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-3 d-flex justify-content-end gap-2">
            <CButton color="secondary" onClick={handleCancelModal}>
              Cancel
            </CButton>
            <CButton color="danger" onClick={handleConfirmUnapprove}>
              Confirm Unapproval
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      {/* ... (toast and client email modal remain the same) ... */}
       {toastData.show && ( 
           <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}> 
             <ToastExample status={toastData.status} message={toastData.message} /> 
           </div> 
                         )} 
                        

      <div className='d-flex  justify-content-end'>
             
          {user.role === 'admin' ? (
            <div className="d-flex align-items-center mt-2 mt-md-0">
              <label htmlFor="status-select" className="me-2 fw-semibold">
                Approval Status:
              </label>
              <CFormSelect
                id="status-select"
                onChange={handleChange}
                value={status}
                style={{ width: '150px' }}
                aria-label="Select approval status"
             
              >
                {/* Only show 'Pending' as a disabled option if it's the current status */}
                {status === 'pending' && <option disabled value="pending">Pending</option>}
                <option value="approve">Approved</option>
                <option value="unapprove">Unapproved</option>
              </CFormSelect>
            </div>
          ) : (
            <div>
              <span className="fw-bold">Approval Status:</span>{' '}
              {proposal?.approval_status == 2
                ? 'Pending'
                : proposal?.approval_status == 1
                ? 'Approved'
                : 'Unapproved'}
            </div>
          )}
      </div>

      <div className="d-flex justify-content-between">
        <div>
          {/* ... (other buttons remain the same) ... */}
           { 
         proposal?.approval_status == 1 && !proposal?.generated_pdf && <button 
         onClick={handleGeneratePdf} 
         className='custom-button m-2' 
       > 
        Generate PDF 
       </button> 
          
       } 
        {proposal?.employee_approval == 0 && proposal?.approval_status == 2 && user.role=="employee" && <CButton className="custom-button"   onClick={HandleSendApproval}> 
                            Send To Approval 
                     </CButton> } 
                      { proposal?.approval_status == 0 && user.role=="employee" && <CButton className="custom-button"   onClick={HandleSendApproval}> 
                            Resend To Approval 
                     </CButton> } 

          {proposal?.approval_status == 1  && proposal.generated_pdf && <CButton className="custom-button m-2"   onClick={HandleSendToClient}> 
                      Send To Client 
               </CButton> } 
          
        </div>
        {/* ... (Download button and other elements remain the same) ... */}
         {proposal?.generated_pdf  && proposal?.approval_status == 1 && <div className='d-flex justify-content-end p-2'> 
        <CButton 
   onClick={handleDownload} 
   title='Download PDF' 
 > 
   <HiOutlineDocumentDownload size={30} /> 
 </CButton> 
       </div>} 
      </div>
       {proposal?.approval_status == 2 && proposal?.employee_approval == 1 && user.role== 'employee' && <div > 
       Wating for admin approval after the approval you can generate the pdf </div>} 
      {/* ... (The rest of your JSX for the proposal content remains unchanged) ... */}
      <div className='py-2'></div>
      <div id="proposal-pdf-content" ref={proposalRef} style={{ padding: '20px', background: '#fff', color: '#000', position: 'relative', top: 0, left: 0, width: '100%', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', }}>  
         <div style={{ width: '100%', height: '100%', display: 'flex', margin: 'auto' }}> 

           <img src={selectedImage} alt={proposal?.authority_name || "Default"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
         </div> 
         <div 
 
/>
         <HeadingBar title={`${proposal?.authority_name}  ${proposal?.zone_name}`} position="center"/> 
         <ul> 
           {(proposal?.business_activities || []).map((act, i) => ( <li key={i} style={{ marginBottom: '20px', marginTop: '20px' }}> <p> <span className=''style={{marginRight:"110px"}}>Activity Code</span>:<strong className='ms-3'> {act?.activity_code}</strong> </p> <p> <span className=''style={{marginRight:"105px"}}>Activity Name</span>:<strong className='ms-3'>{act?.activity_name}</strong> </p> {act?.description && <div className="row"> <div className="col-2" style={{marginRight:"45px"}}>Activity Description</div>: <div className="col-9 ">{act?.description}</div> </div>} </li> ))} 
         </ul> 
         <HeadingBar title={`Number of Visas: ${proposal?.business_questions?.visas || 0}`} position="center" /> 
         <div style={{ overflowX: 'auto', marginTop: '20px' }}> 
           <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", boxShadow: '0 6px 15px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden', }} > 
             <thead> 
               <tr style={{ backgroundColor: '#4a148c', color: 'white' }}> 
                 <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', fontSize: '16px', }} > # </th> 
                 <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '600', fontSize: '16px', }} > Item </th> 
                 <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '600', fontSize: '16px', }} > Quantity </th> 
                 <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600', fontSize: '16px', }} > Cost </th> 
               </tr> 
             </thead> 
             <tbody> 
               {(proposal?.what_to_include || []).map((item, index) => ( 
                 <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', transition: 'background-color 0.3s ease', cursor: 'default', }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white')} > 
                   <td style={{ backgroundColor: '#fff', color: '#333', fontWeight: '700', textAlign: 'center', padding: '12px 20px', }} > {index + 1} </td> 
                   <td style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '500', color: '#333', }} > {item.title} </td> 
                   <td style={{ padding: '12px 20px', textAlign: 'center', color: '#555', }} > {item.quantity} </td> 
                   <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: '600', color: '#333', }} > {item.cost} </td> 
                 </tr> 
               ))} 
               <tr style={{ backgroundColor: '#f0f0f0' }}> 
                 <td colSpan={3} style={{ textAlign: 'right', padding: '14px 20px', fontWeight: '700', fontSize: '16px', color: '#333', borderTop: '2px solid #ccc', }} > Total </td> 
                 <td style={{ textAlign: 'right', padding: '14px 20px', fontWeight: '700', fontSize: '16px', color: '#333', borderTop: '2px solid #ccc', }} > {proposal?.total_amount ?? 0} </td> 
               </tr> 
             </tbody> 
           </table> 
           <HeadingBar title="Required Documents" position="center" /> 
           <ul style={{ paddingLeft: '20px', marginTop: '10px' }}> 
             {(proposal?.required_documents || []).map((doc, i) => ( <li key={i} style={{ marginBottom: '8px' }}> {doc.name} </li> ))} 
           </ul> 
         </div> 
         <HeadingBar title="Benefits" position="center" /> 
         <div style={{ marginBottom: '25px' }}> 
           <ul style={{ paddingLeft: '20px', marginTop: '10px' }}> 
             {(proposal?.benefits || []).map((item, i) => ( <li key={i} style={{ marginBottom: '8px' }}> {item.name} </li> ))} 
           </ul> 
         </div> 
         <div> 
           <HeadingBar title="Other Benefits" position="center" /> 
           <ul style={{ paddingLeft: '20px', marginTop: '10px' }}> 
             {(proposal?.other_benefits || []).map((item, i) => ( <li key={i} style={{ marginBottom: '8px' }}> {item.name} </li> ))} 
           </ul> 
         </div> 
         <div style={{ marginBottom: '25px' }}> 
           <HeadingBar title="Scope of Work" position="center" /> 
           <ul style={{ paddingLeft: '20px', marginTop: '10px' }}> 
             {(proposal?.scope_of_work || []).map((item, i) => ( <li key={i} style={{ marginBottom: '8px' }}> {item.name} </li> ))} 
           </ul> 
         </div> 
         <div> 
           <HeadingBar title="Notes" position="center" /> 
           <div style={{ backgroundColor: '#f7f7f7', padding: '15px', borderRadius: '4px', whiteSpace: 'pre-wrap', lineHeight: '1.6', }} > {proposal?.notes || 'No notes available.'} </div> 
         </div> 
         <HeadingBar title={`${webSetting.name}`} position="center" /> 
         <div> <p> Created at:<strong>{new Date().toLocaleDateString()}</strong> </p> <p> Website:<strong> www.FZCS.com</strong> </p> <p> Email:<strong> {user.email}</strong> </p> </div> 
         <HeadingBar title="Agreement" position="center" /> 
         <p>{webSetting.terms_and_conditions}</p> 
         <div className="signed-section" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px', flexWrap: 'wrap' }}> 
           <div className="signed-single" style={{ flex: '1', minWidth: '300px', margin: '10px' }}> 
             <HeadingBar title="Signed for and on behalf of FZCS" position="center" /> 
             <span> <strong>Consultant name</strong> <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>{user.name}</p> </span> 
             <span> <strong>Date</strong> <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>{new Date().toLocaleDateString()}</p> </span> 
           </div> 
           <div className="signed-single" style={{ flex: '1', minWidth: '300px', margin: '10px' }}> 
             <HeadingBar title="Signed for and on behalf of the Client" position="center" /> 
             <span> <strong>Name</strong> <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>{proposal?.client_info?.name}</p> </span> 
             <span> <strong>Date</strong> <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>{new Date().toLocaleDateString()}</p> </span> 
           </div> 
         </div> 
         <div> 
           <HeadingBar title={`${webSetting.address.city} ${webSetting.address.type}`} position="center" /> 
           <div> <p> <strong>Address</strong>: {webSetting.address.line1}, {webSetting.address.city},{' '} {webSetting.address.state} {webSetting.address.country} {webSetting.address.postal_code} </p> <p> <strong>Contact Us</strong>: {webSetting.phone} </p> <p> <strong>Email</strong>: {webSetting.email} </p> </div> 
         </div> 
       </div> 
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="text-center">
        <h4 className=" mb-2">Proposal does not exist</h4>
        <p className="text-muted">Please check the link or go back to proposals list.</p>
      </div>
    </div>
  );
};

export default ProposalSummary;


// import React, { useState, useEffect, useRef } from 'react';
// import html2pdf from 'html2pdf.js';
// import HeadingBar from './Components/HeadingBar';
// import { getData } from '../../../../../utils/api';
// import { useDispatch, useSelector } from 'react-redux';
// // ✅ 1. Import the new action
// import {
//   updateProposal,
//   updateProposalPdf,
//   getProposalByUUID,
//   sendToClient,
//   approveProposalStatus, // Import the action
// } from '../../../../../store/admin/proposalSlice';
// import {
//   CButton,
//   CFormInput,
//   CModal,
//   CModalBody,
//   CModalHeader,
//   CFormSelect,
// } from '@coreui/react';
// import { ToastExample } from '../../../../../components/toast/Toast';
// import { HiOutlineDocumentDownload } from 'react-icons/hi';
// import axios from 'axios';
// import rakez from '../../../../../assets/proposal_images/rakez.jpg';
// import shams from '../../../../../assets/proposal_images/shams.jpg';
// import ifza from '../../../../../assets/proposal_images/ifza.jpg';
// import dubaiSouth from '../../../../../assets/proposal_images/dubaiSouth.jpeg';
// import dmcc from '../../../../../assets/proposal_images/dmcc.jpg';
// import dedDubai from '../../../../../assets/proposal_images/dedDubai.jpg';
// import main_cover from '../../../../../assets/proposal_images/main_proposal.jpg';
// import { useParams } from 'react-router-dom';
// import useConfirm from '../../../../../components/SweetConfirm/useConfirm';
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import './proposal_summaryStyle.css'

// const ProposalSummary = () => {
//   const MySwal = withReactContent(Swal);
//   const confirm = useConfirm()
//   const { uuid } = useParams();
//   const [showReasonModal, setShowReasonModal] = useState(false);
//   const [status, setStatus] = useState('');
//   const [reason, setReason] = useState('');
//   const { proposal } = useSelector((state) => state.proposal);
//   const [showClientModal, setShowClientModal] = useState(false);

//   const [clientEmail, setClientEmail] = useState('');
//   const dispatch = useDispatch();
//   const proposalRef = useRef(null);
//   const [toastData, setToastData] = useState({ show: false, status: '', message: '' });
//   const showToast = (status, message) => {
//     setToastData({ show: true, status, message });
//     setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000);
//   };
  

//   // const imageMap = {
//   //   SHAMS: shams,
//   //   RAKEZ: rakez,
//   //   IFZA: ifza,
//   //   'DUBAI SOUTH': dubaiSouth,
//   //   DMCC: dmcc,
//   //   'DED DUBAI': dedDubai,
//   // };
// const imageMap = {}
//   useEffect(() => {
//     if (uuid) {
//       dispatch(getProposalByUUID(uuid));
//     }
//   }, [uuid, dispatch]);

//   // ✅ 2. Sync local status with proposal data from Redux
//   useEffect(() => {
//     if (proposal) {
//       if (proposal.approval_status == 1) {
//         setStatus('approve');
//       } else if (proposal.approval_status == 2) {
//         setStatus('pending');
//       } else {
//         setStatus('unapprove');
//       }
//     }
//   }, [proposal]);

//   // ... (handleGeneratePdf, webSetting logic, etc. remain the same) ...
//   const handleGeneratePdf = async () => { 
//    if (proposalRef.current) { 
//      const element = proposalRef.current; 
//      const pdfFileName = `${proposal.proposal_number}.pdf`; 
//      const opt = { 
//        margin: 10, 
//        filename: pdfFileName, 
//        image: { type: 'jpeg', quality: 0.7 }, 
//        html2canvas: { 
//        scale: 2, 
//        useCORS: true,       
//        allowTaint: true,     
//        logging: true,        
//      }, 
//        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
//      }; 

//      try { 
//        const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob'); 
//        const formData = new FormData(); 
//        formData.append('generated_pdf', pdfBlob, pdfFileName); 
//          const isConfirmed = await confirm({
//       title: 'Confirm Generate PDF',
//       text: `Are you absolutely sure you want to generate the pdf "${proposal.proposal_number}"?`,
//       icon: 'info', // Use a more impactful icon
//       confirmButtonText: 'Yes, Generate It!',
//     });
//     if (isConfirmed) {
//        dispatch(updateProposalPdf({ 
//          uuid: proposal.uuid,
//          data:formData 
//        })).then((data)=>{ 
//          if (data.payload.success) { 
//             showToast('success', 'Proposal generated successfully'); 
//             dispatch(getProposalByUUID(proposal.uuid)) 
//          } 
//        }) 
//     }
      

//      } catch (error) { 
//        console.error('PDF generation/upload failed:', error); 
//      } 
//    } 
//  }; 
//    const [webSetting, setWebSetting] = useState({ 
//      id: null, 
//      uuid: '', 
//      name: '', 
//      email: '', 
//      phone: '', 
//      address: { 
//        city: '', 
//        type: '', 
//        line1: '', 
//        state: '', 
//        country: '', 
//        postal_code: '', 
//      }, 
//      terms_and_conditions: '', 
//      bank_details: { 
//        bank: '', 
//        branch: '', 
//        bank_title: '', 
//        swift_code: '', 
//        iban_number: '', 
//        account_number: '', 
//      }, 
//      description: '', 
//      logo: '', 
//      icon: null, 
//      created_at: '', 
//      updated_at: '', 
//      deleted_at: null, 
//      updated_by: null, 
//      last_update: null, 
//    }); 

//    useEffect(() => { 
//      const fetchWebSetting = async () => { 
//        try { 
//          const res = await getData('/admin/web-setting-info'); 
//          if (res.success) { 
//            const data = res.data; 
          
//            setWebSetting({ 
//              id: data.id, 
//              uuid: data.uuid, 
//              name: data.name?.replace(/^"|"$/g, ''), 
//              email: data.email?.replace(/^"|"$/g, ''), 
//              phone: data.phone?.replace(/^"|"$/g, ''), 
//              address: { 
//                city: data.address?.[0]?.city || '', 
//                type: data.address?.[0]?.type || '', 
//                line1: data.address?.[0]?.line1 || '', 
//                state: data.address?.[0]?.state || '', 
//                country: data.address?.[0]?.country || '', 
//                postal_code: data.address?.[0]?.postal_code || '', 
//              }, 
//              terms_and_conditions: data.terms_and_conditions?.replace(/^"|"$/g, ''), 
//              bank_details: { 
//                bank: data.bank_details?.bank || '', 
//                branch: data.bank_details?.branch || '', 
//                bank_title: data.bank_details?.bank_title || '', 
//                swift_code: data.bank_details?.swift_code || '', 
//                iban_number: data.bank_details?.iban_number || '', 
//                account_number: data.bank_details?.account_number || '', 
//              }, 
//              description: data.description?.replace(/^"|"$/g, '') || '', 
//              logo: data.logo, 
//              icon: data.icon, 
//              created_at: data.created_at, 
//              updated_at: data.updated_at, 
//              deleted_at: data.deleted_at, 
//              updated_by: data.updated_by, 
//              last_update: data.last_update, 
//            }); 
//          } else { 
//            console.error('Error fetching company info:', res.message); 
//          } 
//        } catch (error) { 
//          console.error('API call failed:', error); 
//        } 
//      }; 
//      fetchWebSetting(); 
//    }, []); 
//    const user = useSelector((state) => state.auth.user); 
//    const HandleSendApproval = async () => {
//     // The payload to reset the proposal to a 'pending' state
//     const basePayload = {
//       employee_approval: 1,
//       approval_status: 2,
//     };

//     // Case 1: The proposal was unapproved (status is 0) and needs to be resent with a reason.
//     if (proposal.approval_status === 0) {
//       MySwal.fire({
//         title: 'Resend Proposal for Approval',
//         html: `Please provide a brief reason for resubmitting proposal <strong>#${proposal.proposal_number}</strong>.`,
//         input: 'textarea', // Use a textarea for the reason
//         inputLabel: 'Reason for Resubmission',
//         inputPlaceholder: 'Type your reason here...',
//         showCancelButton: true,
//         confirmButtonText: 'Resend for Approval',
//         showLoaderOnConfirm: true,
        
//         // Validate that a reason was entered
//         inputValidator: (value) => {
//           if (!value || value.trim().length < 10) {
//             return 'Please enter a meaningful reason (at least 10 characters).';
//           }
//         },

//         // This runs after the user enters a reason and clicks confirm
//         preConfirm: (reason) => {
//           const finalPayload = { ...basePayload, reason }; // Add the reason to the payload

//           // Dispatch the update action and return the promise for the loading state
//           return dispatch(updateProposal({ uuid: proposal.uuid, data: finalPayload }))
//             .unwrap()
//             .catch(error => {
//               Swal.showValidationMessage(`Request failed: ${error.message}`);
//             });
//         },

//         allowOutsideClick: () => !Swal.isLoading(),

//       }).then((result) => {
//         if (result.isConfirmed) {
//           showToast('success', 'Proposal has been resent for approval.');
//           dispatch(getProposalByUUID(proposal.uuid)); // Refresh the data
//         }
//       });
//     } 
//     // Case 2: This is the first time the proposal is being sent for approval.
//     else {
//       const isConfirmed = await confirm({
//         title: 'Confirm Send Approval',
//         text: `Are you absolutely sure you want to send proposal #${proposal.proposal_number} for approval?`,
//         icon: 'info',
//         confirmButtonText: 'Yes, Send It!',
//       });

//       if (isConfirmed) {
//         dispatch(updateProposal({ uuid: proposal.uuid, data: basePayload }))
//           .unwrap()
//           .then(() => {
//             showToast('success', 'Proposal sent for approval.');
//             dispatch(getProposalByUUID(proposal.uuid));
//           })
//           .catch((error) => {
//             showToast('error', `Failed to send: ${error.message}`);
//           });
//       }
//     }
//   };
//    const HandleSendToClient = async() => { 
//    if (proposal?.client_info && Object.keys(proposal.client_info).length > 0) { 
//     const isConfirmed = await confirm({
//       title: 'Confirm Send To Client',
//       text: `Are you absolutely sure you want to send the proposal to client. proposal number is "${proposal.proposal_number}"?`,
//       icon: 'info', // Use a more impactful icon
//       confirmButtonText: 'Yes, Send It!',
//     });
//     if (isConfirmed) {
//       dispatch(sendToClient({uuid:proposal.uuid})).then((data)=>{ 
//        if (data.payload.success) { 
//          showToast('success', 'Proposal sent to client successfully.'); 
//        } 
//      }) 
//     }
       
//    } else { 
    
//      handleSendToClientWithAlert() 
//    } 
//  }; 
//   const handleDownload = async () => { 
//    try { 
//      const fileUrl = `${import.meta.env.VITE_SERVER_URL}/${proposal.pdf_path}`; 
//      const response = await axios.get(fileUrl, { responseType: 'blob' }); 
      
//      const blob = response.data; 
//      const link = document.createElement('a'); 
//      link.href = URL.createObjectURL(blob); 
//      link.download = 'proposal_summary.pdf'; 
//      document.body.appendChild(link); 
//      link.click(); 
//      document.body.removeChild(link); 
//      URL.revokeObjectURL(link.href); 
//    } catch (error) { 
//        showToast('error', 'Can not find Pdf. please generate first'); 
//      console.error('Download error:', error); 
//    } 
//  }; 
//  const selectedImage = imageMap[proposal?.authority_name?.toUpperCase()]  
//                        || main_cover; 


//   // ✅ 3. Centralized function to handle the API dispatch
//   const handleConfirmApproval = (action, reason = null) => {
//     const payload = {
//       uuid: proposal.uuid,
//       action: action,
//     };

//     if (reason) {
//       payload.reason = reason;
//     }

//     dispatch(approveProposalStatus(payload))
//       .unwrap()
//       .then(() => {
//         showToast('success', `Proposal ${action}ed successfully.`);
//         setShowReasonModal(false); // Close modal on success
//         dispatch(getProposalByUUID(uuid)); // Re-fetch the proposal data
//       })
//       .catch((error) => {
//         showToast('danger', error.message || `Failed to ${action} proposal.`);
//         console.error('API Error:', error);
//       });
//   };

//   // ✅ 4. Updated handleChange to open modal or dispatch directly
//   const handleChange = (e) => {
//     const newStatus = e.target.value;
//     setStatus(newStatus); // Update UI immediately

//     if (newStatus === 'unapprove') {
//       setReason(''); // Clear any previous reason
//       setShowReasonModal(true);
//     } else if (newStatus === 'approve') {
//       handleConfirmApproval('approve');
//     }
//   };
  
//   // ✅ 5. Updated handleConfirmUnapprove to use the central handler
//   const handleConfirmUnapprove = () => {
//     if (!reason.trim()) {
//       showToast('warning', 'Please provide a reason for unapproval.');
//       return;
//     }
//     handleConfirmApproval('unapprove', reason);
//   };

//   // ✅ 6. Updated handleCancelModal to revert the state correctly
//   const handleCancelModal = () => {
//     setShowReasonModal(false);
//     // Revert the status dropdown to its original state from Redux
//     if (proposal) {
//       if (proposal.approval_status == 1) setStatus('approve');
//       else if (proposal.approval_status == 2) setStatus('pending');
//       else setStatus('unapprove');
//     }
//   };

 

//   // Add this new handler function to your component
//   const handleSendToClientWithAlert = () => {
//     MySwal.fire({
//       title: 'Send Proposal to Client',
//       html: `Enter the client's email to send proposal <strong>#${proposal.proposal_number}</strong>.`,
//       input: 'email', // Use the built-in email input
//       inputLabel: 'Client Email Address',
//       inputPlaceholder: 'name@example.com',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Send It!',
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       showLoaderOnConfirm: true,
//        allowOutsideClick:false,
//        allowEscapeKey:false,
      

       
//       // 1. Handle validation directly inside the alert
//       inputValidator: (value) => {
//         if (!value) {
//           return 'An email address is required!';
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//           return 'Please enter a valid email address.';
//         }
//       },

//       // 2. This function runs after validation passes but before the alert closes
//       preConfirm: (clientEmail) => {
//         // This is where you dispatch your Redux action.
//         // We return the dispatch promise so SweetAlert can handle the loading state.
//         return dispatch(sendToClient({ uuid: proposal.uuid, client_email: clientEmail }))
//           .unwrap() // Use unwrap() to easily catch errors
//           .catch(error => {
//             Swal.showValidationMessage(`Request failed: ${error.message}`);
//           });
//       },
      
//       // allowOutsideClick: () => !Swal.isLoading()

//     }).then((result) => {
//       // 3. This block runs only after the preConfirm promise succeeds
//       if (result.isConfirmed) {
//         // The result.value is the payload from your successful Redux action
//         if (result.value && result.value.success) {
//            MySwal.fire({
//             icon: 'success',
//             title: 'Proposal Sent!',
//             text: `The proposal has been successfully sent to the client.`,
//           });
//         }
//       }
//     });
//   };

//    return (
//     <div>
//       {/* --- Modals and Toasts --- */}
//       <CModal visible={showReasonModal} onClose={handleCancelModal}>
//         <CModalHeader>
//           <h5>Reason for Unapproval</h5>
//         </CModalHeader>
//         <CModalBody>
//           <textarea
//             className="form-control"
//             rows={4}
//             placeholder="Enter the reason why this proposal is being unapproved..."
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//           />
//           <div className="mt-3 d-flex justify-content-end gap-2">
//             <CButton color="secondary" onClick={handleCancelModal}>
//               Cancel
//             </CButton>
//             <CButton color="danger" onClick={handleConfirmUnapprove}>
//               Confirm Unapproval
//             </CButton>
//           </div>
//         </CModalBody>
//       </CModal>

//       {toastData.show && (
//         <div className="toast-container">
//           <ToastExample status={toastData.status} message={toastData.message} />
//         </div>
//       )}

//       {/* --- Action Header --- */}
//       <div className="proposal-actions-header">
//         <div className="proposal-buttons-group">
//           {proposal?.approval_status == 1 && !proposal?.generated_pdf && (
//             <button onClick={handleGeneratePdf} className="custom-button m-2">
//               Generate PDF
//             </button>
//           )}

//           {proposal?.employee_approval == 0 && proposal?.approval_status == 2 && user.role == "employee" && (
//             <CButton className="custom-button" onClick={HandleSendApproval}>
//               Send To Approval
//             </CButton>
//           )}

//           {proposal?.approval_status == 0 && user.role == "employee" && (
//             <CButton className="custom-button" onClick={HandleSendApproval}>
//               Resend To Approval
//             </CButton>
//           )}

//           {proposal?.approval_status == 1 && proposal.generated_pdf && (
//             <CButton className="custom-button m-2" onClick={HandleSendToClient}>
//               Send To Client
//             </CButton>
//           )}
//         </div>

//         <div className="status-control-section">
//           {user.role === 'admin' ? (
//             <div className="d-flex align-items-center">
//               <label htmlFor="status-select" className="me-2 fw-semibold">
//                 Approval Status:
//               </label>
//               <CFormSelect id="status-select" onChange={handleChange} value={status} className="status-select">
//                 {status === 'pending' && <option disabled value="pending">Pending</option>}
//                 <option value="approve">Approved</option>
//                 <option value="unapprove">Unapproved</option>
//               </CFormSelect>
//             </div>
//           ) : (
//             <div>
//               <span className="fw-bold">Approval Status:</span>{' '}
//               {proposal?.approval_status == 2 ? 'Pending' : proposal?.approval_status == 1 ? 'Approved' : 'Unapproved'}
//             </div>
//           )}

//           {proposal?.generated_pdf && proposal?.approval_status == 1 && (
//             <CButton onClick={handleDownload} title="Download PDF" className="download-button">
//               <HiOutlineDocumentDownload size={30} />
//             </CButton>
//           )}
//         </div>
//       </div>

//       {proposal?.approval_status == 2 && proposal?.employee_approval == 1 && user.role == 'employee' && (
//         <div className="admin-approval-notice">
//           Waiting for admin approval. After approval, you can generate the PDF.
//         </div>
//       )}

//       {/* --- PDF Content --- */}
//       <div id="proposal-pdf-content" ref={proposalRef} className="proposal-content">
//         <div className="header-image-container">
//           <img src={selectedImage} alt={proposal?.authority_name || "Default"} className="header-image" style={{width:"100%", objectFit:"cover"}} />
//         </div>
        
//         <HeadingBar title={`${proposal?.authority_name} ${proposal?.zone_name}`} position="center" />
        
//         <ul className="activity-list">
//           {(proposal?.business_activities || []).map((act, i) => (
//             <li key={i} className="activity-list-item">
//               <p>
//                 <span className="activity-label">Activity Code</span>:
//                 <strong className="activity-value">{act?.activity_code}</strong>
//               </p>
//               <p>
//                 <span className="activity-label">Activity Name</span>:
//                 <strong className="activity-value">{act?.activity_name}</strong>
//               </p>
//               {act?.description && (
//                 <div className="activity-description-row">
//                   <div className="activity-description-label">Activity Description</div>:
//                   <div className="activity-description-text">{act?.description}</div>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
        
//         <HeadingBar title={`Number of Visas: ${proposal?.business_questions?.visas || 0}`} position="center" />
        
//         <div className="table-responsive-container">
//           <table className="summary-table">
//             <thead className="table-header">
//               <tr>
//                 <th className="table-header-cell">#</th>
//                 <th className="table-header-cell text-left">Item</th>
//                 <th className="table-header-cell">Quantity</th>
//                 <th className="table-header-cell text-right">Cost</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(proposal?.what_to_include || []).map((item, index) => (
//                 <tr key={index} className="table-body-row">
//                   <td className="table-cell table-cell-index">{index + 1}</td>
//                   <td className="table-cell text-left">{item.title}</td>
//                   <td className="table-cell">{item.quantity}</td>
//                   <td className="table-cell text-right table-cell-cost">{item.cost}</td>
//                 </tr>
//               ))}
//               <tr className="table-footer-row">
//                 <td colSpan={3} className="table-cell-total-label">Total</td>
//                 <td className="table-cell-total-value">{proposal?.total_amount ?? 0}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
        
//         <div className="content-section">
//           <HeadingBar title="Required Documents" position="center" />
//           <ul className="info-list">
//             {(proposal?.required_documents || []).map((doc, i) => (<li key={i}>{doc.name}</li>))}
//           </ul>
//         </div>
        
//         <div className="content-section">
//           <HeadingBar title="Benefits" position="center" />
//           <ul className="info-list">
//             {(proposal?.benefits || []).map((item, i) => (<li key={i}>{item.name}</li>))}
//           </ul>
//         </div>

//         <div className="content-section">
//           <HeadingBar title="Other Benefits" position="center" />
//           <ul className="info-list">
//             {(proposal?.other_benefits || []).map((item, i) => (<li key={i}>{item.name}</li>))}
//           </ul>
//         </div>

//         <div className="content-section">
//           <HeadingBar title="Scope of Work" position="center" />
//           <ul className="info-list">
//             {(proposal?.scope_of_work || []).map((item, i) => (<li key={i}>{item.name}</li>))}
//           </ul>
//         </div>
        
//         <div className="content-section">
//           <HeadingBar title="Notes" position="center" />
//           <div className="notes-container">
//             {proposal?.notes || 'No notes available.'}
//           </div>
//         </div>
        
//         <HeadingBar title={`${webSetting.name}`} position="center" />
//         <div className="creation-info">
//           <p>Created at: <strong>{new Date().toLocaleDateString()}</strong></p>
//           <p>Website: <strong>www.FZCS.com</strong></p>
//           <p>Email: <strong>{user.email}</strong></p>
//         </div>
        
//         <HeadingBar title="Agreement" position="center" />
//         <p className="agreement-text">{webSetting.terms_and_conditions}</p>
        
//         <div className="signature-section">
//           <div className="signature-block">
//             <HeadingBar title="Signed for and on behalf of FZCS" position="center" />
//             <div className="signature-field">
//                 <span><strong>Consultant name</strong></span>
//                 <p>{user.name}</p>
//             </div>
//             <div className="signature-field">
//                 <span><strong>Date</strong></span>
//                 <p>{new Date().toLocaleDateString()}</p>
//             </div>
//           </div>
//           <div className="signature-block">
//             <HeadingBar title="Signed for and on behalf of the Client" position="center" />
//             <div className="signature-field">
//                 <span><strong>Name</strong></span>
//                 <p>{proposal?.client_info?.name}</p>
//             </div>
//             <div className="signature-field">
//                 <span><strong>Date</strong></span>
//                 <p>{new Date().toLocaleDateString()}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="footer-address-section">
//           <HeadingBar title={`${webSetting.address.city} ${webSetting.address.type}`} position="center" />
//           <div className="footer-address-details">
//             <p><strong>Address</strong>: {webSetting.address.line1}, {webSetting.address.city}, {webSetting.address.state} {webSetting.address.country} {webSetting.address.postal_code}</p>
//             <p><strong>Contact Us</strong>: {webSetting.phone}</p>
//             <p><strong>Email</strong>: {webSetting.email}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalSummary;
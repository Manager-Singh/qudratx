


import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import HeadingBar from './Components/HeadingBar';
import { getData } from '../../../../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateProposal, updateProposalPdf ,getProposalByUUID, sendToClient} from '../../../../../store/admin/proposalSlice';
import { CButton, CFormInput, CModal, CModalBody, CModalHeader } from '@coreui/react';
import { ToastExample } from '../../../../../components/toast/Toast'
import { HiOutlineDocumentDownload } from "react-icons/hi";
import axios from 'axios';
import rakez from '../../../../../assets/proposal_images/rakez.jpg'
import shams from '../../../../../assets/proposal_images/shams.jpg'
import ifza from '../../../../../assets/proposal_images/ifza.jpg'
import dubaiSouth from '../../../../../assets/proposal_images/dubaiSouth.jpeg'
import dmcc from '../../../../../assets/proposal_images/dmcc.jpg'
import dedDubai from '../../../../../assets/proposal_images/dedDubai.jpg'
const ProposalSummary = () => {
const {proposal} = useSelector((state)=>state.proposal)
const [showClientModal, setShowClientModal] = useState(false);

const [clientEmail, setClientEmail] = useState('');
  const dispatch= useDispatch()
  const proposalRef = useRef(null);
const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
    const showToast = (status, message) => {
      setToastData({ show: true, status, message })
      setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
    }
 

const imageMap = {
  SHAMS: shams,
  RAKEZ: rakez,
  IFZA: ifza,
  'DUBAI SOUTH': dubaiSouth,
  DMCC: dmcc,
  'DED DUBAI': dedDubai
};
const handleGeneratePdf = async () => {
  if (proposalRef.current) {
    const element = proposalRef.current;

    const opt = {
      margin: 10,
      filename: `${proposal.proposal_number.pdf}`,
      image: { type: 'jpeg', quality: 10 },
      html2canvas: {
      scale: 2,
      useCORS: true,      
      allowTaint: true,    
      logging: true,       
    },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // 1. Generate PDF Blob
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');

      // 3. Upload to backend using FormData
      const formData = new FormData();
      formData.append('generated_pdf', pdfBlob, 'proposal_summary.pdf');

      // 4. Dispatch updateProposal Redux action
      dispatch(updateProposalPdf({
        uuid: proposal.uuid, // Replace with your actual ID
        data:formData
      })).then((data)=>{
        if (data.payload.success) {
           showToast('success', 'Proposal generated successfully');
           dispatch(getProposalByUUID(proposal.uuid))
        }
      })

    } catch (error) {
      console.error('PDF generation/upload failed:', error);
    }
  }
};


  // get company details and address
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

  // set all variables
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

  // get current employee details
  const user = useSelector((state) => state.auth.user);

  const HandleSendApproval =()=>{
    const newdata={
    employee_approval:1
    }
      dispatch(updateProposal({uuid:proposal.uuid,data:newdata})).then((res)=>{
        if (res.payload.success) {
           showToast('success', 'Proposal Send For Approval.');
          dispatch(getProposalByUUID(proposal.uuid)).then((data)=>{
            console.log(data,"data")
          })
        }
      })
   }

  const HandleSendToClient = () => {
  if (proposal?.client_info && Object.keys(proposal.client_info).length > 0) {
    // Client info exists, send directly
    dispatch(sendToClient({uuid:proposal.uuid})).then((data)=>{
      console.log(data,"data")
      if (data.payload.success) {
        showToast('success', 'Proposal sent to client successfully.');
      }
    })
   
  } else {
    // No client info, ask for email
    setShowClientModal(true);
  }
};
 
 const handleDownload = async () => {
  try {
    const fileUrl = `http://localhost:5000/${proposal.pdf_path}`;
    const response = await axios.get(fileUrl, { responseType: 'blob' }); // 👈 important
    console.log(response,"responce")
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
                      || "https://images.pexels.com/photos/3214995/pexels-photo-3214995.jpeg";
  
  return (
    <div>
       {toastData.show && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
            <ToastExample status={toastData.status} message={toastData.message} />
          </div>
                        )}
                      
                        {showClientModal && (
 <CModal
  visible={showClientModal}
  onClose={() => setShowClientModal(false)}
  alignment="top"
  className="mt-5" // pushes it down slightly from absolute top
>
  <CModalHeader>
    <h5>Enter Client Email</h5>
  </CModalHeader>
  <CModalBody>
    <CFormInput
      type="email"
      value={clientEmail}
      onChange={(e) => setClientEmail(e.target.value)}
      placeholder="Enter client email"
      className="mb-3"
    />
    <div className="d-flex gap-2">
      <CButton
        color="primary"
        onClick={() => {
          if (!clientEmail) {
            showToast('error', 'Please enter an email.');
            return;
          }
          dispatch(sendToClient({uuid:proposal.uuid ,client_email:clientEmail})).then((data)=>{
            console.log(data,"data")
            if (data.payload.success) {
               showToast('success', 'Proposal sent to client successfully.');
               setShowClientModal(false);
            }
          })
        
        }}
      >
        Send
      </CButton>
      <CButton color="secondary" onClick={() => setShowClientModal(false)}>
        Cancel
      </CButton>
    </div>
  </CModalBody>
</CModal>

)}
    
     <div className='d-flex justify-content-between'>
      <div >
       {
        proposal?.approval_status == 1 && !proposal?.generated_pdf && <button
        onClick={handleGeneratePdf}
        className='custom-button m-2'
      >
       Generate PDF
      </button>
        
      }
       {proposal?.employee_approval == 0 && user.role=="employee" && <CButton className="custom-button"   onClick={HandleSendApproval}>
                           Send To Approval
                    </CButton> }

         {proposal?.approval_status == 1  && proposal.generated_pdf && <CButton className="custom-button m-2"   onClick={HandleSendToClient}>
                     Send To Client
              </CButton> } 

      </div>
      {proposal?.generated_pdf  && <div className='d-flex justify-content-end p-2'>
       <CButton
  onClick={handleDownload}
  title='Download PDF'
>
  <HiOutlineDocumentDownload size={30} />
</CButton>
      </div>}
      
     </div>
     
      {proposal?.approval_status == 2 && proposal?.employee_approval == 1 &&  <div >
      Wating for admin approval after the approval you can generate the pdf </div>}
      <div className='py-2'></div>
      <div
        id="proposal-pdf-content"
        ref={proposalRef} 
        style={{
          padding: '20px',
          background: '#fff',
          color: '#000',
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
        }}
      > 
      {/* <div style={{ width: '100%', height: '100%', display: 'flex', margin: 'auto' }}>
          {proposal?.zone_name?.toLowerCase() === 'freezone' ? (
            <img
              src={shams}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src="https://images.pexels.com/photos/3214995/pexels-photo-3214995.jpeg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          
        </div> */}
        <div style={{ width: '100%', height: '600px', display: 'flex', margin: 'auto' }}>
  <img
    src={selectedImage}
    alt={proposal?.authority_name || "Default"}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>
              
        
        <HeadingBar title={`${proposal?.authority_name}  ${proposal?.zone_name}`} position="center" />
        <ul>
          {(proposal?.business_activities || []).map((act, i) => (
            <li key={i} style={{ marginBottom: '20px', marginTop: '20px' }}>
              <p>
                <span className=''style={{marginRight:"110px"}}>Activity Code</span>:<strong className='ms-3'> {act?.activity_code}</strong>
              </p>
              <p>
              <span className=''style={{marginRight:"105px"}}>Activity Name</span>:<strong className='ms-3'>{act?.activity_name}</strong>
              </p>
              {act?.description && <div className="row">
               <div className="col-2" style={{marginRight:"45px"}}>Activity Description</div>: 
              <div className="col-9 ">{act?.description}</div>
  </div>}
               
            </li>
          ))}
        </ul>
        <HeadingBar
          title={`Number of Visas: ${proposal?.business_questions?.visas || 0}`}
          position="center"
        />
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#4a148c', color: 'white' }}>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'right',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {(proposal?.what_to_include || []).map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                    transition: 'background-color 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white')
                  }
                >
                  <td
                    style={{
                      backgroundColor: '#fff',
                      color: '#333',
                      fontWeight: '700',
                      textAlign: 'center',
                      padding: '12px 20px',
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontWeight: '500',
                      color: '#333',
                    }}
                  >
                    {item.title}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      textAlign: 'center',
                      color: '#555',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    {item.cost}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <td
                  colSpan={3}
                  style={{
                    textAlign: 'right',
                    padding: '14px 20px',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#333',
                    borderTop: '2px solid #ccc',
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    padding: '14px 20px',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#333',
                    borderTop: '2px solid #ccc',
                  }}
                >
                  {proposal?.total_amount ?? 0}
                </td>
              </tr>
            </tbody>
          </table>
          <HeadingBar title="Required Documents" position="center" />
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {(proposal?.required_documents || []).map((doc, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {doc.name}
              </li>
            ))}
          </ul>
        </div>
        <HeadingBar title="Benefits" position="center" />
        <div style={{ marginBottom: '25px' }}>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {(proposal?.benefits || []).map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <HeadingBar title="Other Benefits" position="center" />
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {(proposal?.other_benefits || []).map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Scope of Work List */}
        <div style={{ marginBottom: '25px' }}>
          <HeadingBar title="Scope of Work" position="center" />
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            {(proposal?.scope_of_work || []).map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Notes Section */}
        <div>
          <HeadingBar title="Notes" position="center" />
          <div
            style={{
              backgroundColor: '#f7f7f7',
              padding: '15px',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
            }}
          >
            {proposal?.notes || 'No notes available.'}
          </div>
        </div>
        {/* Company details */}
        <HeadingBar title={`${webSetting.name}`} position="center" />
        <div>
          <p>
            Created at:<strong>{new Date().toLocaleDateString()}</strong>
          </p>
          <p>
            Website:<strong> www.FZCS.com</strong>
          </p>
          <p>
            Email:<strong> {user.email}</strong>
          </p>
        </div>
        {/* agreement */}
        <HeadingBar title="Agreement" position="center" />
        <p>{webSetting.terms_and_conditions}</p>
        {/* signed details for employee and client */}
        <div className="signed-section" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px', flexWrap: 'wrap' }}>
          <div className="signed-single" style={{ flex: '1', minWidth: '300px', margin: '10px' }}>
            <HeadingBar title="Signed for and on behalf of FZCS" position="center" />
            <span>
              <strong>Consultant name</strong>
              <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>{user.name}</p>
            </span>
            <span>
              <strong>Date</strong>
              <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>{new Date().toLocaleDateString()}</p>
            </span>
          </div>
          <div className="signed-single" style={{ flex: '1', minWidth: '300px', margin: '10px' }}>
            <HeadingBar title="Signed for and on behalf of the Client" position="center" />
            <span>
              <strong>Name</strong>
              <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px' }}>{proposal?.client_info?.name}</p>
            </span>
            <span>
              <strong>Date</strong>
              <p style={{ borderBottom: '1px solid #000', paddingBottom: '5px' }}>{new Date().toLocaleDateString()}</p>
            </span>
          </div>
        </div>
        {/* company address */}
        <div>
          <HeadingBar
            title={`${webSetting.address.city} ${webSetting.address.type}`}
            position="center"
          />
          <div>
            <p>
              <strong>Address</strong>: {webSetting.address.line1}, {webSetting.address.city},{' '}
              {webSetting.address.state} {webSetting.address.country}
              {webSetting.address.postal_code}
            </p>
            <p>
              <strong>Contact Us</strong>: {webSetting.phone}
            </p>
            <p>
              <strong>Email</strong>: {webSetting.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalSummary;
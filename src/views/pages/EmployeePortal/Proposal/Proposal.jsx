
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import logo from '../../../../../public/download.png' 
import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'
import { getBusinessActivityByAuthorityId } from '../../../../store/admin/businessActivitySlice'
import { useSelector, useDispatch } from 'react-redux'
import { getPackageByAuthorityId } from '../../../../store/admin/packageSlice'
import CardSelector from '../Components/CardSelector/CardSelector'
import PackageCardSelector from '../Components/PackageCardSelector/PackageCardSelector'
import { ToastExample } from '../../../../components/toast/Toast'


import './proposal.css'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CProgress, 
} from '@coreui/react'
import RequiredDocument from './steps/RequiredDocument'
import Benefits from './steps/Benefits'
import ScopeOfWork from './steps/ScopeOfWork'
import Notes from './steps/Notes'
import { getClient } from '../../../../store/admin/clientSlice'
import BusinessActivityStepSelector from '../Components/helper/BusinessActivityInfiniteList'
import Clients from './Clients'
import BusinessQuestion from './steps/BusinessQuestion'
import ProposalSummary from './steps/ProposalSummaryStep'
import { CreateProposal } from '../../../../store/admin/proposalSlice'




// Constants
const questions = [
  'What is your company name?',
  'What is your estimated investment?',
  'Do you need office space?',
  'How many visas are required?',
  'Do you need bank assistance?',
];

const initialIncludeExcludeList = [
  { title: 'CERTIFICATE OF INCUMBENCY', quantity: 1, cost: 'INCLUDED' },
  { title: 'MOA', quantity: 1, cost: 'INCLUDED' },
  { title: 'SHARE CERTIFICATE', quantity: 1, cost: 'INCLUDED' },
  { title: 'BUSINESS LICENSE', quantity: 1, cost: 'INCLUDED' },
  { title: 'RESIDENCE VISA - VISA+CHANGE STATUS+MEDICAL+EID', quantity: 1, cost: 'INCLUDED' },
  { title: 'BANK LETTER', quantity: 1, cost: 'INCLUDED' },
  { title: 'COMMERCIAL REGISTRY', quantity: 1, cost: 'INCLUDED' },
  { title: 'LEASE AGREEMENT', quantity: 1, cost: 'INCLUDED' },
  { title: 'CERTIFICATE OF INCORPORATION', quantity: 1, cost: 'INCLUDED' },
];

const initialRequiredDocuments = [
  { name: 'Passport Copy' },
  { name: 'Visit visa or Resident visa copy' },
  { name: 'For Resident visa holder "No Objection Certificate will be required.' },
  { name: 'Emirates ID (For resident visa holder)' },
  { name: 'Any 3 Company Names (To check their availability)' },
  { name: 'Passport Size Photograph' },
  { name: 'Email-ID' },
  { name: 'Contact Number' },
];

const initialBenefits = [
  { name: 'Banking Benefits' },
  { name: 'Shareholders can easily open global corporate bank accounts.' },
  { name: 'The company can enjoy liberal bank account proceedings & maintenance.' },
  { name: 'Can lease office or shop anywhere in Dubai.' },
];

const initialOtherBenefits = [
  { name: 'The investor can commence branches.' },
  { name: 'The company is eligible to hold limitless offices or properties in the UAE.' },
  { name: 'Companies can be eligible for more visas depending on the nature of the business.' },
];

const initialScopeOfWork = [
  { name: 'Consultancy on Company Incorporation Procedures FZCS' },
  { name: 'Legalization and Initial Approval from Department of Economic Development, Dubai' },
  { name: 'Municipality if required FZCS' },
  { name: 'Virtual Office if Required FZCS' },
  { name: 'Preparing Local Service Agent Agreement or MOA FZCS' },
  { name: 'Court Notarization of Local Service Agent Agreement FZCS' },
  { name: 'Documentation, Legalization and Submission of Final Approval Application to Department of Economic Development FZCS' },
  { name: 'Follow-up and Collection of Trade License from Department of Economic Development FZCS' },
  { name: 'Update Trade License with Department of Economic Development FZCS' },
  { name: 'Documentation, Legalization and Registration of company with Ministry of Immigration (DNDR) FZCS' },
  { name: 'Documentation, Legalization and Registration of company with Ministry of Labor (MOL) FZCS' },
  { name: 'Introduction to Banker for opening Bank Account FZCS' },
  { name: 'Family sponsor process FZCS' },
];

const initialNotes = `• This package license for one year and visa for 2 years, Medical & Work Protection Insurance is not included.
• Package renewal AED 21150/- VISA FREE FOR LIFE, as long as license valid.
• In case of any rejection by government, free zone refund money after deduction of specific amount.
• FZCS will not be responsible in case of any delay or change by government.`;

const initialQuestionFormData = {
  partners: '',
  visas: '',
  visaAmount: 0,
  tenancy: '',
  tenancyAmount: 0,
  withLocalPartner: '',
  localPartnerAmount: 0,
  language: '',
  languageAmount: 0,
  companyType: '',
  companyTypeAmount: 0,
};


const Proposal = () => {
  // toast states
   const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
    const showToast = (status, message) => {
      setToastData({ show: true, status, message })
      setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
    }
  const { id } = useParams()
  const [step, setStep] = useState(1)
  const businessZonesAuthority = useSelector((state) => state.businessZonesAuthority)
  const authorities = businessZonesAuthority?.authorities || []
  const isLoading = businessZonesAuthority?.isLoading || false
  const { business_activities = [], isActivityLoading = false } = useSelector(
    (state) => state.business_activity || {}
  );
const [includeExcludeList, setIncludeExcludeList] = useState(initialIncludeExcludeList)
const [requiredDocuments, setRequiredDocuments] = useState(initialRequiredDocuments)
const [benefits, setBenefits] = useState(initialBenefits)
const [otherBenefits, setOtherBenefits] = useState(initialOtherBenefits)
const [scopeOfWork, setScopeOfWork] = useState(initialScopeOfWork)
const [notes, setNotes] = useState(initialNotes)
const [questionFormData, setQuestionFormData] = useState(initialQuestionFormData)

  const [showPdfSummary, setShowPdfSummary] = useState(false);
  // get package state from redux
  const {packages , isPackageLoading} = useSelector((state) => state.package);
  
  const dispatch = useDispatch()

  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [selectedActivities, setSelectedActivities] = useState([])
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [selectedPackage, setSelectedPackage] = useState(null)
const [selectedClient, setSelectedClient] = useState(null)
  
  // state for search
  const [activitySearch, setActivitySearch] = useState('');
  const {clients} = useSelector((state)=>state.client)
  // dummy value to hide selected inside searchbar
  const MultiValue = () => null
  const total_step = 11
// required document 

  // get business zonne authority
  useEffect(() => {
  if (id) {
    dispatch(getBusinessZonesAuthorityByZoneId({ id }));

    // Reset form state when zone changes
    setStep(1);
    setSelectedAuthority(null);
    setSelectedActivities([]);
    setSelectedPackage(null);
    setSelectedClient('');
    setIncludeExcludeList(initialIncludeExcludeList);
    setRequiredDocuments(initialRequiredDocuments);
    setBenefits(initialBenefits);
    setOtherBenefits(initialOtherBenefits);
    setScopeOfWork(initialScopeOfWork);
    setNotes(initialNotes);
    setQuestionFormData(initialQuestionFormData);
    setShowPdfSummary(false)
    
  }
}, [id, dispatch]);


  // get business activity by zone id
  useEffect(() => {
    if (selectedAuthority) {
      dispatch(getBusinessActivityByAuthorityId({ authority_id: selectedAuthority }));
      setSelectedActivities([]);
    }
  }, [selectedAuthority, dispatch]);

  useEffect(() => {
    if (step === 2 && selectedAuthority) {
      dispatch(getPackageByAuthorityId(selectedAuthority))
    }
  }, [step, selectedAuthority, dispatch])
  
  
  useEffect(()=>{
    if (!clients || clients.length < 1) {
      dispatch(getClient())
    }
  },[])

  useEffect(() => {
   
  }, [selectedAuthority , dispatch])

  
  
 
  

  const handleNext = () => {
  if (step === 1 && !selectedAuthority) {
     showToast('warning', `Please select an authority before proceeding.`);
    return
  }

  if (step === 2 && !selectedPackage) {
    showToast('warning', `Please select an package before proceeding.`)
    return
  }


  // Add more validations for other steps as needed...

  if (step < total_step) setStep(step + 1)
}


  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }


  const handleIncludeExcludeChange = (index, field, value) => {
    const updated = [...includeExcludeList]
    updated[index][field] = value
    setIncludeExcludeList(updated)
  }

  const removeIncludeExclude = (index) => {
    const updated = [...includeExcludeList]
    updated.splice(index, 1)
    setIncludeExcludeList(updated)
  }
  
  const addIncludeExclude = () => {
    setIncludeExcludeList([...includeExcludeList, { title: '', type: 'Include' }])
  }


  const calculateTotalAmount = () => {
  let total = Number(selectedPackage?.total_amount || 0);

  // Include/Exclude costs
  includeExcludeList.forEach((item) => {
    const cost = parseFloat(item.cost);
    const quantity = parseInt(item.quantity);
    if (!isNaN(cost) && !isNaN(quantity)) {
      total += cost * quantity;
    }
  });

  // Question Form Amounts (all *_Amount fields)
  Object.keys(questionFormData).forEach((key) => {
    if (key.toLowerCase().includes('amount')) {
      const value = parseFloat(questionFormData[key]);
      if (!isNaN(value)) {
        total += value;
      }
    }
  });

  return total.toFixed(2);
};


const total_amount = calculateTotalAmount();
const max_activity_selected =selectedPackage?.activity



const generatePDF = () => {
 const finalTotalAmount = calculateTotalAmount();
  const proposalData = {
    zone_id :id,
    zone_name :selectedPackage.authority.zone.name,
    zone_info: selectedPackage.authority.zone,
    authority_id :selectedPackage.authority.id,
    authority_name: selectedPackage.authority.name,
    authority_info:selectedPackage.authority,
    business_activities:selectedActivities,
    package_id:selectedPackage.id,
    package_name:selectedPackage.name,
    package_info:selectedPackage,
    client_id:selectedClient.id,
    client_info:selectedClient,
    total_amount:finalTotalAmount,
    business_questions:questionFormData,
    what_to_include:includeExcludeList,
    required_documents:requiredDocuments,
    benefits:benefits,
    other_benefits:otherBenefits,
    scope_of_work:scopeOfWork,
    notes:notes
  }
  console.log('📝 Final Proposal:', proposalData);
  // alert('PDF Generated (placeholder)');
  // dispatch(CreateProposal(proposalData)).then((data)=>{
  //   console.log(data,"data")
  // })
};


  return (
    <div className="container ">
      {toastData.show && (
                    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
                      <ToastExample status={toastData.status} message={toastData.message} />
                    </div>
                  )}
      <h2 className="text-center mb-4">Proposal Form - Step {step}/{total_step}</h2>
    <CProgress color="info" className='mb-3' variant='striped' animated value={(step / total_step) * 100}/> 
   {selectedPackage && (
  <div className="w-100 d-flex justify-content-end my-3">
    <div className="border border-2 border-primary rounded-3 px-4 py-3 bg-white shadow-sm">
      <h4 className="mb-0 text-dark-emphasis">
        <span className="fw-medium">Total Amount:</span>{' '}
        <span className="text-primary fw-bold">AED {total_amount}</span>
      </h4>
    </div>
  </div>
)}
       {step === 1 && (
        <>
        <div>
          
        </div>
          <h4 >Select Authority</h4>
          <div className="row">
            {isLoading ? (
              <p>Loading authorities...</p>
            ) : authorities.length === 0 ? (
              <p>No authorities available for this zone.</p>
            ) : (
              authorities.map((item) => (
                <div
                  key={item.uuid}
                  className="col-4"
                  onClick={() => setSelectedAuthority(item.id)}
                >
                  <label className={`card mt-3`}>
      
        </label>
                  <CardSelector
                    image={item.image ? `http://localhost:5000/uploads/business-zones/${item.image}` : logo}
                    title={item.name}
                    textAlign="center"
                    name="card-group"
                    type="radio"
                  />

                </div>
              ))
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          
          <h4>{`Select package for ${packages[0]?.authority?.name} ${packages[0]?.authority?.zone.name}`}</h4>

          <div className="row">
            {isPackageLoading ? (
              <p>Loading packages...</p>
            ) : packages.length === 0 ? (
              <p>No packages available.</p>
            ) : (
              packages.map((item) => (
                <div
                  key={item.id}
                  className="col-4 p-2"
                  style={{ cursor: 'pointer' }}
                >
                  
                  <PackageCardSelector
                    item={item}
                    selected={selectedPackage?.id === item.id}
                    onClick={() =>
                   setSelectedPackage((prev) =>
                  prev?.id === item.id ? null : item
                              )
                        }
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <BusinessActivityStepSelector
  step={3}
  authority_id={selectedAuthority}
  max_activity_selected={max_activity_selected}
  setSelectedActivities={setSelectedActivities} 
  selectedActivities={selectedActivities}
/>
        // <BusinessActivityStepSelector step={3} authority_id={selectedAuthority } max_activity_selected={max_activity_selected}/>
      )}

    {step === 4 && (
  <BusinessQuestion  authorities={authorities} questionFormData={questionFormData} setQuestionFormData={setQuestionFormData}/>
)}


      {step === 5 && (
        <>
          <h4>What Include {packages[0]?.authority?.name} {packages[0]?.authority?.zone.name} </h4>
<CRow>
  <CCol md={5}>
        <CFormLabel >Name</CFormLabel>
  </CCol>
   <CCol md={3}>
<CFormLabel >Quantity</CFormLabel>
   </CCol>
    <CCol md={3}>
<CFormLabel >Cost</CFormLabel>
   </CCol>
    <CCol md={1}>
   </CCol>
</CRow>
          {includeExcludeList.map((item, index) => (
            <CRow key={index} className="align-items-center mb-3">

              <CCol md={5}>
                
                <CFormInput
                  type="text"
                  placeholder="Enter item description"
                  value={item.title}
                  onChange={(e) => handleIncludeExcludeChange(index, 'title', e.target.value)}
                />
              </CCol>

              <CCol md={3} className="d-flex align-items-center">
               <CFormInput
             type="number"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={(e) =>
             handleIncludeExcludeChange(index, 'quantity', e.target.value)
  }
/>
              </CCol>
              <CCol md={3} className="d-flex align-items-center">
               <CFormInput
  type="text"
  placeholder="Enter cost"
  value={item.cost }
  onChange={(e) =>
    handleIncludeExcludeChange(index, 'cost', e.target.value)
  }
/>
              </CCol>

              <CCol md={1} className="d-flex justify-content-start align-items-center">
                {includeExcludeList.length > 1 && (
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => removeIncludeExclude(index)}
                    style={{ marginLeft: '5px' }}
                  >
                    ✕
                  </CButton>
                )} 
              </CCol>
            </CRow>
          ))}

          <CRow className="mt-3">
            <CCol md={5}>
              <CButton color="info" onClick={addIncludeExclude}>
                Add More
              </CButton>
            </CCol>
          </CRow>
        </>
      )}

       {step === 6 && (
         <RequiredDocument requiredDocuments={requiredDocuments} setRequiredDocuments={setRequiredDocuments}/>
        
      )}
        {step === 7 && (
          <Benefits benefits={benefits} setBenefits={setBenefits} otherBenefits={otherBenefits} setOtherBenefits={setOtherBenefits}/>
        
      )}
      {step === 8 && (
        <ScopeOfWork scopeOfWork={scopeOfWork} setScopeOfWork={setScopeOfWork}/>
      )}

    {step === 9 && (
        <Notes notes={notes} setNotes={setNotes}/>
      )}
      {step === 10 && (
        <>
      <Clients
  selectedClient={selectedClient}
  setSelectedClient={setSelectedClient}
/>   
        </>
      )}

      {step === 11 && (
        <>
          <h4>Review & Generate PDF</h4>
          {/* <p>
            <strong>Authority:</strong> {selectedAuthority}
          </p> */}
         
          {/* <p>
            <strong>Answers:</strong> {answers.join(' | ')}
          </p> */}
          {/* <p>
            <strong>Package:</strong> {selectedPackage}
          </p> */}
          {/* <p>
            <strong>Client:</strong> {selectedClient}
          </p> */}
         
          <CButton className="custom-button me-3"  onClick={() => setShowPdfSummary(true)}>
                     View PDF
           </CButton>

          
            <CButton className="custom-button"  onClick={generatePDF}>
                     Generate PDF
              </CButton>
           {showPdfSummary && (
        <div className="mt-4">
          <ProposalSummary data={proposalData}  />
      
        </div>
      )}
        </>
      )}

      <div className="d-flex justify-content-end mt-4 mb-2">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="custom-button"
            style={{ padding: '10px 20px', marginRight: '10px' }}
          >
            Back
          </button>
        )}
        {step < 11 && (
          <button onClick={handleNext} className="custom-button " style={{ padding: '10px 20px' }}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default Proposal


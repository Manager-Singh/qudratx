
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../Components/Card/Card'
import logo from '../../../../../public/download.png' 
import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'
import { getBusinessActivityByAuthorityId } from '../../../../store/admin/businessActivitySlice'
import { useSelector, useDispatch } from 'react-redux'
import { getPackageByAuthorityId } from '../../../../store/admin/packageSlice'
import { FaCheckCircle } from 'react-icons/fa'
import CardSelectable from '../Components/CardSelector/CardSelector'
import CardSelector from '../Components/CardSelector/CardSelector'
import PackageCardSelector from '../Components/PackageCardSelector/PackageCardSelector'
import Select from 'react-select'


import './proposal.css'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormFeedback,
  CFormCheck,
  CFormSelect,
  CProgress, 
  CBadge,
  CProgressBar 
} from '@coreui/react'
import { FaTimes } from 'react-icons/fa';
import PackageCard from '../../ProposalManagement/package/PackageCard'
import RequiredDocument from './steps/RequiredDocument'
import Benefits from './steps/Benefits'
import ScopeOfWork from './steps/ScopeOfWork'
import Notes from './steps/Notes'
import { getClient } from '../../../../store/admin/clientSlice'
import BusinessActivityStepSelector from '../Components/helper/BusinessActivityInfiniteList'
import Clients from './Clients'
import BusinessQuestion from './steps/BusinessQuestion'

const activityOptions = [
  { id: 1, name: 'Consultancy' },
  { id: 2, name: 'IT Services' },
  { id: 3, name: 'Trading' },
  { id: 4, name: 'Manufacturing' },
]

const questions = [
  'What is your company name?',
  'What is your estimated investment?',
  'Do you need office space?',
  'How many visas are required?',
  'Do you need bank assistance?',
]

// include pre difine


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
]
const clientOptions = [
  { id: '1', name: 'Client1' },
  { id: '2', name: 'Client2' },
  { id: '3', name: 'Client3' },
]
const Proposal = () => {
  const { id } = useParams()
  const [step, setStep] = useState(1)
  const businessZonesAuthority = useSelector((state) => state.businessZonesAuthority)
  const authorities = businessZonesAuthority?.authorities || []
  const isLoading = businessZonesAuthority?.isLoading || false
  const { business_activities = [], isActivityLoading = false } = useSelector(
    (state) => state.business_activity || {}
  );
  
  // get package state from redux
  const {packages , isPackageLoading} = useSelector((state) => state.package);
  
  const dispatch = useDispatch()

  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [selectedActivities, setSelectedActivities] = useState([])
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedClient, setSelectedClient] = useState('')
  
  // state for search
  const [activitySearch, setActivitySearch] = useState('');
  const {clients} = useSelector((state)=>state.client)
  // dummy value to hide selected inside searchbar
  const MultiValue = () => null
  const total_step = 11

  // get business zonne authority
  useEffect(() => {
  if (id) {
    // fetch new authorities
    dispatch(getBusinessZonesAuthorityByZoneId({ id }));

    // reset state to initial
    setStep(1);
    setSelectedAuthority(null);
    setSelectedActivities([]);
    setSelectedPackage(null);
    setSelectedClient('');
    setAnswers(Array(questions.length).fill(''));
    setIncludeExcludeList(initialIncludeExcludeList);
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

  // activity optoipn from getactivity
  const activityOptions = business_activities.map((item) => ({
    value: item.id,
    label: item.activity_name,
  }))
  
  // handle selection at step 3
  const handleActivityChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value)
    setSelectedActivities(selectedIds)
  }
  
  
  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  

  const handleNext = () => {
    if (step < total_step) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const generatePDF = () => {
    console.log({
      id,
      selectedAuthority,
      selectedActivities,
      answers,
      selectedPackage,
      selectedClient,
    })
    alert('PDF Generated (placeholder)')
  }

  // questions submission
const [questionFormData, setQuestionFormData] = useState({
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
})

  const [includeExcludeList, setIncludeExcludeList] = useState(initialIncludeExcludeList)
  
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
  

const total_amount = selectedPackage?.total_amount
const max_activity_selected =selectedPackage?.activity

  return (
    <div className="container ">
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
          <h3>{}</h3>
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
        <BusinessActivityStepSelector step={3} authority_id={selectedAuthority } max_activity_selected={max_activity_selected}/>
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
  value={item.cost}
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
         <RequiredDocument/>
        
      )}
        {step === 7 && (
          <Benefits/>
        
      )}
      {step === 8 && (
        <ScopeOfWork/>
      )}

    {step === 9 && (
        <Notes/>
      )}
      {step === 10 && (
        <>
        <Clients selectedClientId={selectedClient} setSelectedClientId={setSelectedClient} />
         
        </>
      )}

      {step === 11 && (
        <>
          <h4>Review & Generate PDF</h4>
          <p>
            <strong>Authority:</strong> {selectedAuthority}
          </p>
          <p>
            <strong>Activities:</strong> {selectedActivities.join(', ')}
          </p>
          <p>
            <strong>Answers:</strong> {answers.join(' | ')}
          </p>
          {/* <p>
            <strong>Package:</strong> {selectedPackage}
          </p> */}
          <p>
            <strong>Client:</strong> {selectedClient}
          </p>
          <button
            onClick={generatePDF}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff' }}
          >
            Generate PDF
          </button>
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


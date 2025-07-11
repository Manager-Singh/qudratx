import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../Components/Card/Card'
import logo from '../../../../../public/download.png' // Custom styles (defined below)
import { getBusinessZonesAuthorityByZoneId } from '../../../../store/admin/zoneAuthoritySlice'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheckCircle } from 'react-icons/fa'
import CardSelectable from '../Components/CardSelector/CardSelector'
import CardSelector from '../Components/CardSelector/CardSelector'
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
  CProgressBar 
} from '@coreui/react'



const authorityOptions = [
  { id: '221', name: 'North Zone Supervisor' },
  { id: '222', name: 'JAFZA Offshore' },
  { id: '223', name: 'RAK ICC' },
  { id: '224', name: 'Ajman Offshore' },
  { id: '225', name: 'DED Dubai' },
]

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

const packageOptions = [
  { id: 'p1', name: 'Basic Package' },
  { id: 'p2', name: 'Standard Package' },
  { id: 'p3', name: 'Premium Package' },
]

const Proposal = () => {
  const { id } = useParams()
  const [step, setStep] = useState(1)
  const businessZonesAuthority = useSelector((state) => state.businessZonesAuthority)
  const authorities = businessZonesAuthority?.authorities || []
  const isLoading = businessZonesAuthority?.isLoading || false

  const dispatch = useDispatch()

  const [selectedAuthority, setSelectedAuthority] = useState(null)
  const [selectedActivities, setSelectedActivities] = useState([])
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedClient, setSelectedClient] = useState('')

  useEffect(() => {
    if (id) {
      console.log('use->', id)
      dispatch(getBusinessZonesAuthorityByZoneId({ id }))
    }
  }, [id, dispatch])

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleNext = () => {
    if (step < 7) setStep(step + 1)
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
  const [validated, setValidated] = useState(false)
  const formRef = useRef(null)

  const [partners, setPartners] = useState('')
  const [visas, setVisas] = useState('')
  const [tenancy, setTenancy] = useState('')
  const [withLocalPartner, setWithLocalPartner] = useState('')
  const [companyType, setCompanyType] = useState('')

  const [includeExcludeList, setIncludeExcludeList] = useState([
    { title: '', type: 'Include' },
  ])
  
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
  

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = formRef.current

    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      const data = {
        partners,
        visas,
        tenancy,
        withLocalPartner,
        companyType,
      }
      if (onSubmit) onSubmit(data)
    }

    setValidated(true)
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Proposal Form - Step {step}/7</h2>
    <CProgress color="info" className='mb-3' variant='striped' animated value={(step / 7) * 100}/> 
       {step === 1 && (
        <>
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
                  onClick={() => setSelectedAuthority(item.uuid)}
                >
                  <CardSelector image={logo} title={item.name} textAlign="center" />
                </div>
              ))
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h4>Select Business Activities</h4>
          <div className="row">
            {activityOptions.map((item) => {
              const isSelected = selectedActivities.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="col-3 p-2 position-relative"
                  onClick={() => handleActivityToggle(item.id)}
                >
                  {/* Tick Icon */}
                  {isSelected && (
                    <FaCheckCircle
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '12px',
                        color: 'green',
                        fontSize: '1.2rem',
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* Card Content */}
                  {/* <Card title={item.name} textAlign="center" /> */}
                  <CardSelector image={logo} title={item.name} textAlign="center" />
                </div>
              )
            })}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h4>Business Questions</h4>
          <CForm noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormLabel>How many partners?</CFormLabel>
                <CFormInput
                  type="number"
                  value={partners}
                  onChange={(e) => setPartners(e.target.value)}
                  required
                  feedbackInvalid="Please enter number of partners."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel>How many visas?</CFormLabel>
                <CFormInput
                  type="number"
                  value={visas}
                  onChange={(e) => setVisas(e.target.value)}
                  required
                  feedbackInvalid="Please enter number of visas."
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel>Include tenancy (office space) details in this proposal?</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="tenancy"
                    id="tenancyYes"
                    label="Yes"
                    value="yes"
                    checked={tenancy === 'yes'}
                    onChange={() => setTenancy('yes')}
                    required
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="tenancy"
                    id="tenancyNo"
                    label="No"
                    value="no"
                    checked={tenancy === 'no'}
                    onChange={() => setTenancy('no')}
                    required
                  />
                </div>
                {!tenancy && validated && (
                  <CFormFeedback className="d-block text-danger">
                    Please select an option.
                  </CFormFeedback>
                )}
              </CCol>

              <CCol xs={12}>
                <CFormLabel>
                  Would you like to set up this business with or without a local partner?
                </CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="withLocalPartner"
                    id="withPartner"
                    label="With Local"
                    value="with"
                    checked={withLocalPartner === 'with'}
                    onChange={() => setWithLocalPartner('with')}
                    required
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="withLocalPartner"
                    id="withoutPartner"
                    label="Without Local"
                    value="without"
                    checked={withLocalPartner === 'without'}
                    onChange={() => setWithLocalPartner('without')}
                    required
                  />
                </div>
                {!withLocalPartner && validated && (
                  <CFormFeedback className="d-block text-danger">
                    Please select an option.
                  </CFormFeedback>
                )}
              </CCol>

              <CCol xs={12}>
                <CFormLabel>Company Type</CFormLabel>
                <CFormSelect
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  required
                  feedbackInvalid="Please select a company type."
                >
                  <option value="">-- Select Company Type --</option>
                  <option value="llc">Limited Liability Company (LLC)</option>
                  <option value="sole">Sole</option>
                  <option value="civil">Civil</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </>
      )}

      {step === 4 && (
        <>
          <h4>What is Include and Exclude</h4>

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

              <CCol md={4} className="d-flex align-items-center">
                <CFormSelect
                  value={item.type}
                  onChange={(e) => handleIncludeExcludeChange(index, 'type', e.target.value)}
                >
                  <option value="Include">Include</option>
                  <option value="Exclude">Exclude</option>
                </CFormSelect>
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

      {step === 5 && (
        <>
          <h4>Select License Package</h4>
          <div className="row">
            {packageOptions.map((item) => (
              <div key={item.id} className="col-4 p-2" onClick={() => setSelectedPackage(item.id)}>
                <CardSelector title={item.name} textAlign="center" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <h4>Search & Select Client</h4>
          <input
            type="text"
            className="form-control"
            placeholder="Enter client name or ID"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          />
        </>
      )}

      {step === 7 && (
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
          <p>
            <strong>Package:</strong> {selectedPackage}
          </p>
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

      <div className="d-flex justify-content-between mt-4">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="custom-button"
            style={{ padding: '10px 20px', marginRight: '10px' }}
          >
            Back
          </button>
        )}
        {step < 7 && (
          <button onClick={handleNext} className="custom-button" style={{ padding: '10px 20px' }}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default Proposal

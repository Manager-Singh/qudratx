import React from 'react'
import {
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'

function BusinessQuestion({ authorities, questionFormData, setQuestionFormData }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target
    let val = value

    // Prevent negative values in number inputs
    if (type === 'number' && parseFloat(value) < 0) {
      val = ''
    }

    setQuestionFormData((prev) => ({
      ...prev,
      [name]: val,
    }))
  }

  const showMainlandFields =
    authorities.length > 0 &&
    authorities[0]?.zone?.name?.trim().toLowerCase() === 'mainland'

  return (
    <>
      <h4>Business Questions</h4>
      <CForm>
        <CRow className="g-3 m-3">
          <CCol xs={12}>
            <CFormLabel>How many partners?</CFormLabel>
            <CFormInput
              type="number"
              name="partners"
              value={questionFormData.partners}
              onChange={handleChange}
            />
          </CCol>

          <CCol xs={12}>
            <CFormLabel>How many visas?</CFormLabel>
            <CFormInput
              type="number"
              name="visas"
              value={questionFormData.visas}
              onChange={handleChange}
            />
          </CCol>
          {questionFormData.visas && (
                <CCol xs={12}>
                  <CFormLabel>Enter Visa Amount</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="VisaAmount"
                    value={questionFormData.visaAmount || ''}
                    onChange={handleChange}
                  />
                </CCol>
              )}

          {showMainlandFields && (
            <>
              {/* Tenancy */}
              <CCol xs={12}>
                <CFormLabel>Include tenancy (office space) in proposal?</CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="tenancy"
                    id="tenancyYes"
                    label="Yes"
                    value="yes"
                    checked={questionFormData.tenancy === 'yes'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="tenancy"
                    id="tenancyNo"
                    label="No"
                    value="no"
                    checked={questionFormData.tenancy === 'no'}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              {questionFormData.tenancy === 'yes' && (
                <CCol xs={12}>
                  <CFormLabel>Enter Tenancy Amount</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="tenancyAmount"
                    value={questionFormData.tenancyAmount || ''}
                    onChange={handleChange}
                  />
                </CCol>
              )}

              {/* With Local Partner */}
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
                    checked={questionFormData.withLocalPartner === 'with'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="withLocalPartner"
                    id="withoutPartner"
                    label="Without Local"
                    value="without"
                    checked={questionFormData.withLocalPartner === 'without'}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              {questionFormData.withLocalPartner === 'with' && (
                <CCol xs={12}>
                  <CFormLabel>Enter Local Partner Fee</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="localPartnerAmount"
                    value={questionFormData.localPartnerAmount || ''}
                    onChange={handleChange}
                  />
                </CCol>
              )}

              {/* Language Option */}
              <CCol xs={12}>
                <CFormLabel>Select Company Name Language </CFormLabel>
                <div>
                  <CFormCheck
                    inline
                    type="radio"
                    name="language"
                    id='English'
                    label="English"
                    value="english"
                    checked={questionFormData.language === 'english'}
                    onChange={handleChange}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="language"
                    id='Arabic'
                    label="Arabic"
                    value="arabic"
                    checked={questionFormData.language === 'arabic'}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              {/* Only show amount if English is selected */}
              {questionFormData.language === 'english' && (
                <CCol xs={12}>
                  <CFormLabel>Enter Company Name Language Amount</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="languageAmount"
                    value={questionFormData.languageAmount || ''}
                    onChange={handleChange}
                  />
                </CCol>
              )}

              {/* Company Type */}
              <CCol xs={12}>
                <CFormLabel>Company Type</CFormLabel>
                <CFormSelect
                  name="companyType"
                  value={questionFormData.companyType}
                  onChange={handleChange}
                >
                  <option value="">-- Select Company Type --</option>
                  <option value="Limited Liability Company">Limited Liability Company (LLC)</option>
                  <option value="Limited Liability Company Single Partner">Limited Liability Company Single Partner (LLCsp)</option>
                  <option value="sole">Sole</option>
                  <option value="civil">Civil</option>
                </CFormSelect>
              </CCol>

              {questionFormData.companyType && (
                <CCol xs={12}>
                  <CFormLabel>Enter Company Type Fee</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="companyTypeAmount"
                    value={questionFormData.companyTypeAmount || ''}
                    onChange={handleChange}
                  />
                </CCol>
              )}
            </>
          )}
        </CRow>
      </CForm>
    </>
  )
}

export default BusinessQuestion

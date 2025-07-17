import React from 'react'
import {
  CButton,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CFormFeedback,
} from '@coreui/react'

function BusinessQuestion({ authorities, questionFormData, setQuestionFormData, validated }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setQuestionFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
              required
              feedbackInvalid="Please enter number of partners."
            />
          </CCol>

          <CCol xs={12}>
            <CFormLabel>How many visas?</CFormLabel>
            <CFormInput
              type="number"
              name="visas"
              value={questionFormData.visas}
              onChange={handleChange}
              required
              feedbackInvalid="Please enter number of visas."
            />
          </CCol>

          {authorities.length > 0 &&
            authorities[0]?.zone?.name?.trim().toLowerCase() === 'mainland' && (
              <>
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
                      checked={questionFormData.tenancy === 'yes'}
                      onChange={handleChange}
                      required
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
                      required
                    />
                  </div>
                  {!questionFormData.tenancy && validated && (
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
                      checked={questionFormData.withLocalPartner === 'with'}
                      onChange={handleChange}
                      required
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
                      required
                    />
                  </div>
                  {!questionFormData.withLocalPartner && validated && (
                    <CFormFeedback className="d-block text-danger">
                      Please select an option.
                    </CFormFeedback>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel>Company Type</CFormLabel>
                  <CFormSelect
                    name="companyType"
                    value={questionFormData.companyType}
                    onChange={handleChange}
                    required
                    feedbackInvalid="Please select a company type."
                  >
                    <option value="">-- Select Company Type --</option>
                    <option value="Limited Liability Company (LLC)">
                      Limited Liability Company (LLC)
                    </option>
                    <option value="Limited Liability Company (LLC) Single Partner">
                      Limited Liability Company (LLC) Single Partner
                    </option>
                    <option value="sole">Sole</option>
                    <option value="civil">Civil</option>
                  </CFormSelect>
                </CCol>
              </>
            )}
        </CRow>
      </CForm>
    </>
  )
}

export default BusinessQuestion

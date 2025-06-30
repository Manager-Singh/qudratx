import React, { useState } from 'react'

import { CButton, CCol,CRow, CForm, CFormInput } from '@coreui/react'
function AddBusinessZone() {
const [isEdit , setIsEdit]= useState(false)
const [ name , setName] = useState('')
   const handleChange = (e)=>{
   setName(e.target.value)
   }
   const handleSubmit =()=>{

   }
  return (
    <div className='container'>
          <div className='card mt-3'>
            <div className='card-body'>
              <h4 className='card-title'>
                {isEdit ? 'Edit BusinessZone' : 'Add BusinessZone'}
              </h4>
    
              <CForm onSubmit={handleSubmit}>
                <CRow className="g-3 m-3">
                  <CCol xs={12}>
                    <CFormInput
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={name}
                      onChange={handleChange}
                    />
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
  )
}

export default AddBusinessZone
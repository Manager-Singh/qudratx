import React, { useState, useEffect } from 'react'
import { CButton, CCol, CRow, CForm, CFormInput, CFormSelect } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai';

// Dummy data store simulating API and Redux state
let dummyFeeStructures = [
  { uuid: '1', name: 'Admission Fee', amount: 1000, status: 'Active' },
  { uuid: '2', name: 'Library Fee', amount: 500, status: 'Inactive' },
  { uuid: '3', name: 'Sports Fee', amount: 750, status: 'Active' },
]

function AddFeeStructure() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('Active')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { id } = useParams() // uuid for edit mode
  const isEdit = Boolean(id)

  // On mount if edit, load the fee structure data from dummy store
  useEffect(() => {
    if (isEdit) {
      const fee = dummyFeeStructures.find((f) => f.uuid === id)
      if (fee) {
        setName(fee.name)
        setAmount(fee.amount)
        setStatus(fee.status)
      } else {
        setError('Fee structure not found')
      }
    }
  }, [id, isEdit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!status) {
      setError('Status is required')
      return
    }

    if (isEdit) {
      // Update dummy data
      dummyFeeStructures = dummyFeeStructures.map((f) =>
        f.uuid === id ? { ...f, name, amount: Number(amount), status } : f
      )
      alert('Fee structure updated successfully')
    } else {
      // Add new fee structure
      const newUuid = (dummyFeeStructures.length + 1).toString()
      dummyFeeStructures.push({ uuid: newUuid, name, amount: Number(amount), status })
      alert('Fee structure added successfully')
      // Clear form after add
      setName('')
      setAmount('')
      setStatus('Active')
    }

    setError('')
    navigate('/fee-structure')
  }

  return (
    <div className="container">
      <div className="card mt-3 position-relative">
        {/* Close icon button */}
        <button
          onClick={() => navigate('/fee-structure')}
          className="btn btn-link position-absolute top-0 end-0 m-2 p-0"
          style={{ fontSize: '1.5rem' }}
        >
          <AiOutlineClose />
        </button>

        <div className="card-body">
          <h4 className="card-title">{isEdit ? 'Edit Fee Structure' : 'Add Fee Structure'}</h4>
          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3 m-3">
              <CCol xs={12}>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Fee Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>

              <CCol xs={12}>
                <CFormInput
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={0}
                  step="any"
                />
              </CCol>

              <CCol xs={12}>
                <CFormSelect
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </CFormSelect>
              </CCol>

              {error && (
                <CCol xs={12}>
                  <div className="bg-danger text-white py-2 rounded">{error}</div>
                </CCol>
              )}

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

export default AddFeeStructure

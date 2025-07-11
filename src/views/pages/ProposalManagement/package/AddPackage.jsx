import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CButton,
  CCol,
  CRow,
  CContainer,
  CFormFeedback,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getFeeStructures } from '../../../../store/admin/feeStructureSlice'
import { addPackage, getPackageByUUID, updatePackage } from '../../../../store/admin/packageSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastExample } from '../../../../components/toast/Toast'

function AddPackage() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { feestructures } = useSelector((state) => state.feeStructure)

  const [toastData, setToastData] = useState({ show: false, status: '', message: '' })
  const [fetchedPackage, setFetchedPackage] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee_structure: {},
    isDiscountEnabled: false,
    discount: 0,
    tax: 0,
    subtotal: 0,
    total_amount: 0,
    status: 1,
  })

  const [validated, setValidated] = useState(false)
  const TAX_RATE = 0.18

  const showToast = (status, message) => {
    setToastData({ show: true, status, message })
    setTimeout(() => setToastData({ show: false, status: '', message: '' }), 3000)
  }

  // Fetch available fee structures
  useEffect(() => {
    dispatch(getFeeStructures())
  }, [dispatch])

  // Fetch package if editing
  useEffect(() => {
    if (uuid) {
      dispatch(getPackageByUUID(uuid)).then((res) => {
        const pkg = res.payload.data
        if (pkg) {
          setFetchedPackage(pkg)
          setFormData((prev) => ({
            ...prev,
            name: pkg.name,
            description: pkg.description,
            isDiscountEnabled: !!pkg.discount,
            discount: pkg.discount || 0,
            tax: pkg.tax || 0,
            subtotal: pkg.subtotal || 0,
            total_amount: pkg.total_amount || 0,
            status: pkg.status ?? 1,
          }))
        }
      })
    }
  }, [uuid, dispatch])

  // Merge fee structures from backend and frontend when both are available
  useEffect(() => {
    if (feestructures.length > 0) {
      setFormData((prev) => {
        const updatedFees = {}

        feestructures.forEach((item) => {
          let matched = null

         
if (fetchedPackage && fetchedPackage.fee_structure) {
  const amount = fetchedPackage.fee_structure[item.name]
  if (typeof amount !== 'undefined') {
    matched = { name: item.name, amount }
  }
}

          updatedFees[item.id] = {
            enabled: !!matched,
            amount: matched ? matched.amount : item.amount || 0,
            name: item.name,
          }
        })

        return { ...prev, fee_structure: updatedFees }
      })
    }
  }, [feestructures, fetchedPackage])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'discount'
          ? value === '' ? 0 : Math.max(0, parseFloat(value))
          : value,
    }))
  }

  const handleFeeChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      fee_structure: {
        ...prev.fee_structure,
        [id]: {
          ...prev.fee_structure[id],
          [field]: field === 'enabled' ? value : value === '' ? 0 : Math.max(0, parseFloat(value)),
        },
      },
    }))
  }

  const subtotal = Object.values(formData.fee_structure).reduce(
    (sum, fee) => (fee.enabled ? sum + (parseFloat(fee.amount) || 0) : sum),
    0
  )
  const discount = formData.isDiscountEnabled ? parseFloat(formData.discount || 0) : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = Math.max(subtotal - discount + tax, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      const feeDetails = Object.entries(formData.fee_structure)
        .filter(([_, val]) => val.enabled)
        .map(([_, val]) => ({
          name: val.name,
          amount: isNaN(val.amount) ? 0 : val.amount,
        }))

      const payload = {
        name: formData.name,
        description: formData.description,
        fee_structure: feeDetails.reduce((acc, item) => {
          acc[item.name] = item.amount
          return acc
        }, {}),
        discount: formData.isDiscountEnabled ? formData.discount : 0,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total_amount: parseFloat(total.toFixed(2)),
        status: formData.status,
        last_update: new Date(),
      }

      const action = uuid ? updatePackage({ uuid, payload }) : addPackage(payload)
      dispatch(action).then((data) => {
        if (data.payload.success) {
          showToast('success', data.payload.message)
          setTimeout(() => navigate('/packages'), 1500)
        }
      })
    }

    setValidated(true)
  }

  return (
    <CContainer className="mt-4">
      {toastData.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <ToastExample status={toastData.status} message={toastData.message} />
        </div>
      )}
      <CForm noValidate validated={validated} onSubmit={handleSubmit} className="container">
        <CRow className="g-3 align-items-end">
          <CCol md={12}>
            <CFormLabel htmlFor="name">Name <span className="text-danger">*</span></CFormLabel>
            <CFormInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter package name"
            />
            <CFormFeedback invalid>Name is required.</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="description">Description <span className="text-danger">*</span></CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              className="mb-3"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter description"
            />
            <CFormFeedback invalid>Description is required.</CFormFeedback>
          </CCol>

          <CCol xs={12}>
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </CFormSelect>
          </CCol>

          {feestructures.map((item) => {
            const fee = formData.fee_structure[item.id] || { enabled: false, amount: item.amount || 0 }

            return (
              <CCol md={12} key={item.id}>
                <CRow className="align-items-center">
                  <CCol xs="auto">
                    <CFormCheck
                      id={`fee-${item.id}`}
                      checked={fee.enabled}
                      onChange={(e) => handleFeeChange(item.id, 'enabled', e.target.checked)}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <CFormLabel htmlFor={`fee-${item.id}`} className="mb-0">{item.name}</CFormLabel>
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      value={fee.amount === 0 ? '' : fee.amount}
                      onChange={(e) => handleFeeChange(item.id, 'amount', e.target.value)}
                      min={0}
                      disabled={!fee.enabled}
                    />
                  </CCol>
                </CRow>
              </CCol>
            )
          })}

          <CCol md={12}>
            <CRow className="align-items-center">
              <CCol xs="auto">
                <CFormCheck
                  id="isDiscountEnabled"
                  name="isDiscountEnabled"
                  checked={formData.isDiscountEnabled}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs="auto">
                <CFormLabel htmlFor="isDiscountEnabled" className="mb-0">Discount</CFormLabel>
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount === 0 ? '' : formData.discount}
                  onChange={handleChange}
                  min={0}
                  disabled={!formData.isDiscountEnabled}
                />
              </CCol>
            </CRow>
          </CCol>

          <CCol md={12}>
            <CRow className="px-2">
              <CCol xs={12}><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</CCol>
              <CCol xs={12}><strong>Discount:</strong> ₹{discount.toFixed(2)}</CCol>
              <CCol xs={12}><strong>Tax:</strong> ₹{tax.toFixed(2)} <span className="text-muted">({(TAX_RATE * 100)}%)</span></CCol>
              <CCol xs={12}><strong>Total Amount:</strong> ₹{total.toFixed(2)}</CCol>
            </CRow>
          </CCol>

          <CCol xs={12}>
            <CButton type="submit" color="primary">Submit</CButton>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  )
}

export default AddPackage



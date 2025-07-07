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
  CFormTextarea
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getFeeStructures } from '../../../../store/admin/feeStructureSlice'
import { addPackage, getPackageByUUID, updatePackage } from '../../../../store/admin/packageSlice'
import { useNavigate, useParams } from 'react-router-dom'

const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/ (.)/g, (_, group1) => group1.toUpperCase())

function AddPackage() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { feestructures } = useSelector((state) => state.feeStructure)

  const TAX_RATE = 0.18

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fees: {},
    isDiscountEnabled: false,
    discountAmount: 0,
    tax: 0,
    total: 0,
    subtotal: 0
  })

  const [validated, setValidated] = useState(false)

  useEffect(() => {
    dispatch(getFeeStructures())
  }, [dispatch])

  useEffect(() => {
    if (uuid) {
      dispatch(getPackageByUUID(uuid)).then((res) => {
        const pkg = res.payload
        if (pkg) {
          const updatedFees = {}
          pkg.feeDetails.forEach((fee) => {
            const key = toCamelCase(fee.name)
            updatedFees[key] = {
              enabled: true,
              amount: fee.amount,
            }
          })

          setFormData({
            name: pkg.name,
            description: pkg.description,
            fees: updatedFees,
            isDiscountEnabled: !!pkg.discountAmount,
            discountAmount: pkg.discountAmount || 0,
            tax: pkg.tax || 0,
            total: pkg.total || 0,
             subtotal: pkg.subtotal || 0,
          })
        }
      })
    }
  }, [uuid])

  useEffect(() => {
    if (feestructures.length > 0) {
      setFormData((prev) => {
        const updatedFees = { ...prev.fees }
        feestructures.forEach((item) => {
          const key = toCamelCase(item.name)
          if (!updatedFees[key]) {
            updatedFees[key] = {
              enabled: false,
              amount: item.amount || 0,
            }
          }
        })
        return { ...prev, fees: updatedFees }
      })
    }
  }, [feestructures])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'discountAmount'
          ? value === '' ? 0 : Math.max(0, parseFloat(value))
          : value,
    }))
  }

  const handleFeeChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [key]: {
          ...prev.fees[key],
          [field]:
            field === 'enabled'
              ? value
              : value === ''
              ? 0
              : Math.max(0, parseFloat(value)),
        },
      },
    }))
  }

  const subtotal = Object.values(formData.fees).reduce(
    (sum, fee) => (fee.enabled ? sum + (parseFloat(fee.amount) || 0) : sum),
    0
  )
  const discount = formData.isDiscountEnabled ? parseFloat(formData.discountAmount || 0) : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = Math.max(subtotal - discount + tax, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      const feeDetails = Object.entries(formData.fees)
        .filter(([_, val]) => val.enabled)
        .map(([key, val]) => ({
          name: key,
          amount: isNaN(val.amount) ? 0 : val.amount,
        }))

      const feesObject = feeDetails.reduce((acc, item) => {
        acc[item.name] = item.amount
        return acc
      }, {})

      const payload = {
        name: formData.name,
        description: formData.description,
        fees: feesObject,
        discountAmount: formData.isDiscountEnabled ? formData.discountAmount : 0,
        subtotal: parseFloat(subtotal.toFixed(2)), 
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      }

      if (uuid) {
        dispatch(updatePackage({ uuid, payload })).then((data) => {
          if (data.payload.success) {
            navigate('/packages')
          }
        })
      } else {
        console.log(payload ,"payload")
        // dispatch(addPackage(payload)).then((data) => {
        //   if (data.payload.success) {
        //     navigate('/packages')
        //   }
        // })
      }
    }

    setValidated(true)
  }

  return (
    <CContainer className="mt-4">
      <CForm noValidate validated={validated} onSubmit={handleSubmit} className="container">
        <CRow className="g-3 align-items-end">
          {/* Name */}
          <CCol md={12}>
            <CFormLabel htmlFor="name">
              Name <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter package name"
            />
            <CFormFeedback invalid>Name is required.</CFormFeedback>
          </CCol>

          {/* Description */}
          <CCol md={12}>
            <CFormLabel htmlFor="description">
              Description <span className="text-danger">*</span>
            </CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              className="mb-3"
              onChange={handleChange}
              value={formData.description}
              required
              placeholder="Enter description"
            ></CFormTextarea>
            <CFormFeedback invalid>Description is required.</CFormFeedback>
          </CCol>

          {/* Fee Items */}
          {feestructures.map((item) => {
            const key = toCamelCase(item.name)
            const fee = formData.fees[key] || { enabled: false, amount: item.amount || 0 }

            return (
              <CCol md={12} key={item.id}>
                <CRow className="align-items-center">
                  <CCol xs="auto">
                    <CFormCheck
                      id={`fee-${item.id}`}
                      checked={fee.enabled}
                      onChange={(e) => handleFeeChange(key, 'enabled', e.target.checked)}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <CFormLabel htmlFor={`fee-${item.id}`} className="mb-0">
                      {item.name}
                    </CFormLabel>
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      value={fee.amount === 0 ? '' : fee.amount}
                      onChange={(e) => handleFeeChange(key, 'amount', e.target.value)}
                      min={0}
                      disabled={!fee.enabled}
                    />
                  </CCol>
                </CRow>
              </CCol>
            )
          })}

          {/* Discount */}
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
                <CFormLabel htmlFor="isDiscountEnabled" className="mb-0">
                  Discount
                </CFormLabel>
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  id="discountAmount"
                  name="discountAmount"
                  value={formData.discountAmount === 0 ? '' : formData.discountAmount}
                  onChange={handleChange}
                  min={0}
                  disabled={!formData.isDiscountEnabled}
                />
              </CCol>
            </CRow>
          </CCol>

          {/* Totals */}
          <CCol md={12}>
            <CRow className="px-2">
              <CCol xs={12}>
                <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
              </CCol>
              <CCol xs={12}>
                <strong>Discount:</strong> ₹{discount.toFixed(2)}
              </CCol>
              <CCol xs={12}>
                <strong>Tax:</strong> ₹{tax.toFixed(2)}{' '}
                <span className="text-muted">({(TAX_RATE * 100).toFixed(0)}%)</span>
              </CCol>
              <CCol xs={12}>
                <strong>Total:</strong> ₹{total.toFixed(2)}
              </CCol>
            </CRow>
          </CCol>

          {/* Submit */}
          <CCol xs={12}>
            <CButton type="submit" color="primary">
              Submit
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  )
}

export default AddPackage

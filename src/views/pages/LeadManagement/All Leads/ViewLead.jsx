import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CButton, CFormSelect } from "@coreui/react";
import { getBusinessZone } from '../../../../store/admin/businessZoneSlice';
import { getBusinessActivity } from '../../../../store/admin/businessActivitySlice';

const dummyLeads = [
  {
    uuid: '1a2b3c4d', name: 'Software Development',
    address: '123 Tech Park, Bengaluru', email: 'dev@example.com',
    company_name: 'TechNova Pvt Ltd', notes: 'Handles all custom software projects.',
    created_at: '2025-06-01T10:00:00Z',
  },
  // ... more leads
];

const dummyLicensePackages = [
  { id: 1, name: "Basic Package", content: "Includes basic license features." },
  { id: 2, name: "Standard Package", content: "Includes standard features with support." },
  { id: 3, name: "Premium Package", content: "Full access, premium support, and customization." }
];

const ViewLead = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { businesszones } = useSelector(state => state.businesszone);
  const { business_activities } = useSelector(state => state.business_activity);

  const [lead, setLead] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    businessZone: '',
    authority: '',
    businessActivity: '',
    licensePackage: '',
    customPackage: '',
  });

  useEffect(() => {
    const foundLead = dummyLeads.find((item) => item.uuid === uuid);
    setLead(foundLead);
    dispatch(getBusinessZone());
    dispatch(getBusinessActivity());
  }, [uuid, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  if (!lead) return <div className="p-4">Loading lead details...</div>;

  return (
    <div className="container mt-4">
      <CButton color="secondary" className="mb-3" onClick={() => navigate('/all-lead')}>
        ← Back to All Leads
      </CButton>

      <h3 className="mb-4">Lead Details</h3>
      <table className="table table-bordered">
        <tbody>
          <tr><th>Name</th><td>{lead.name}</td></tr>
          <tr><th>Email</th><td>{lead.email}</td></tr>
          <tr><th>Address</th><td>{lead.address}</td></tr>
          <tr><th>Company</th><td>{lead.company_name}</td></tr>
          <tr><th>Notes</th><td>{lead.notes}</td></tr>
          <tr><th>Created At</th><td>{new Date(lead.created_at).toLocaleString()}</td></tr>
        </tbody>
      </table>

      <CButton color="primary" onClick={() => setShowProposalForm(!showProposalForm)}>
        {showProposalForm ? 'Hide Proposal Form' : 'Create Proposal'}
      </CButton>

      {showProposalForm && (
        <div className="mt-4 border rounded p-4 bg-light">
          <h5>Proposal Form - Step {step}</h5>

          {step === 1 && (
            <>
              <label>Select Business Zone:</label>
              <CFormSelect
                name="businessZone"
                value={formData.businessZone}
                onChange={handleChange}
              >
                <option value="">-- Select Zone --</option>
                {businesszones.map(zone => (
                  <option key={zone.uuid} value={zone.uuid}>{zone.name}</option>
                ))}
              </CFormSelect>
            </>
          )}

          {step === 2 && (
            <>
              <label>Select Specific Authority (based on Business Zone):</label>
              <CFormSelect
                name="authority"
                value={formData.authority}
                onChange={handleChange}
              >
                <option value="">-- Select Authority --</option>
                {/* Dummy authorities for now */}
                <option value="authority-1">Authority 1</option>
                <option value="authority-2">Authority 2</option>
              </CFormSelect>
            </>
          )}

          {step === 3 && (
            <>
              <label>Select Business Activity:</label>
              <div className="d-flex flex-column">
                {business_activities.map(activity => (
                  <label key={activity.uuid}>
                    <input
                      type="radio"
                      name="businessActivity"
                      value={activity.uuid}
                      checked={formData.businessActivity === activity.uuid}
                      onChange={handleChange}
                    />{' '}
                    {activity.name}
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <label>Select License Package:</label>
              <div className="d-flex flex-column mb-3">
                {dummyLicensePackages.map(pkg => (
                  <label key={pkg.id}>
                    <input
                      type="radio"
                      name="licensePackage"
                      value={pkg.id}
                      checked={formData.licensePackage === String(pkg.id)}
                      onChange={handleChange}
                    />{' '}
                    {pkg.name} - <small>{pkg.content}</small>
                  </label>
                ))}
              </div>
              <label>Custom Package (Optional):</label>
              <textarea
                name="customPackage"
                className="form-control"
                value={formData.customPackage}
                onChange={handleChange}
                placeholder="Enter custom package details if any..."
              ></textarea>
            </>
          )}

          <div className="d-flex justify-content-between mt-3">
            {step > 1 && <CButton color="secondary" onClick={handleBack}>Back</CButton>}
            {step < 4 ? (
              <CButton color="primary" onClick={handleNext}>Next</CButton>
            ) : (
              <CButton color="success" onClick={() => alert('Proposal Submitted!')}>
                Submit Proposal
              </CButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLead;

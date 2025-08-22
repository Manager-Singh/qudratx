import React, { useState } from 'react';
// Using Bootstrap Icons, which are a natural fit for a Bootstrap project
import { BsBellFill, BsEnvelopeFill } from 'react-icons/bs';
 
// A reusable toggle switch component using Bootstrap's form-switch
const ToggleSwitch = ({ id, checked, onChange, icon: Icon }) => {
  return (
    <div className="d-flex align-items-center">
      {Icon && <Icon className={`fs-5 me-2 ${checked ? 'text-primary' : 'text-muted'}`} />}
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
          checked={checked}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
 
// A component for each setting row, styled with Bootstrap
const SettingsRow = ({ event, description, setting, onToggle }) => {
  return (
    <li className="list-group-item d-flex align-items-center justify-content-between py-3">
      <div>
        <h5 className="mb-1">{event}</h5>
        <p className="mb-0 text-muted small">{description}</p>
      </div>
      <div className="d-flex align-items-center">
        <div className="me-4">
          <ToggleSwitch
            id={`${event}-inApp`}
            checked={setting.inApp}
            onChange={() => onToggle(event, 'inApp')}
            icon={BsBellFill}
          />
        </div>
        <div>
          <ToggleSwitch
            id={`${event}-email`}
            checked={setting.email}
            onChange={() => onToggle(event, 'email')}
            icon={BsEnvelopeFill}
          />
        </div>
      </div>
    </li>
  );
};
 
// The main Notification Settings component using Bootstrap classes
const NotificationSetting = () => {
  const [settings, setSettings] = useState({
    // Initial state for Lead notifications
    newLead: { inApp: true, email: true },
    leadAssigned: { inApp: true, email: true },
    leadStatusChange: { inApp: true, email: false },
    leadUnapproved: { inApp: true, email: true },
 
    // Initial state for Proposal notifications
    newProposal: { inApp: true, email: true },
    proposalApproved: { inApp: true, email: true },
    proposalSent: { inApp: false, email: true },
    proposalViewed: { inApp: true, email: false },
  });
 
  // A single handler to update any toggle (logic remains the same)
  const handleToggle = (eventKey, type) => {
    setSettings(prev => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        [type]: !prev[eventKey][type],
      },
    }));
    console.log(`Toggled '${type}' for '${eventKey}' to ${!settings[eventKey][type]}`);
  };
  
  const leadEvents = [
      { key: 'newLead', title: 'New Lead Created', description: 'When a new lead is added to the system.' },
      { key: 'leadAssigned', title: 'Lead Assigned', description: 'When a lead is assigned to you or your team.' },
      { key: 'leadStatusChange', title: 'Lead Status Change', description: 'When a lead\'s status is updated.' },
      { key: 'leadUnapproved', title: 'Lead Unapproved', description: 'When a lead fails the approval process.' },
  ];
  
  const proposalEvents = [
      { key: 'newProposal', title: 'New Proposal Created', description: 'When you create a new proposal.' },
      { key: 'proposalApproved', title: 'Proposal Approved', description: 'When an admin approves your proposal.' },
      { key: 'proposalSent', title: 'Proposal Sent to Client', description: 'When a proposal is successfully emailed.' },
      { key: 'proposalViewed', title: 'Client Views Proposal', description: 'When a client opens the proposal link.' },
  ];
 
  return (
    <div className="bg-light min-vh-100 p-3 p-md-4">
      <div className="container-lg">
        <div className="mb-4">
          <h1 className="fw-bold text-dark">Notification Settings</h1>
          <p className="text-muted">Manage how you receive notifications for important events.</p>
        </div>
 
        {/* Lead Notifications Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h4 className="mb-0">Lead Notifications</h4>
          </div>
          <ul className="list-group list-group-flush">
             {leadEvents.map(event => (
                <SettingsRow
                    key={event.key}
                    event={event.title}
                    description={event.description}
                    setting={settings[event.key]}
                    onToggle={(eventKey, type) => handleToggle(event.key, type)}
                />
             ))}
          </ul>
        </div>
 
        {/* Proposal Notifications Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h4 className="mb-0">Proposal Notifications</h4>
          </div>
          <ul className="list-group list-group-flush">
             {proposalEvents.map(event => (
                <SettingsRow
                    key={event.key}
                    event={event.title}
                    description={event.description}
                    setting={settings[event.key]}
                    onToggle={(eventKey, type) => handleToggle(event.key, type)}
                />
             ))}
          </ul>
        </div>
        
        <div className="mt-4 d-flex justify-content-end">
            <button
                className="btn btn-primary px-4 py-2"
                onClick={() => alert("Settings saved! (In a real app, this would call an API)")}
            >
                Save Changes
            </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default NotificationSetting;
import React from 'react';

/*
  NOTE: To run this React component, you would typically include the following
  in your main public/index.html file to load Bootstrap, Font Awesome, and Google Fonts:

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
*/

// --- Data for the Proposals ---
const proposalData = [
    {
        id: 'PROP-001',
        proposalTitle: 'Enterprise CRM Platform Upgrade',
        clientName: 'Innovate Solutions Ltd.',
        status: 'Sent', // e.g., Draft, Sent, Accepted, Rejected, Under Review
        value: 1500000, // Value in INR
        sentDate: '19 Aug, 2025',
        expiryDate: '18 Sep, 2025',
        owner: 'Anjali Mehta'
    },
    {
        id: 'PROP-002',
        proposalTitle: 'Cloud Migration & Infrastructure Setup',
        clientName: 'QuantumCore Analytics',
        status: 'Under Review',
        value: 2200000,
        sentDate: '22 Aug, 2025',
        expiryDate: '21 Sep, 2025',
        owner: 'Aditya Rao'
    },
    {
        id: 'PROP-003',
        proposalTitle: 'Digital Marketing Campaign (Q4)',
        clientName: 'GreenLeaf Organics',
        status: 'Draft',
        value: 750000,
        sentDate: null,
        expiryDate: null,
        owner: 'Aditya Rao'
    },
    {
        id: 'PROP-004',
        proposalTitle: 'Mobile App Development',
        clientName: 'TechGenix Pvt. Ltd.',
        status: 'Accepted',
        value: 1800000,
        sentDate: '15 Jul, 2025',
        expiryDate: '14 Aug, 2025',
        owner: 'Vikram Singh'
    },
    {
        id: 'PROP-005',
        proposalTitle: 'Logistics Management Software',
        clientName: 'NextWave Logistics',
        status: 'Rejected',
        value: 1200000,
        sentDate: '10 Aug, 2025',
        expiryDate: '09 Sep, 2025',
        owner: 'Vikram Singh'
    }
];

// --- Helper object for status styling ---
// Maps each status to a specific color and icon for visual consistency.
const statusStyles = {
    'Sent': { color: 'primary', icon: 'fas fa-paper-plane' },
    'Under Review': { color: 'info', icon: 'fas fa-magnifying-glass' },
    'Accepted': { color: 'success', icon: 'fas fa-check-circle' },
    'Rejected': { color: 'danger', icon: 'fas fa-times-circle' },
    'Draft': { color: 'secondary', icon: 'fas fa-pencil-alt' },
};

// --- Custom Styles ---
// Re-using the same modern styles for the container.
const CustomStyles = () => (
    <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
        }
        .feed-container {
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }
        .feed-body::-webkit-scrollbar {
            width: 6px;
        }
        .feed-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .feed-body::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 10px;
        }
        .feed-body::-webkit-scrollbar-thumb:hover {
            background: #c7c7c7;
        }
        .proposal-item {
            display: flex;
            align-items: flex-start;
            gap: 1.25rem;
            padding: 1.25rem;
            border-bottom: 1px solid #eff2f5;
            transition: background-color 0.2s ease-in-out;
        }
        .proposal-item:last-child {
            border-bottom: none;
        }
        .proposal-item:hover {
            background-color: #f8f9fa;
        }
        .proposal-icon-container {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
    `}</style>
);


// --- Proposal Item Component (Redesigned) ---
const ProposalItem = ({ proposal }) => {
    // Get the style (color and icon) for the current proposal's status.
    const style = statusStyles[proposal.status] || statusStyles['Draft'];
    
    // Format the value to a currency string (Indian Rupees).
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(proposal.value);

    return (
        <div className="proposal-item">
            <div className={`proposal-icon-container bg-${style.color}-subtle text-${style.color}-emphasis`}>
                <i className={style.icon}></i>
            </div>
            <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                        <h6 className="fw-bold mb-0">{proposal.proposalTitle}</h6>
                        <small className="text-muted">{proposal.clientName}</small>
                    </div>
                    <span className={`badge small rounded-pill bg-${style.color}-subtle text-${style.color}-emphasis border border-${style.color}-subtle`}>
                        {proposal.status}
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-end mt-2">
                    <p className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>
                        {formattedValue}
                    </p>
                    <small className="text-muted">Owner: {proposal.owner}</small>
                </div>
            </div>
        </div>
    );
};

// --- Main Proposal Feed Component ---
const NoticeBoard = () => {
    return (
        <div className="feed-container">
            <div className="p-4">
                <h4 className="fw-bold mb-0">Recent Proposals</h4>
            </div>
            <div 
                className="feed-body" 
                style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
                {proposalData.map(proposal => (
                    <ProposalItem key={proposal.id} proposal={proposal} />
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard
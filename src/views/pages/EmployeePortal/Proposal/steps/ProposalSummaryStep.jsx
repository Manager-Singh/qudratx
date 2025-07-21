import React, { useState } from 'react';
import { generateProposalPdf } from '../../../../../utils/generateProposalPdf';

const ProposalSummary = ({ data ,showPdf}) => {

  const handleDownload = () => {
    generateProposalPdf(data);
  };

  return ( 
  <div
          id="proposal-pdf-content"
          style={{
            padding: '20px',
            background: '#fff',
            color: '#000',
            position: 'relative',
            top: 0,
            left: 0,
            width: '100%',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Proposal Summary</h2>
          <p><strong>Client ID:</strong> {data?.client_id || 'N/A'}</p>
          <p><strong>Zone:</strong> {data?.zone_name || 'N/A'}</p>
          <p><strong>Authority:</strong> {data?.authority_name || 'N/A'}</p>
          <p><strong>Package:</strong> {data?.package_name || 'N/A'}</p>
          <p><strong>Total Amount:</strong> AED {data?.total_amount || 0}</p>

          <h3>Business Activities:</h3>
          <ul>
            {(data?.business_activities || []).map((act, i) => (
              <li key={i}>{act?.activity_code || act?.label}</li>
            ))}
          </ul>

          <h3>What’s Included:</h3>
          <ul>
            {(data?.what_to_include || []).map((item, i) => (
              <li key={i}>{item?.title} - AED {item?.cost}</li>
            ))}
          </ul>

          <h3>Required Documents:</h3>
          <ul>
            {(data?.required_documents || []).map((doc, i) => (
              <li key={i}>{doc?.name}</li>
            ))}
          </ul>

          <h3>Benefits:</h3>
          <ul>
            {(data?.benefits || []).map((b, i) => (
              <li key={i}>{b?.name}</li>
            ))}
          </ul>

          <h3>Other Benefits:</h3>
          <ul>
            {(data?.other_benefits || []).map((b, i) => (
              <li key={i}>{b?.name}</li>
            ))}
          </ul>

          <h3>Scope of Work:</h3>
          <ul>
            {(data?.scope_of_work || []).map((s, i) => (
              <li key={i}>{s?.name}</li>
            ))}
          </ul>

          <h3>Notes:</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{data?.notes || 'N/A'}</p>
        </div>
      
    
  );
};

export default ProposalSummary;

import React, { useState, useEffect } from 'react'
import { generateProposalPdf } from '../../../../../utils/generateProposalPdf'
import HeadingBar from './Components/HeadingBar'
import { getData } from '../../../../../utils/api'
import { useSelector } from 'react-redux'

const ProposalSummary = ({ data, showPdf }) => {
  const handleDownload = () => {
    generateProposalPdf(data)
  }

  // get company details and address
  const [webSetting, setWebSetting] = useState({
    id: null,
    uuid: '',
    name: '',
    email: '',
    phone: '',
    address: {
      city: '',
      type: '',
      line1: '',
      state: '',
      country: '',
      postal_code: '',
    },
    terms_and_conditions: '',
    bank_details: {
      bank: '',
      branch: '',
      bank_title: '',
      swift_code: '',
      iban_number: '',
      account_number: '',
    },
    description: '',
    logo: '',
    icon: null,
    created_at: '',
    updated_at: '',
    deleted_at: null,
    updated_by: null,
    last_update: null,
  })

  // set all variables

  useEffect(() => {
    const fetchWebSetting = async () => {
      try {
        const res = await getData('/admin/web-setting-info')
        if (res.success) {
          const data = res.data

          setWebSetting({
            id: data.id,
            uuid: data.uuid,
            name: data.name?.replace(/^"|"$/g, ''),
            email: data.email?.replace(/^"|"$/g, ''),
            phone: data.phone?.replace(/^"|"$/g, ''),
            address: {
              city: data.address?.[0]?.city || '',
              type: data.address?.[0]?.type || '',
              line1: data.address?.[0]?.line1 || '',
              state: data.address?.[0]?.state || '',
              country: data.address?.[0]?.country || '',
              postal_code: data.address?.[0]?.postal_code || '',
            },
            terms_and_conditions: data.terms_and_conditions?.replace(/^"|"$/g, ''),
            bank_details: {
              bank: data.bank_details?.bank || '',
              branch: data.bank_details?.branch || '',
              bank_title: data.bank_details?.bank_title || '',
              swift_code: data.bank_details?.swift_code || '',
              iban_number: data.bank_details?.iban_number || '',
              account_number: data.bank_details?.account_number || '',
            },
            description: data.description?.replace(/^"|"$/g, '') || '',
            logo: data.logo,
            icon: data.icon,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: data.deleted_at,
            updated_by: data.updated_by,
            last_update: data.last_update,
          })
        } else {
          console.error('Error fetching company info:', res.message)
        }
      } catch (error) {
        console.error('API call failed:', error)
      }
    }

    fetchWebSetting()
  }, [])

  // get current employee details
  const user = useSelector((state) => state.auth.user)

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
      <HeadingBar title={`${data?.authority_name}  ${data?.zone_name}`} position="center" />

      <ul>
        {(data?.business_activities || []).map((act, i) => (
          <li key={i} style={{ marginBottom: '20px', marginTop: '20px' }}>
            <p>
              Activity Code:<strong> {act?.activity_code || 'N/A'}</strong>
            </p>
            <p>
              Activity Name: <strong>{act?.activity_name || 'Unnamed Activity'}</strong>
            </p>
            <p>
              Activity Description:<strong> {act?.descriotion || 'N/A'}</strong>
            </p>
          </li>
        ))}
      </ul>

      <HeadingBar
        title={`Number of Visas: ${data?.business_questions?.visas || 0}`}
        position="center"
      />

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#4a148c', color: 'white' }}>
              <th
                style={{
                  padding: '14px 20px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: '14px 20px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                Item
              </th>
              <th
                style={{
                  padding: '14px 20px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: '14px 20px',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {(data?.what_to_include || []).map((item, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  transition: 'background-color 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white')
                }
              >
                <td
                  style={{
                    backgroundColor: '#fff',
                    color: '#333',
                    fontWeight: '700',
                    textAlign: 'center',
                    padding: '12px 20px',
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontWeight: '500',
                    color: '#333',
                  }}
                >
                  {item.title}
                </td>
                <td
                  style={{
                    padding: '12px 20px',
                    textAlign: 'center',
                    color: '#555',
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: '12px 20px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  {item.cost}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <td
                colSpan={3}
                style={{
                  textAlign: 'right',
                  padding: '14px 20px',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#333',
                  borderTop: '2px solid #ccc',
                }}
              >
                Total
              </td>
              <td
                style={{
                  textAlign: 'right',
                  padding: '14px 20px',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#333',
                  borderTop: '2px solid #ccc',
                }}
              >
                {data?.total_amount ?? 0}
              </td>
            </tr>
          </tbody>
        </table>

        <HeadingBar title="Required Documents" position="center" />

        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          {(data?.required_documents || []).map((doc, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>
              {doc.name}
            </li>
          ))}
        </ul>
      </div>

      <HeadingBar title="Benefits" position="center" />
      <div style={{ marginBottom: '25px' }}>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          {(data?.benefits || []).map((item, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <HeadingBar title="Other Benefits" position="center" />
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          {(data?.other_benefits || []).map((item, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Scope of Work List */}
      <div style={{ marginBottom: '25px' }}>
        <HeadingBar title="Scope of Work" position="center" />
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          {(data?.scope_of_work || []).map((item, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes Section */}
      <div>
        <HeadingBar title="Notes" position="center" />
        <div
          style={{
            backgroundColor: '#f7f7f7',
            padding: '15px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
          }}
        >
          {data?.notes || 'No notes available.'}
        </div>
      </div>

      {/* Company details */}
      <HeadingBar title={`${webSetting.name}`} position="center" />
      <div>
        <p>
          Created at:<strong>{new Date().toLocaleDateString()}</strong>
        </p>
        <p>
          Website:<strong> www.FZCS.com</strong>
        </p>
        <p>
          Email:<strong> {user.email}</strong>
        </p>
      </div>

      {/* agreement */}
      <HeadingBar title="Agreement" position="center" />
      <p>{webSetting.terms_and_conditions}</p>

      {/* signed details for employee and client */}
      <div className="signed-section">
        <div className="signed-single">
          <HeadingBar title="Signed for and on behalf of FZCS" position="center" />
          <span>
            <p>Consultant name</p>
            <p>{user.name}</p>
          </span>
          <span>
            <p>Date</p>
            <p>{new Date().toLocaleDateString()}</p>
          </span>
        </div>
        <div className="signed-single">
          <HeadingBar title="Signed for and on behalf of the Client" position="center" />
          <span>
            <p>Name</p>
            <p>{data?.client_info.name}</p>
          </span>
          <span>
            <p>Date</p>
            <p>{new Date().toLocaleDateString()}</p>
          </span>
        </div>
      </div>

      {/* company address */}
      <div>
        <HeadingBar
          title={`${webSetting.address.city} ${webSetting.address.type}`}
          position="center"
        />
        <div>
          <p>
            <strong>Address</strong>: {webSetting.address.line1}, {webSetting.address.city},{' '}
            {webSetting.address.state}, {webSetting.address.country} -{' '}
            {webSetting.address.postal_code}
          </p>
          <p>
            <strong>Contact Us</strong>: {webSetting.phone}
          </p>
          <p>
            <strong>Email</strong>: {webSetting.email}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProposalSummary

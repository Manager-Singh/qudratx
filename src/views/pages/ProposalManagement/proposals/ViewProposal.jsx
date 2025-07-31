import { useLocation } from 'react-router-dom';
import ProposalSummary from '../../EmployeePortal/Proposal/steps/ProposalSummaryStep';

function ViewProposal() {
  const location = useLocation()
  const proposalData = location.state?.proposal

  console.log(proposalData) // now you have access to full row data

  return (
    <div>
        <ProposalSummary data={proposalData} />
    </div>
  )
}

export default ViewProposal;
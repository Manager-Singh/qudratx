// import React, {useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux'
// import { CCard, CCardBody, CCardHeader } from "@coreui/react";
// import { Link, useNavigate } from "react-router-dom";
// import Card from "../Components/Card/Card";
// import { getBusinessZone } from "../../../../store/admin/businessZoneSlice";
// import "./Dashboard.css"
// import { CButton } from '@coreui/react';
// const data = [
//     {"id":1,
//     "name":"FreeZone"
//     },
//     {
//     "id":2,
//     "name":"MainLand"
//     }
// ]

// const Dashboard = () => {
//     const user = useSelector(state => state.auth.user)
//     const businesszones = useSelector(state => state.businesszone.businesszones);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//       dispatch(getBusinessZone())
//     }, [dispatch]);

//     const handleZone =(zone)=>{
//         console.log("Clicked on create Proposal") 
//         navigate(`/create-proposal/${zone.id}`);
//     }

//     console.log("data->",businesszones);

//   return (
//     <div className="container mt-1">
//       <h1 className="text-center mb-4">Dashboard</h1>

//       <div className="row">
//         {/* Left Section */}
//         <div className="col-md-8">
//           {/* Welcome Message */}
//           <CCard id="welcome" className="mb-3 card-background rounded-lg">
//             {/* <CCardHeader>Welcome message</CCardHeader> */}
//             <CCardBody>
//               <h2>Hello {user?.name}, welcome to your dashboard!</h2>
//             </CCardBody>
//           </CCard>

//           <div className="row">
//             {/* Proposal */}
//             <div className="col-md-6">
//               <CCard id="proposal" className="mb-3 card-background">
//                 {/* <CCardHeader>Proposal</CCardHeader> */}
//                 <CCardBody className="card-body-custom-padding">
//                   <div className="d-flex justify-content-around">
//                     <span className="card-title"><h2>Total <br />Proposals </h2></span>
//                     <span className="card-number" >19</span>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </div>

//             {/* Leads */}
//             <div className="col-md-6">
//               <CCard id="lead" className="mb-3 card-background">
//                 {/* <CCardHeader>Leads</CCardHeader> */}
//                 <CCardBody className="card-body-custom-padding">
//                   <div className="d-flex justify-content-around">
//                     <span className="card-title"><h2>Total <br />Leads </h2></span>
//                     <span className="card-number" >29</span>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </div>
//           </div>

//             <hr />
//           <div className="row">
//             {/* create proposal */}
//             <div className="col-md-6 w-100">
//               <h2>Create Proposal </h2>
//                 <div className="row">
//                     {/* {businesszones.map((zone) => (
//                         <div className="col-md-6 mb-3" key={zone.id}>
//                             <Card title={zone.name} textAlign="center" onClick={()=> handleZone(zone)}></Card>
//                         </div>
//                     ))} */}
//                     <Link to='/business-zones'> <CButton className='custom-button mt-3'>Create Proposal</CButton></Link>   
//                 </div>
//             </div>
//           </div>

//         </div>

//         {/* Right Section - Notes */}
//         <div className="col-md-4">
//           <CCard id="notes" className="card-background welcome-card">
//             {/* <CCardHeader>Notes</CCardHeader> */}
//             <h2 className="text-center mt-3">Notes</h2>
//             <CCardBody>
//               <p>Notes content goes here...</p>
//             </CCardBody>
//           </CCard>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect } from 'react'
import { CCard, CCardBody, CRow, CCol } from '@coreui/react'
import { FaUserFriends, FaClipboardList, FaUsers, FaChartLine, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardData } from '../../../../store/admin/dashboardSlice'
 import { CButton } from '@coreui/react';
import DashboardLineChart from './DashboardLineChart'
import NoticeBoard from '../../../../components/DashboardNoticeBoard/NoticeBoard'

const DashboardCard = ({ title, value, icon, color, change, description, trend }) => (
  <CCard className="shadow-sm border-0 h-100">
    <CCardBody className="d-flex justify-content-between align-items-center">
      <div>
        <h6 className="text-muted">{title}</h6>
        <h3 className="fw-bold">{value?.toLocaleString()}</h3>
        {/* <p className={`mb-0 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {trend === 'up' ? '↑' : '↓'} {change} vs last month
        </p> */}
        <small className="text-muted">{description}</small>
      </div>
      <div
        className="d-flex align-items-center justify-content-center rounded-circle text-white"
        style={{ width: '45px', height: '45px', backgroundColor: color }}
      >
        {icon}
      </div>
    </CCardBody>
  </CCard>
)

const Dashboard = () => {
  const dispatch= useDispatch()
  const {DasboardData} = useSelector((state)=>state.dashboard)

  useEffect(()=>{
    dispatch(getDashboardData())
    
  },[dispatch])
  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">FZCS Dashboard</h3>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="d-flex gap-2">
           <Link to='/business-zones'> <CButton className='custom-button '>Create Proposal</CButton></Link> 
          <button className="btn btn-outline-dark">👁 View Reports</button>
          <button className="btn btn-dark">📊 Analytics</button>
        </div>
      </div>

      <CRow className="gy-4">
       
        <CCol xs={12} md={6} xl={4}>
             <Link to="/my-proposal" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Proposals"
            value={DasboardData?.totalProposals}
            icon={<FaClipboardList />}
            color="#5b5bd6"
            change="+12.5%"
            description="Active proposals in system"
            trend="up"
          />
          </Link>
        </CCol>
        {/* <CCol xs={12} md={6} xl={4}>
             <NoticeBoard/>
        </CCol> */}


        <CCol xs={12} md={6} xl={4}>
             <Link to="/all-lead" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Leads"
            value={DasboardData?.totalLeads}
            icon={<FaChartLine />}
            color="#c17cff"
            change="+8.7%"
            description="Potential customers"
            trend="up"
          />
          </Link>
        </CCol>
         <CCol xs={12} md={6} xl={4}>
             <Link to='/all-lead' className="text-decoration-none text-dark" >
          <DashboardCard
            title="New Leads"
            value={DasboardData?.newLeads}
            icon={<FaChartLine />}
            color="#c17cff"
            change="+8.7%"
            description="Potential customers"
            trend="up"
          />
          </Link>
        </CCol>

        <CCol xs={12} md={6} xl={4}>
             <Link to={`/my-proposal?search=${encodeURIComponent("unapproved")}`}  className="text-decoration-none text-dark">
          <DashboardCard
            title="Unapproved Proposals"
            value={DasboardData?.unapprovedProposals}
            icon={<FaClock />}
            color="#ff5722"
            change="-2.1%"
            description="Pending approval"
            trend="down"
          />
          </Link>
        </CCol>
         <CCol xs={12} md={6} xl={4}>
             <Link to={`/my-proposal?search=${encodeURIComponent("pending")}`} className="text-decoration-none text-dark">
          <DashboardCard
            title="Pending Proposals"
            value={DasboardData?.pendingProposals}
            icon={<FaClock />}
            color="#ff5722"
            change="-2.1%"
            description="Pending approval"
            trend="down"
          />
          </Link>
        </CCol>

        <CCol xs={12} md={6} xl={4}>
             <Link to="/clients" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Clients"
            value={DasboardData?.totalClients}
            icon={<FaUsers />}
            color="#00bcd4"
            change="+4.9%"
            description="Active clients"
            trend="up"
          />
          </Link>
        </CCol>
      </CRow>
      <div className="my-4">
  <CCard className="shadow-sm border-0">
    <CCardBody>
      <h5 className="fw-bold mb-3">Overview Chart</h5>
     
         <DashboardLineChart data={DasboardData}/>
      
     
    </CCardBody>
  </CCard>
</div>
     
    </div>
  )
}

export default Dashboard

import React, {useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/Card/Card";
import "./Dashboard.css"

const data = [
    {"id":1,
    "name":"FreeZone"
    },
    {
    "id":2,
    "name":"MainLand"
    }
]

const Dashboard = () => {
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate();

    const handleZone =(zone)=>{
        console.log("Clicked on create Proposal") 
        navigate(`/authority/${zone.id}`);
    }

  return (
    <div className="container mt-1">
      <h1 className="text-center mb-4">Dashboard</h1>

      <div className="row">
        {/* Left Section */}
        <div className="col-md-8">
          {/* Welcome Message */}
          <CCard id="welcome" className="mb-3 card-background rounded-lg">
            {/* <CCardHeader>Welcome message</CCardHeader> */}
            <CCardBody>
              <h2>Hello {user?.name}, welcome to your dashboard!</h2>
            </CCardBody>
          </CCard>

          <div className="row">
            {/* Proposal */}
            <div className="col-md-6">
              <CCard id="proposal" className="mb-3 card-background">
                {/* <CCardHeader>Proposal</CCardHeader> */}
                <CCardBody className="card-body-custom-padding">
                  <div className="d-flex justify-content-around">
                    <span className="card-title"><h2>Total <br />Proposals </h2></span>
                    <span className="card-number" >19</span>
                  </div>
                </CCardBody>
              </CCard>
            </div>

            {/* Leads */}
            <div className="col-md-6">
              <CCard id="lead" className="mb-3 card-background">
                {/* <CCardHeader>Leads</CCardHeader> */}
                <CCardBody className="card-body-custom-padding">
                  <div className="d-flex justify-content-around">
                    <span className="card-title"><h2>Total <br />Leads </h2></span>
                    <span className="card-number" >29</span>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>

            <hr />
          <div className="row">
            {/* create proposal */}
            <div className="col-md-6 w-100">
              <h2>Create Proposal </h2>
                <div className="row">
                    {data.map((zone) => (
                        <div className="col-md-6 mb-3" key={zone.id}>
                            <Card title={zone.name} textAlign="center" onClick={()=> handleZone(zone)}></Card>
                        </div>
                    ))}
                </div>
            </div>
          </div>

        </div>

        {/* Right Section - Notes */}
        <div className="col-md-4">
          <CCard id="notes" className="card-background welcome-card">
            {/* <CCardHeader>Notes</CCardHeader> */}
            <h2 className="text-center mt-3">Notes</h2>
            <CCardBody>
              <p>Notes content goes here...</p>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

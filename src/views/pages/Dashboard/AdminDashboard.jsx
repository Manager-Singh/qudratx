import React from 'react'
import { CCard, CCardBody, CRow, CCol } from '@coreui/react'
import { FaUserFriends, FaClipboardList, FaUsers, FaChartLine, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const DashboardCard = ({ title, value, icon, color, change, description, trend }) => (
  <CCard className="shadow-sm border-0 h-100">
    <CCardBody className="d-flex justify-content-between align-items-center">
      <div>
        <h6 className="text-muted">{title}</h6>
        <h3 className="fw-bold">{value.toLocaleString()}</h3>
        <p className={`mb-0 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {trend === 'up' ? '↑' : '↓'} {change} vs last month
        </p>
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

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">FZCS Dashboard</h3>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark">👁 View Reports</button>
          <button className="btn btn-dark">📊 Analytics</button>
        </div>
      </div>

      <CRow className="gy-4">
        <CCol xs={12} md={6} xl={4}>
             <Link to="/proposals" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Proposals"
            value={2847}
            icon={<FaClipboardList />}
            color="#5b5bd6"
            change="+12.5%"
            description="Active proposals in system"
            trend="up"
          />
          </Link>
        </CCol>

        <CCol xs={12} md={6} xl={4}>
             <Link to="/employees" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Employees"
            value={1234}
            icon={<FaUserFriends />}
            color="#10d876"
            change="+3.2%"
            description="Active team members"
            trend="up"
          />
          </Link>
        </CCol>

        <CCol xs={12} md={6} xl={4}>
             <Link to="/all-lead" className="text-decoration-none text-dark">
          <DashboardCard
            title="Total Leads"
            value={5678}
            icon={<FaChartLine />}
            color="#c17cff"
            change="+8.7%"
            description="Potential customers"
            trend="up"
          />
          </Link>
        </CCol>

        <CCol xs={12} md={6} xl={4}>
             <Link to="#" className="text-decoration-none text-dark">
          <DashboardCard
            title="Unapproved Proposals"
            value={156}
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
            value={876}
            icon={<FaUsers />}
            color="#00bcd4"
            change="+4.9%"
            description="Active clients"
            trend="up"
          />
          </Link>
        </CCol>
      </CRow>
    </div>
  )
}

export default AdminDashboard

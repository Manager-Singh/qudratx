import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Lazy imports
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const EmployeeLogin = React.lazy(() => import('./views/pages/login/EmployeeLogin'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
import AuthRoute from './routes/AuthRoute' // ✅ import auth protector
import { verifyUser } from './store/authSlice'
import { AppContent } from './components'
import EmployeesListing from './views/pages/employees/EmployeesListing'
import AddEmployee from './views/pages/employees/AddEmployee'
import AdminLogin from './views/pages/login/AdminLogin'
import BusinessZone from './views/pages/ProposalManagement/BusinessZoneListing'
import AddBusinessZone from './views/pages/ProposalManagement/AddBusinessZone'
import FeeStructure from './views/pages/FeeStructureManagement/FeeStructure'
import AddFeeStructure from  './views/pages/FeeStructureManagement/AddFeeStructure'
import BusinessCategory from './views/pages/ProposalManagement/BusinessCategory'
import ClientListing from './views/pages/LeadManagement/clients/ClientListing'
import AddClient from './views/pages/LeadManagement/clients/AddClient'
import AllLead from './views/pages/LeadManagement/All Leads/AllLead'
import ViewLead from './views/pages/LeadManagement/All Leads/ViewLead'
import AddLead from './views/pages/LeadManagement/All Leads/AddLead'
import PackageListing from './views/pages/ProposalManagement/package/PackageListing'
import AddPackage from './views/pages/ProposalManagement/package/AddPackage'
import ViewPackageDetail from './views/pages/ProposalManagement/package/ViewPackageDetail'
import BusinessAuthority from './views/pages/ProposalManagement/BusinessAuthority'
import AddBusinessCategory from './views/pages/ProposalManagement/AddBusinessCategory'
import BusinessActivity from './views/pages/ProposalManagement/businessActivity/BusinessActivity'
import AddBusinessActivity from './views/pages/ProposalManagement/businessActivity/AddBusinessActivity'
import Dashboard from './views/pages/EmployeePortal/Dashboard/Dashboard'
import BusinessSubCategory from './views/pages/ProposalManagement/subCategory/BusinessSubCategory'
import Proposal from './views/pages/EmployeePortal/Proposal/Proposal'
import EditBusinessActivity from './views/pages/ProposalManagement/businessActivity/EditBusinessActivity'
import EmployeeBusinessZone from './views/pages/EmployeePortal/EmployeeBusinessZone'
import Setting from './views/pages/settings/Setting'
import AllProposals from './views/pages/ProposalManagement/proposals/ProposalsListing'
import MyProposal from './views/pages/EmployeePortal/myProposal/MyProposal'
import ViewProposal from './views/pages/ProposalManagement/proposals/ViewProposal';
import HistoryLogs from './views/pages/history&logs/HistoryLogs'
import AdminDashboard from './views/pages/Dashboard/AdminDashboard'
import EditLead from './views/pages/LeadManagement/All Leads/EditLead'
import ProposalSummary from './views/pages/EmployeePortal/Proposal/steps/ProposalSummaryStep'
import NotFound from './views/pages/NotFoundPage/NotFoundPage'

export const routes = [
  // ✅ Admin-only
  { path: '/', exact: true, name: 'Admin Dashboard', element: AdminDashboard, role: 'admin' },
  { path: '/employees', name: 'Employees', element: EmployeesListing, role: 'admin' },
  { path: '/add-employees', name: 'Add Employee', element: AddEmployee, role: 'admin' },
  { path: '/edit-employee/:uuid', name: 'Edit Employee', element: AddEmployee, role: 'admin' },
  { path: '/business-zone', name: 'Business Zone', element: BusinessZone, role: 'admin' },
  { path: '/add-businesszone', name: 'Add Business Zone', element: AddBusinessZone, role: 'admin' },
  { path: '/edit-businesszone/:id', name: 'Edit Business Zone', element: AddBusinessZone, role: 'admin' },
  { path: '/business-authority/:uuid', name: 'Business Authority', element: BusinessAuthority, role: 'admin' },
  { path: '/fee-structure', name: 'Fee Structure', element: FeeStructure, role: 'admin' },
  { path: '/add-feestructure', name: 'Add Fee Structure', element: AddFeeStructure, role: 'admin' },
  { path: '/edit-feestructure/:id', name: 'Edit Fee Structure', element: AddFeeStructure, role: 'admin' },
  { path: '/business-category', name: 'Business Category', element: BusinessCategory, role: 'admin' },
  { path: '/add-business-category', name: 'Add Business Category', element: AddBusinessCategory, role: 'admin' },
  { path: '/edit-business-category/:uuid', name: 'Edit Business Category', element: AddBusinessCategory, role: 'admin' },
  { path: '/business-subcategory/:uuid', name: 'Business SubCategory', element: BusinessSubCategory, role: 'admin' },
  { path: '/business-activity/:uuid', name: 'Business Activity', element: BusinessActivity, role: 'admin' },
  { path: '/add-business-activity/:uuid', name: 'Add Business Activity', element: AddBusinessActivity, role: 'admin' },
  { path: '/edit-business-activity/:uuid', name: 'Edit Business Activity', element: EditBusinessActivity, role: 'admin' },
  { path: '/packages/:uuid', name: 'Packages', element: PackageListing, role: 'admin' },
  { path: '/add-package/:authority_uuid', name: 'Add Package', element: AddPackage, role: 'admin' },
  { path: '/edit-package/:uuid', name: 'Edit Package', element: AddPackage, role: 'admin' },
  { path: '/view-package/:uuid', name: 'View Package', element: ViewPackageDetail, role: 'admin' },
  { path: '/setting', name: 'Setting', element: Setting, role: 'admin' },
  { path: '/view-proposal/:uuid', name: 'Proposal Summary', element: ProposalSummary, role: 'admin' },
  { path: '/logs', name: 'Logs', element: HistoryLogs, role: 'admin' },
  { path: '/proposals', name: 'All Proposals', element: AllProposals, role: 'admin' },

  // ✅ Employee-only
  { path: '/dashboard', name: 'Employee Dashboard', element: Dashboard, role: 'employee' },
  { path: '/my-proposal', name: 'My Proposal', element: MyProposal, role: 'employee' },

  // ✅ Common (both admin & employee)
  { path: '/add-client', name: 'Add Client', element: AddClient, role: 'common' },
  { path: '/edit-client/:uuid', name: 'Edit Client', element: AddClient, role: 'common' },
  { path: '/clients', name: 'Clients', element: ClientListing, role: 'common' },
  { path: '/all-lead', name: 'All Lead', element: AllLead, role: 'common' },
  { path: '/view-lead/:uuid', name: 'View Lead', element: ViewLead, role: 'common' },
  { path: '/add-lead', name: 'Add Lead', element: AddLead, role: 'common' },
  { path: '/edit-lead/:uuid', name: 'Edit Lead', element: EditLead, role: 'common' },
  { path: '/create-lead/:uuid', name: 'Create Lead', element: AddLead, role: 'common' },
  { path: '/create-proposal', name: 'Create Proposal', element: Proposal, role: 'common' },
  { path: '/proposal/:uuid', name: 'Proposal', element: Proposal, role: 'common' },
  { path: '/business-zones', name: 'Employee Business Zone', element: EmployeeBusinessZone, role: 'common' },

  // ✅ Not Found
  { path: '*', name: 'Not Found', element: NotFound },
]

 
const App = () => {
  const { isLoading,user } = useSelector((state) => state.auth)
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
    const dispatch =  useDispatch()
  

  useEffect(() => {
   
    dispatch(verifyUser())
      .unwrap()
      .then((data) => {
        console.log(data, '✔️ User verified')
      })
      .catch((err) => {
        console.error(err.message, '❌ Verification failed')
      })
  }, [dispatch])


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, []) 

if (isLoading) {
  return <div>Loading...</div>
}


  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center ">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} /> */}
          <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          
          {/* Protected Routes */}
{/*       
          <Route
            path="/"
            element={
              <AuthRoute >
                <DefaultLayout />
              </AuthRoute>
            }
          > */}
       {/* <Route path="/employees" element={<EmployeesListing/>} />
       <Route path="/add-employees" element={<AddEmployee/>} />
       <Route path="/edit-employee/:uuid" element={<AddEmployee/>} />
       <Route path="/" element={<AdminDashboard/>}/>
       <Route path="/business-zone" element={<BusinessZone/>} />
       <Route path ="/add-businesszone" element={<AddBusinessZone/>}   />
       <Route path ="/edit-businesszone/:id" element={<AddBusinessZone/>} />
       <Route path ="/business-authority/:uuid" element={<BusinessAuthority/>} />
       <Route path="/fee-structure" element={<FeeStructure/>} />
       <Route path="/add-feestructure" element={<AddFeeStructure />} />
       <Route path="/edit-feestructure/:id" element={<AddFeeStructure />} />
       <Route path="/business-category" element={<BusinessCategory/>} />
       <Route path="/add-business-category" element={<AddBusinessCategory/>} />
       <Route path="/edit-business-category/:uuid" element={<AddBusinessCategory/>} />
       <Route path="/business-subcategory/:uuid" element={<BusinessSubCategory/>} />
      <Route path="/business-activity/:uuid" element={<BusinessActivity/>} />
       <Route path="/add-business-activity/:uuid" element={<AddBusinessActivity/>} />
       <Route path="/edit-business-activity/:uuid" element={<EditBusinessActivity/>} />
       <Route path="/clients" element={<ClientListing/>} /> */}
       {/* <Route path="/add-client" element={<AddClient/>} />
       <Route path="/edit-client/:uuid" element={<AddClient/>} />
       <Route path="/all-lead" element={<AllLead/>} />
       <Route path="/view-lead/:uuid" element={<ViewLead />} />
       <Route path="/add-lead" element={<AddLead />} />
       <Route path="/edit-lead/:uuid" element={<EditLead />} />
       <Route path="/create-lead/:uuid" element={<AddLead />} /> */}
       {/* <Route path="/packages/:uuid" element={<PackageListing/>} />
       <Route path="/add-package/:authority_uuid" element={<AddPackage/>} />
       <Route path="/edit-package/:uuid" element={<AddPackage/>} />
       <Route path="/view-package/:uuid" element={<ViewPackageDetail/>}/>
        <Route path='/setting' element={<Setting/>}/>
        <Route path='/view-proposal/:uuid' element={ <ProposalSummary/> }/>
        <Route path='/logs' element={<HistoryLogs/>}/> */}
       {/* Employee portal routes */}
      {/* <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/create-proposal" element={<Proposal />} />
      <Route path="/proposal/:uuid" element={<Proposal />} />
      <Route path="/business-zones" element={<EmployeeBusinessZone />} />
      <Route path='/proposals' element={<AllProposals/>}/>
      <Route path='/my-proposal' element={<MyProposal/>}/> */}
       {/* </Route> */}


<Route
  path="/"
  element={
    <AuthRoute allowedRoles={["admin"]}>
      <DefaultLayout />
    </AuthRoute>
  }
>
  {/* ✅ Admin-only routes */}
   <Route path="/employees" element={<EmployeesListing/>} />
       <Route path="/add-employees" element={<AddEmployee/>} />
       <Route path="/edit-employee/:uuid" element={<AddEmployee/>} />
       <Route path="/" element={<AdminDashboard/>}/>
       <Route path="/business-zone" element={<BusinessZone/>} />
       <Route path ="/add-businesszone" element={<AddBusinessZone/>}   />
       <Route path ="/edit-businesszone/:id" element={<AddBusinessZone/>} />
       <Route path ="/business-authority/:uuid" element={<BusinessAuthority/>} />
       <Route path="/fee-structure" element={<FeeStructure/>} />
       <Route path="/add-feestructure" element={<AddFeeStructure />} />
       <Route path="/edit-feestructure/:id" element={<AddFeeStructure />} />
       <Route path="/business-category" element={<BusinessCategory/>} />
       <Route path="/add-business-category" element={<AddBusinessCategory/>} />
       <Route path="/edit-business-category/:uuid" element={<AddBusinessCategory/>} />
       <Route path="/business-subcategory/:uuid" element={<BusinessSubCategory/>} />
      <Route path="/business-activity/:uuid" element={<BusinessActivity/>} />
       <Route path="/add-business-activity/:uuid" element={<AddBusinessActivity/>} />
       <Route path="/edit-business-activity/:uuid" element={<EditBusinessActivity/>} />
     
        <Route path="/packages/:uuid" element={<PackageListing/>} />
       <Route path="/add-package/:authority_uuid" element={<AddPackage/>} />
       <Route path="/edit-package/:uuid" element={<AddPackage/>} />
       <Route path="/view-package/:uuid" element={<ViewPackageDetail/>}/>
        <Route path='/setting' element={<Setting/>}/>
        <Route path='/view-proposal/:uuid' element={ <ProposalSummary/> }/>
        <Route path='/logs' element={<HistoryLogs/>}/>
        <Route path='/proposals' element={<AllProposals/>}/>
  {/* ... all other ADMIN pages ... */}
</Route>

<Route
  path="/"
  element={
    <AuthRoute allowedRoles={["employee"]}>
      <DefaultLayout />
    </AuthRoute>
  }
>
  {/* ✅ Employee-only routes */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/my-proposal" element={<MyProposal />} />
   
  {/* ... all other EMPLOYEE pages ... */}
</Route>

<Route
  path="/"
  element={
    <AuthRoute allowedRoles={["admin", "employee"]}>
      <DefaultLayout />
    </AuthRoute>
  }
>
  {/* ✅ Common routes (accessible by both admin + employee) */}
 <Route path="/add-client" element={<AddClient/>} />
       <Route path="/edit-client/:uuid" element={<AddClient/>} />
       <Route path="/all-lead" element={<AllLead/>} />
       <Route path="/view-lead/:uuid" element={<ViewLead />} />
       <Route path="/add-lead" element={<AddLead />} />
       <Route path="/edit-lead/:uuid" element={<EditLead />} />
       <Route path="/create-lead/:uuid" element={<AddLead />} />
        <Route path="/create-proposal" element={<Proposal />} />
      <Route path="/proposal/:uuid" element={<Proposal />} />
      <Route path="/business-zones" element={<EmployeeBusinessZone />} />
        <Route path="/clients" element={<ClientListing/>} />
</Route>



<Route path='*' element={<NotFound/>}/>


        </Routes>
      </Suspense>
   </BrowserRouter>
  )
}

export default App

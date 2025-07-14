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
import UpdateSetting from './views/pages/settings/UpdateSetting'


 
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
      
          <Route
            path="/"
            element={
              <AuthRoute >
                <DefaultLayout />
              </AuthRoute>
            }
          >
       <Route path="/employees" element={<EmployeesListing/>} />
       <Route path="/add-employees" element={<AddEmployee/>} />
       <Route path="/edit-employee/:uuid" element={<AddEmployee/>} />
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
       <Route path="/clients" element={<ClientListing/>} />
       <Route path="/add-client" element={<AddClient/>} />
       <Route path="/edit-client/:uuid" element={<AddClient/>} />
       <Route path="/all-lead" element={<AllLead/>} />
       <Route path="/view-lead/:uuid" element={<ViewLead />} />
       <Route path="/add-lead" element={<AddLead />} />
       <Route path="/packages/:uuid" element={<PackageListing/>} />
       <Route path="/add-package/:authority_uuid" element={<AddPackage/>} />
       <Route path="/edit-package/:uuid" element={<AddPackage/>} />
       <Route path="/view-package/:uuid" element={<ViewPackageDetail/>}/>
        <Route path='/setting' element={<Setting/>}/>
         <Route path='/setting/edit' element={<UpdateSetting/>}/>
       {/* Employee portal routes */}
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/create-proposal/:id" element={<Proposal/>}/>
       <Route path="/business-zones" element={<EmployeeBusinessZone/>} />
       </Route>
         
        </Routes>
      </Suspense>
   </BrowserRouter>
  )
}

export default App

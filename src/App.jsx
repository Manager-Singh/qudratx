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
import BusinessZone from './views/pages/businesszone/BusinessZone'
import AddBusinessZone from './views/pages/businesszone/AddBusinessZone'
 
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          </Route>
         
        </Routes>
      </Suspense>
   </BrowserRouter>
  )
}

export default App

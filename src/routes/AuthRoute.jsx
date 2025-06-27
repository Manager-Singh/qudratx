import React from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import { verifyUser } from '../store/authSlice'

const AuthRoute = ({ children }) => {
  const dispatch =  useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)

 
  if (!user) {
   dispatch(verifyUser())
    
  }
 
  if (isLoading) {
   return <div>Loading...</div>
  }

  // After loading, either allow access or redirect
  return user ? children : <Navigate to="/employee-login" replace />
}

export default AuthRoute

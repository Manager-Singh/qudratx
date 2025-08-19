// import React from 'react'
// import { Navigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { CSpinner } from '@coreui/react'
// import { verifyUser } from '../store/authSlice'

// const AuthRoute = ({ children }) => {
//   const dispatch =  useDispatch()
//   const { user, isLoading } = useSelector((state) => state.auth)

 
//   if (!user) {
//    dispatch(verifyUser())
    
//   }
 
//   if (isLoading) {
//    return <div>Loading...</div>
//   }

//   // After loading, either allow access or redirect
//   return user ? children : <Navigate to="/employee-login" replace />
// }

// export default AuthRoute

// routes/AuthRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { roleRedirects } from "./roleRedirects";

const AuthRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/employee-login" state={{ from: location }} replace />;
  }

  // if route is role-restricted
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // force them back to THEIR dashboard
    const redirectTo = roleRedirects[user?.role] || "/employee-login";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthRoute;


import React from 'react'
import {  AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Outlet } from 'react-router-dom'
const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 ">
        <AppHeader />
        <div className="body flex-grow-1">
          {/* <AppContent /> */}
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

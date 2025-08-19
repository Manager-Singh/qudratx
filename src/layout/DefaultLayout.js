import React, { useState } from 'react'
import {  AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Outlet } from 'react-router-dom'
const DefaultLayout = () => {
  const [openSideBar , setOpenSideBar]= useState(true)
  return (
    <div>
      <AppSidebar openSideBar={openSideBar}/>
      <div className="wrapper d-flex flex-column min-vh-100 ">
        <AppHeader setOpenSideBar={setOpenSideBar}/>
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

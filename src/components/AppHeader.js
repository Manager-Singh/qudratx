
// import React, { useEffect, useRef, useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   CContainer,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavLink,
//   CNavItem,
//   CBadge,
//   COffcanvas,
//   COffcanvasHeader,
//   COffcanvasTitle,
//   COffcanvasBody,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBell,
//   cilMenu,
// } from '@coreui/icons'
// import moment from 'moment'

// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'
// import { getNotifications } from '../store/admin/notificationSlice'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const dispatch = useDispatch()

//   const sidebarShow = useSelector((state) => state.sidebarShow)
//   const { user } = useSelector((state) => state.auth)
//   const { notifications } = useSelector((state) => state.notification)

//   const [showNotificationSidebar, setShowNotificationSidebar] = useState(false)

//   useEffect(() => {
//     dispatch(getNotifications())
//   }, [dispatch])

//   useEffect(() => {
//     const handleScroll = () => {
//       if (headerRef.current) {
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//       }
//     }

//     document.addEventListener('scroll', handleScroll)
//     return () => document.removeEventListener('scroll', handleScroll)
//   }, [])

//   // Count unread notifications
//   const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

//   return (
//     <>
//       <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//         <CContainer className="border-bottom px-4" fluid>
//           <CHeaderToggler
//             onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//             style={{ marginInlineStart: '-14px' }}
//           >
//             <CIcon icon={cilMenu} size="lg" />
//           </CHeaderToggler>

//           <CHeaderNav className="d-none d-md-flex">
//             <CNavItem>
//               {user.role === 'admin' ? (
//                 <CNavLink to="/" as={NavLink}>
//                   Dashboard
//                 </CNavLink>
//               ) : (
//                 <CNavLink to="/dashboard" as={NavLink}>
//                   Dashboard
//                 </CNavLink>
//               )}
//             </CNavItem>

//             <CNavItem>
//               <CNavLink to="/setting" as={NavLink}>
//                 Settings
//               </CNavLink>
//             </CNavItem>
//           </CHeaderNav>

//           <CHeaderNav className="ms-auto">
//             <CNavItem>
//                 <CNavLink
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     setShowNotificationSidebar(true)
//                   }}
//                   style={{ position: 'relative' }}
//                 >
//                   <CIcon icon={cilBell} size="lg" />
//                   {unreadCount > 0 && (
//                     <CBadge
//                       color="danger"
//                       shape="rounded-pill"
//                       style={{
//                         fontSize: '0.6rem',
//                         position: 'absolute',
//                         top: '-2px',
//                         right: '-3px',
//                       }}
//                     >
//                       {unreadCount}
//                     </CBadge>
//                   )}
//                 </CNavLink>
//               </CNavItem>
//           </CHeaderNav>

//           <CHeaderNav>
//             <li className="nav-item py-1">
//               <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
//             </li>
//             <AppHeaderDropdown />
//           </CHeaderNav>
//         </CContainer>

//         <CContainer className="px-4" fluid>
//           <AppBreadcrumb />
//         </CContainer>
//       </CHeader>

//       {/* Notification Sidebar */}
//       <COffcanvas
//         placement="end"
//         visible={showNotificationSidebar}
//         onHide={() => setShowNotificationSidebar(false)}
//       >
//         <COffcanvasHeader>
//           <COffcanvasTitle>Notifications</COffcanvasTitle>
//           <button
//             type="button"
//             className="btn-close text-reset"
//             onClick={() => setShowNotificationSidebar(false)}
//           ></button>
//         </COffcanvasHeader>
//         <COffcanvasBody>
//           {notifications && notifications.length > 0 ? (
//             notifications.map((notification) => (
//               <div key={notification.id} className="mb-3">
//                 <strong>{notification.message}</strong>
//                 <h2>{notification.type}</h2>
//                 <div className="text-muted small">
//                   {moment(notification.created_at).fromNow()}
//                 </div>
//                 <hr />
//               </div>
//             ))
//           ) : (
//             <div className="text-muted text-center mt-4">No notifications found</div>
//           )}
//         </COffcanvasBody>
//       </COffcanvas>
//     </>
//   )
// }

// export default AppHeader
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CBadge,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu } from '@coreui/icons'
import moment from 'moment'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { getNotifications } from '../store/admin/notificationSlice'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()

  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user } = useSelector((state) => state.auth)
  const { notifications } = useSelector((state) => state.notification)

  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false)

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch])

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  const getNotificationLink = (type) => {
    if (user?.role === 'employee') {
      if (type === 'proposal') return '/my-proposal'
      if (type === 'Lead') return '/all-lead'
    } else if (user?.role === 'admin') {
      if (type === 'proposal') return '/proposals'
      if (type === 'Lead') return '/all-lead'
    }
    return '#'
  }

  return (
    <>
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <CHeaderNav className="d-none d-md-flex">
            <CNavItem>
              <CNavLink to={user?.role === 'admin' ? '/' : '/dashboard'} as={NavLink}>
                Dashboard
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink to="/setting" as={NavLink}>
                Settings
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <CHeaderNav className="ms-auto">
            <CNavItem>
              <CNavLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setShowNotificationSidebar(true)
                }}
                style={{ position: 'relative' }}
              >
                <CIcon icon={cilBell} size="lg" />
                {unreadCount > 0 && (
                  <CBadge
                    color="danger"
                    shape="rounded-pill"
                    style={{
                      fontSize: '0.6rem',
                      position: 'absolute',
                      top: '-2px',
                      right: '-3px',
                    }}
                  >
                    {unreadCount}
                  </CBadge>
                )}
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>

        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>

      {/* Notification Sidebar */}
      <COffcanvas
        placement="end"
        visible={showNotificationSidebar}
        onHide={() => setShowNotificationSidebar(false)}
      >
        <COffcanvasHeader>
          <COffcanvasTitle>Notifications</COffcanvasTitle>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={() => setShowNotificationSidebar(false)}
          ></button>
        </COffcanvasHeader>
        <COffcanvasBody>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                to={getNotificationLink(notification.type)}
                onClick={() => setShowNotificationSidebar(false)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="mb-3 cursor-pointer">
                  <strong>{notification.message}</strong>
                  <h6 className="mb-1">{notification.type}</h6>
                  <div className="text-muted small">
                    {moment(notification.created_at).fromNow()}
                  </div>
                  <hr />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-muted text-center mt-4">No notifications found</div>
          )}
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
}

export default AppHeader

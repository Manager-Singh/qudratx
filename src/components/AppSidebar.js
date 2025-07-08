import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from 'src/assets/brand/logo.png'
import { Link } from 'react-router-dom'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
// Import icons for titles
import {
  cilPeople,
  cilDescription,
  cilGroup,
} from '@coreui/icons'

// Import your zone action
import { getBusinessZone } from '../store/admin/businessZoneSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const user = useSelector((state) => state.auth.user)
  const { businesszones } = useSelector((state) => state.businesszone)

  useEffect(() => {
    dispatch(getBusinessZone())
  }, [dispatch])

  if (!user) return null

  // Generate dynamic zone links
  const zoneNavItems = useMemo(() => {
    return (businesszones || []).map((zone) => ({
      component: CNavItem,
      name: zone.name,
      to: `/business-authority/${zone.uuid}`,
      showhyphen: true, // for hyphen indent
    }))
  }, [businesszones])

  const adminNav = [
    {
      component: CNavTitle,
      name: 'Employee management',
      icon: <CIcon icon={cilPeople} size="xl" className="text-primary" />,
    },
    {
      component: CNavItem,
      name: 'Employees',
      to: '/employees',
    },
    {
      component: CNavTitle,
      name: 'Proposal management',
      icon: <CIcon icon={cilDescription} size="xl" className="text-primary" />,
    },
    ...zoneNavItems,
    {
      component: CNavItem,
      name: 'Business Categories',
      to: '/business-category',
    },
    {
      component: CNavItem,
      name: 'Packages',
      to: '/packages',
    },
    {
      component: CNavItem,
      name: 'Fee Structure',
      to: '/fee-structure',
    },
    {
      component: CNavTitle,
      name: 'Leads Management',
      icon: <CIcon icon={cilGroup} size="xl" className="text-primary" />,
    },
    {
      component: CNavItem,
      name: 'Clients',
      to: '/clients',
    },
    {
      component: CNavItem,
      name: 'All Leads',
      to: '/all-lead',
    },
  ]

  const employeeNav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
    },
     {
        component: CNavItem,
        name: 'Free Zone',
        to: '#',
      },
      {
        component: CNavItem,
        name: 'Mainland',
        to: '#',
      },
    // add more employee-specific items here
  ]

  const navigation = user.role === 'admin' ? adminNav : user.role === 'employee' ? employeeNav : []

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="d-flex justify-content-center align-items-center" as={Link} to="/">
          <img src={logo} alt="Logo" style={{ width: '92%' }} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

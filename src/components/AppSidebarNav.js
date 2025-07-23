import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                 <span className="nav-icon-bullet">-</span> {/* Insert hyphen here */}
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

 const navItem = (item, index, indent = false) => {
  const { component, name, badge, icon, showhyphen, state, ...rest } = item
  const Component = component
  return (
    <Component as="div" key={index}>
      {rest.to || rest.href ? (
        <CNavLink
          as={NavLink}
          to={rest.to}
          state={state}
          target={rest.href ? '_blank' : undefined}
          rel={rest.href ? 'noopener noreferrer' : undefined}
          className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          {navLink(name, icon, badge, showhyphen)}
        </CNavLink>
      ) : (
        navLink(name, icon, badge, showhyphen)
      )}
    </Component>
  )
}

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

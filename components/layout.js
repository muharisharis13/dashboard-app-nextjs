import React from 'react'
import Menu from './menu'
import Header from './header'

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Menu />
        <div className="layout-page">
          <Header />
          <div className="content-wrapper">
            {children}

          </div>

        </div>
      </div>
    </div>
  )
}

export default Layout
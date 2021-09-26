import React, { FC } from 'react'
import Navbar from '../Navbar/index';

const Layout: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout;

import React, { ReactElement, ReactNode } from 'react';

import Navbar from '../../components/Navbar';

import s from './Layout.module.css';

export interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props): ReactElement => {
  return (
    <div className={s.root}>
      <Navbar />
      <div>
        
      </div>
      {children}
    </div>
  )
}

export default Layout;

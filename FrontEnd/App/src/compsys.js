import React from 'react';
import Sidenavi from './components/sidenavi';
import { Outlet } from 'react-router';

const Compsys = () => {
  return (
    <>
      <Sidenavi/>
      <Outlet />
    </>
  );
}

export default Compsys;

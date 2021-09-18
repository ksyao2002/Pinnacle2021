import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements.js';
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
  
        <NavMenu>
          <NavLink to='/record' activeStyle>
            Record
          </NavLink>
          <NavLink to='/view' activeStyle>
            View Results
          </NavLink>
          
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;
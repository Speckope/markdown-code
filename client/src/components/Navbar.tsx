import React from 'react';
import Login from './Login';
import './Navbar.css';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <div className='navbar'>
      <Login />
    </div>
  );
};

export default Navbar;

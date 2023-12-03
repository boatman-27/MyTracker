import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/ao-logo6.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" style={{ maxWidth: '20%', height: 'auto' }} />
      </div>
      <ul className="navList">
        <li className="navItem">
          <NavLink to='/' className="button">
            Home
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink to='/Jobs' className="button">
            Jobs
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink to='/Todo' className="button">
            Todo
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink to='/Expenses' className="button">
            Expenses
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

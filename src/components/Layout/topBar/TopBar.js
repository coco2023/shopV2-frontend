import React from 'react';
import { NavLink } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="topbar">
      <NavLink to="/brand" activeClassName="active">Brand</NavLink>
      <NavLink to="/category" activeClassName="active">Category</NavLink>
      <NavLink to="/supplier" activeClassName="active">Supplier</NavLink>
      {/* Add more links as needed */}
    </div>
  );
};

export default TopBar;

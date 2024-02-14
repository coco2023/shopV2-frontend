import React from 'react';
import { NavLink } from 'react-router-dom';

const CustomerSideBar = () => {
  return (
    <div className="sidebar">
            <NavLink to="/customer/info" activeClassName="active">Info</NavLink>
      <NavLink to="/customer/main" activeClassName="active">Orders</NavLink>
</div>
  );
};

export default CustomerSideBar;

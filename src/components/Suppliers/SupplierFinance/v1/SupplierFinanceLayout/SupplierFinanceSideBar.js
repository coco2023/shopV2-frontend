import React from 'react';
import { NavLink } from 'react-router-dom';
import "./SupplierFinanceLayout.css"

const SupplierFinanceSideBar = () => {
    return (
      <div className="topbar">
          <NavLink to="/supplier-ims/finance/3/monthly" className={({ isActive }) => isActive ? 'active' : ''}>Monthly</NavLink>
          <NavLink to="/supplier-ims/finance/3/yearly" className={({ isActive }) => isActive ? 'active' : ''}>Yearly</NavLink>
          </div>
    );
  };
  
export default SupplierFinanceSideBar;

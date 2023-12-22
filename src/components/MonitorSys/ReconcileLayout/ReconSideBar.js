import React from 'react';
import { NavLink } from 'react-router-dom';
import "./ReconLayout.css"

const ReconSideBar = () => {
    return (
      <div className="topbar">
          <NavLink to="/reconcile" className={({ isActive }) => isActive ? 'active' : ''}>Reconcile</NavLink>
          <NavLink to="/reconcile/salesOrderSn" className={({ isActive }) => isActive ? 'active' : ''}>Reconcile by Order</NavLink>
          <NavLink to="/reconcile/pastdays" className={({ isActive }) => isActive ? 'active' : ''}>Reconcile Past Days</NavLink>
          <NavLink to="/reconcile/between" className={({ isActive }) => isActive ? 'active' : ''}>Reconcile Between Days</NavLink>          
          <NavLink to="/reconcile/monthly-sales-report" className={({ isActive }) => isActive ? 'active' : ''}>Monthly Sales Report</NavLink>
          </div>
    );
  };
  
export default ReconSideBar;

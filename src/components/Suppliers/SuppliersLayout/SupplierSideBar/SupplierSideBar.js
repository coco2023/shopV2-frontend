import React from 'react';
import { NavLink } from 'react-router-dom';

const SupplierSideBar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/supplier-ims/3" activeClassName="active">Authorize</NavLink>
      <NavLink to="/supplier-ims/products/3" activeClassName="active">Product</NavLink>
      <NavLink to="/supplier-ims/orders/3" activeClassName="active">SalesOrder</NavLink>
      <NavLink to="/supplier-ims/payments/3" activeClassName="active">Payment</NavLink>
      <NavLink to="/supplier-ims/finance/3/monthly" activeClassName="active">Financial Reports</NavLink>
</div>
  );
};

export default SupplierSideBar;

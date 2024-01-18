import React from 'react';
import { NavLink } from 'react-router-dom';

const SupplierSideBar2 = () => {
  return (
    <div className="sidebar">
      <NavLink to="/supplier-ims" activeClassName="active">Authorize</NavLink>
      <NavLink to="/supplier-ims/products" activeClassName="active">Product</NavLink>
      <NavLink to="/supplier-ims/orders" activeClassName="active">SalesOrder</NavLink>
      <NavLink to="/supplier-ims/payments" activeClassName="active">Payment</NavLink>
      {/* <NavLink to="/supplier-ims/finance/3/monthly" activeClassName="active">Financial Reports</NavLink> */}
      <NavLink to="/supplier-ims/finance/3" activeClassName="active">Financial Reports账务明细</NavLink>
</div>
  );
};

export default SupplierSideBar2;

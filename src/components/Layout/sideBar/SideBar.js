import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/brand" activeClassName="active">Brand</NavLink>
      <NavLink to="/category" activeClassName="active">Category</NavLink>
      <NavLink to="/supplier" activeClassName="active">Supplier</NavLink>
      <NavLink to="/products" activeClassName="active">Product</NavLink>
      <NavLink to="/productAttribute" activeClassName="active">Product Attribute</NavLink>
      <NavLink to="/salesOrders" activeClassName="active">Order</NavLink>
      <NavLink to="/salesOrderDetail" activeClassName="active">Order Details</NavLink>
      <NavLink to="/payments" activeClassName="active">Payment</NavLink>
      <NavLink to="/invoices" activeClassName="active">Invoice</NavLink>

</div>
  );
};

export default SideBar;

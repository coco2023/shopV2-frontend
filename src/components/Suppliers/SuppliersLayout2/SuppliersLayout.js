// Layout.js
import React from "react";
import SupplierSideBar2 from "./SupplierSideBar/SupplierSideBar";

const SuppliersLayout2 = ({ children }) => {
  return (
    <div className="app-container">
      <SupplierSideBar2 />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SuppliersLayout2;

// Layout.js
import React from "react";
import SupplierSideBar from "./SupplierSideBar/SupplierSideBar";

const SuppliersLayout = ({ children }) => {
  return (
    <div className="app-container">
      <SupplierSideBar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SuppliersLayout;

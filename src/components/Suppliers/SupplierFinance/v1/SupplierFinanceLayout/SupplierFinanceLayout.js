import React from "react";
import SupplierFinanceSideBar from "./SupplierFinanceSideBar";
import "./SupplierFinanceLayout.css"

const SupplierFinanceLayout = ({ children }) => {
  return (
    <div className="recon-app-container">
      <SupplierFinanceSideBar />
      <div className="recon-main-content">
        {/* <TopBar /> */}
        {children}
      </div>
    </div>
  );
};

export default SupplierFinanceLayout;

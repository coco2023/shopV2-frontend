// Layout.js
import React from "react";
import CustomerSideBar from "./CustomerSideBar/CustomerSideBar";

const CustomerLayout = ({ children }) => {
  return (
    <div className="app-container">
      <CustomerSideBar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default CustomerLayout;

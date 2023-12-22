import React from "react";
import ReconSideBar from "./ReconSideBar";
import "./ReconLayout.css"

const ReconLayout = ({ children }) => {
  return (
    <div className="recon-app-container">
      <ReconSideBar />
      <div className="recon-main-content">
        {/* <TopBar /> */}
        {children}
      </div>
    </div>
  );
};

export default ReconLayout;

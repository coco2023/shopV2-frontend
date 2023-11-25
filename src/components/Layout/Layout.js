// Layout.js
import React from "react";
import SideBar from "./sideBar/SideBar";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <SideBar />
      <div className="main-content">
        {/* <TopBar /> */}
        {children}
      </div>
    </div>
  );
};

export default Layout;

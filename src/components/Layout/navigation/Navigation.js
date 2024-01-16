import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css"; // Assuming you have a separate CSS file for navigation

const Navigation = () => {
  const couponMessage =
    "🎉 Free Shipping on orders over $50 - Use code: FREESHIP 🎉";

  const searchingIcon = "/assets/img/svg/searching.svg";

  const navigate = useNavigate();
  const redirectToIndex = () => {
    navigate("/index");
  };

  return (
    <div className="top-bar">
      <div className="coupon-message" data-content={couponMessage}>
        <p>{couponMessage}</p>
      </div>

      <div className="nav-container">
        <div className="nav-logo" onClick={redirectToIndex}>
          UmiUni
        </div>

        {/* <div className="nav-search">
          <input className="search-input" type="text" placeholder="Search..." />
          <button className="search-button">🔍</button>
          <img className="search-button" src={searchingIcon} alt="Previous" /> 
        </div> */}

        <div className="nav-menu">
          <Link className="nav-link" to="/reconcile">
            ⚖️ Reconcile
          </Link>
          <Link className="nav-link" to="/supplierLogin">
            🔒 Login
          </Link>
          <Link className="nav-link" to="/register">
            🔒 Register
          </Link>
          <Link className="nav-link" to="/supplier-ims/3">
            🏠 Supplier Auth
          </Link>
          <Link className="nav-link" to="/brand">
            🏠 ERP
          </Link>
          <Link className="nav-link" to="/error-logs">
            ❌ Payment Error Log
          </Link>
          {/* <Link className="nav-link" to="/cancel">
            ❌ Cancel
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Navigation;

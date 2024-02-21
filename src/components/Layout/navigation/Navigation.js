import React, { useState, useEffect, useRef } from "react";
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // 创建一个ref来引用dropdown的DOM元素
  // 切换下拉菜单的显示状态
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // 点击页面其他部分时关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // 绑定事件监听器
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 移除事件监听器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="top-bar">
      <div className="coupon-message" data-content={couponMessage}>
        <p>{couponMessage}</p>
      </div>

      <div className="nav-container">
        <div className="nav-logo" onClick={redirectToIndex}>
          UmiUni
        </div>

        <div className="github-project">
          <img src="/assets/img/PaymentCheckout/github-mark.svg" alt="GitHub" class="github-logo" />
          <a href="https://github.com/coco2023/shopV2-backend" target="_blank" rel="noopener noreferrer">
            [backend]
          </a>
          | 
          <a href="https://github.com/coco2023/shopV2-frontend" target="_blank" rel="noopener noreferrer">
              [frontend]
          </a>
          |
          <a href="https://www.yuque.com/u1090931/atruez/ld1t8k67bie5lqro?singleDoc=" target="_blank" rel="noopener noreferrer">
              [DOC文档]
          </a>
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
          <Link className="nav-link" to="/supplier-ims/finance/3">
            💰 Finance
          </Link>

          {/* Drop button to show user selections */}
          <div className="nav-item">
            <span className="dropbtn" onClick={toggleDropdown}>🏠 Supplier</span>
            {isDropdownOpen && (
              <div className="dropdown-content" ref={dropdownRef}>
                <div className="user-info">
                  <img className="avatar" src="path_to_avatar_image" alt="User Avatar" />
                  <span className="username">hankeyu***_hky</span>
                </div>
                <div className="notification">
                  <p>UmiUni does not ask customers for additional fees via SMS or email.</p>
                  <button className="view-button">View</button>
                </div>
                <Link className="dropdown-link" to="/supplierLogin">
                  🔒 Login
                </Link>
                <Link className="dropdown-link" to="/register">
                  🔒 Register
                </Link>
                <Link className="dropdown-link" to="/supplier/profile">
                  🏠 Dashboard
                </Link>
                <Link className="dropdown-link" to="/supplier-ims/finance/3">
                  💰 Finance
                </Link>
                <Link className="dropdown-link" to="/reconcile">
                  ⚖️ Reconcile
                </Link>
                <Link className="dropdown-link" to="/supplier-ims/orders">
                  📦 Orders
                </Link>
                <Link className="dropdown-link" to="/supplier-ims/products">
                  🛍️ Products
                </Link>
                <Link className="dropdown-link" to="/supplier-ims/payments">
                  💳 Payments
                </Link>

              </div>
            )}
          </div>

          <Link className="nav-link" to="/customer/info">
            🏠 Customer
          </Link>

          <Link className="nav-link" to="/products">
            🏠 ERP
          </Link>
          <Link className="nav-link" to="/Register">
            🔒 Register
          </Link>
          <Link className="nav-link" to="/error-logs">
            ❌ Payment Error Log
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Navigation;

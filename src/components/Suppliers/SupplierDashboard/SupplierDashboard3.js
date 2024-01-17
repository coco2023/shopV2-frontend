import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SupplierDashboard.css";

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const token = localStorage.getItem("token");
  console.log("***token: " + token);
  const [paypalToken, setPaypalToken] = useState(null);

  const pageurl = "/assets/img/umiuni/logo/logo300x83.png";

  useEffect(() => {
    const fetchSupplierData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      // // Attention: here will get the network error if use token
      console.log("this is the token: " + token);
      try {
        const response = await axios.get(
          // `${process.env.REACT_APP_API_URL}/api/v1/suppliers/${supplierId}`,
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/auth/info`,
          {
            headers: {
              Authorization:
                `Bearer ` +
                (localStorage.getItem("token") || queryParams.get("token")), // `Bearer ${token}`, //`Bearer ` + queryParams.get("token"), // token Attention: here will get the network error if use token
            },
          }
        );
        setSupplierData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [supplierId]);

  // Retrieve and store the PayPal token when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paypalToken = queryParams.get("token");
    if (paypalToken) {
      setPaypalToken(paypalToken);
      localStorage.setItem("token", paypalToken);
    }
  }, []);

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="supplier-dashboard">
      <header className="dashboard-header">
        <h1>Supplier Dashboard</h1>
        {supplierData && (
          <div className="welcome-message">
            <p>Welcome, {supplierData.supplierName}!</p>
          </div>
        )}
      </header>

      <div className="balance-info">
        <span>账户余额(余额)</span>
        <h1>¥ 0.00</h1>
        {/* // Add any buttons or links that are necessary */}
      </div>
      <div className="action-panel">
        {/* // Add any specific actions or display elements here */}
      </div>
      <div className="temu-area">
        <div className="temu-logo">
          <img src={pageurl} alt="Logo" />
        </div>
        <button className="temu-button">进入</button>
      </div>
    </div>
  );
};

export default SupplierDashboard;

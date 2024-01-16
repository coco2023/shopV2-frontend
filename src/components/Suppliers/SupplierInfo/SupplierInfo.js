import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SupplierInfo.css";

const SupplierInfoPage = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { supplierId } = useParams();
  // Assuming the URL is http://localhost:3000/supplier-ims?token=jwtTokenHere
  const queryParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("token");
  console.log("token here: " + token)
  if (!token) {
    throw new Error("No token provided.");
  }
  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");
  const [showUpdateConfigModel, setShowUpdateConfigModel] = useState(false);

  useEffect(() => {
    console.log("id: " + supplierId, "token: " + token)
    const fetchSupplierInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/${supplierId}`,
          {
            headers: {
              Authorization: `${token}`, // Add the JWT token in the Authorization header
            },
          }
        );
        setSupplier(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSupplierInfo();
  }, [supplierId]);

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/authorize/${supplierId}`;
  };

  const handleShowUpdateConfigModel = () => {
    setShowUpdateConfigModel(true);
  };

  const handleCloseShowUpdateConfigModel = () => {
    setShowUpdateConfigModel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/suppliers/configure-paypal/${supplierId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Add the JWT token in the Authorization header
          },
          paypalClientId: clientId,
          paypalClientSecret: clientSecret,
        }
      );

      setMessage(response.data);
      handleCloseShowUpdateConfigModel();
    } catch (error) {
      setMessage("Error updating PayPal configuration");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="supplier-info">
      <h2>Supplier Information</h2>
      {supplier && (
        <div>
          <p>
            <strong>ID:</strong> {supplier.supplierId}
          </p>
          <p>
            <strong>Name:</strong> {supplier.supplierName}
          </p>
          <p>
            <strong>PayPal Name:</strong> {supplier.paypalName}
          </p>
          <p>
            <strong>PayPal Email:</strong> {supplier.paypalEmail}
          </p>
          <p>
            <strong>Contact Info:</strong> {supplier.contactInfo}
          </p>
        </div>
      )}

      <button
        className="update-config-btn"
        onClick={handleShowUpdateConfigModel}
      >
        Update PayPal Configuration
      </button>

      {showUpdateConfigModel && (
        <div className="create-brand-modal">
          {/* <PaypalConfigForm supplierId={supplierId} /> */}
          <h2>Update PayPal Configuration</h2>
          <label>
            PayPal Client ID:
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </label>
          <br />
          <label>
            PayPal Client Secret:
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleSubmit}>Update</button>
          {message && <p>{message}</p>}
          <button onClick={handleCloseShowUpdateConfigModel}>Cancel</button>
        </div>
      )}

      <h2>Please Connect with your paypal account</h2>
      <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
        <img src={paypalLogo} alt="PayPal Logo" /> Log in with PayPal
      </button>
    </div>
  );
};

export default SupplierInfoPage;

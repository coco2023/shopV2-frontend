import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./SupplierInfo.css";

const SupplierInfoPage = () => {
  const [supplier, setSupplier] = useState(null);
  const [paypalInfo, setPaypalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");
  const [showUpdateConfigModel, setShowUpdateConfigModel] = useState(false);

  useEffect(() => {
    const fetchSupplierInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/${supplierId}`
        );
        setSupplier(response.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSupplierInfo();

    const checkAcessTokenExit = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/paypal-info/accessTokenExit/${supplierId}`
        );
        console.log("accessToken: " + response.data);
        setLoading(false);
        return response.data; // tokenExit;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // should use .then for the sync aims
    checkAcessTokenExit()
      .then((accessTokenExists) => {
        console.log("Access Token Exists:", accessTokenExists); // The resolved value of the Promise
        if (accessTokenExists) {
          fetchPayPalInfo();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [supplierId]);

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/authorize/${supplierId}`;
  };

  const fetchPayPalInfo = async () => {
    try {
      const paypalResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/paypal-info/${supplierId}`
      );
      setPaypalInfo(paypalResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // create showUpdateConfigModel
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

      <h2>Your PayPal Login Account Information</h2>
      {paypalInfo ? (
        <div>
          <p>
            <strong>Email:</strong> {paypalInfo.email}
          </p>
          <p>
            <strong>Name:</strong> {paypalInfo.name}
          </p>
        </div>
      ) : (
        <p>
          Please Login! Click above to log in with PayPal and view information
        </p>
      )}

      <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
        <img src={paypalLogo} alt="PayPal Logo" /> Log in with PayPal
      </button>
    </div>
  );
};

export default SupplierInfoPage;

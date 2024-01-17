import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const token = localStorage.getItem("token");
  console.log("***token: " + token);
  const [paypalToken, setPaypalToken] = useState(null);

  useEffect(() => {
    
    const fetchSupplierData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      // // Attention: here will get the network error if use token
      console.log("this is the token: " + token)
      try {
        const response = await axios.get(
          // `${process.env.REACT_APP_API_URL}/api/v1/suppliers/${supplierId}`,
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/auth/info`,
          {
            headers: {
              Authorization: localStorage.getItem("token") || `Bearer ${queryParams.get("token")}`, // `Bearer ${token}`, //`Bearer ` + queryParams.get("token"), // token Attention: here will get the network error if use token
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
    const paypalToken = `Bearer ` + queryParams.get("token");
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
    <div>
      <h1>Supplier Dashboard</h1>
      {supplierData && (
        <div>
          <p>Welcome, {supplierData.supplierName}!</p>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;

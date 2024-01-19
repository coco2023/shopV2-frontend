import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * still not work with cookie
 */
// Function to get the value of a cookie by name
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();

  // Get the value of the "authToken" cookie
  const authToken = getCookie("authToken");
  console.log("authToken: " + authToken)

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/auth/info`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true, // Include credentials (cookies)
          }
        );
        console.log("response.data: " + response.data)
        setSupplierData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      // Fetch supplier data only if the "authToken" cookie exists
      fetchSupplierData();
    } else {
      // Handle the case where the "authToken" cookie is not found
      setLoading(false);
    }
  }, [supplierId, authToken]);


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

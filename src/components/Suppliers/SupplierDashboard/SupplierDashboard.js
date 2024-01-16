import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        // Note: Authorization header is no longer needed as the JWT is in the HTTP-only cookie
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/${supplierId}`,
          {
            withCredentials: true, // Ensures cookies are sent with the request
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

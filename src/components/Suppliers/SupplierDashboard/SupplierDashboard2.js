import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierDashboard2 = ({ token }) => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/profile`, // Update with the correct endpoint for fetching supplier data
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSupplierData(response.data);
      } catch (err) {
        setError('Could not fetch supplier data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSupplierData();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Supplier Dashboard</h1>
      {supplierData ? (
        <div>
          <p>Welcome, {supplierData.name}!</p>
          {/* Display more supplier data as needed */}
        </div>
      ) : (
        <p>No supplier data available.</p>
      )}
      {/* Additional dashboard features go here */}
    </div>
  );
};

export default SupplierDashboard2;

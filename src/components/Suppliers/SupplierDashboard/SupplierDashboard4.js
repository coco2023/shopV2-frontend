import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import "./SupplierDashboard.css";

const SupplierDashboard4 = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const navigation = useNavigate();
  const pageurl = "/assets/img/umiuni/logo/logo300x83.png";

  useEffect(() => {
    const fetchSupplierData = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const token = localStorage.getItem("token") || queryParams.get("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/auth/info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSupplierData(response.data);
      } catch (err) {
        setError(err.message + ", Please Login First!");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);

  // WebSocket connection and subscription
  useEffect(() => {
//     const socket = new SockJS('http://localhost:9001/ws'); // Update '/ws' to match your WebSocket endpoint
    const token = localStorage.getItem("token"); // || queryParams.get("token");
    console.log("token: " + token);
    const socket = new SockJS(`http://localhost:9001/ws?token=Bearer ${token}`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      // Subscribe to the supplier-specific notification queue
      stompClient.subscribe('/user/queue/inventoryReduction', (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []); // Dependency array is empty to ensure this effect runs only once on mount

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="supplier-dashboard">
      {/* Dashboard UI elements */}

      {/* Notifications Section */}
      <div className="notifications">
        <h3>Inventory Reduction Notifications</h3>
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            <p>SKU: {notification.skuCode}, Quantity Reduced: {notification.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard4;

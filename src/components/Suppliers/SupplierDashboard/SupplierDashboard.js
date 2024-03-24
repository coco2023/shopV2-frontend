import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SupplierDashboard.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const [paypalToken, setPaypalToken] = useState(null);
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [historyNotifications, setHistoryNotifications] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);

  // Additional state for WebSocket connection
  const [client, setClient] = useState(null);

  const navigation = useNavigate(); // Initialize useHistory hook

  const pageurl = "/assets/img/umiuni/logo/logo300x83.png";

  useEffect(() => {
    const fetchSupplierData = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const token = localStorage.getItem("token") || queryParams.get("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/suppliers/auth/info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSupplierData(response.data);
        // Fetch pending messages right after setting supplier data
        if (response.data && response.data.id) {
          fetchPendingMessages(response.data.id);
        }
      } catch (err) {
        setError(err.message + ", Please Login First!");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, []);

  async function fetchPendingMessages(supplierId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/notification/${supplierId}/pending-messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const messages = await response.json();
      setHistoryNotifications(Array.isArray(messages) ? messages : []);
    } catch (error) {
      console.error("Error fetching pending messages:", error);
    }
  }

  // Retrieve and store the PayPal token when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paypalToken = queryParams.get("token");
    if (paypalToken) {
      setPaypalToken(paypalToken);
      localStorage.setItem("token", paypalToken);
    }
  }, []);

  // WebSocket connection and subscription
  useEffect(() => {
    const token = localStorage.getItem("token"); // || queryParams.get("token");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=Bearer ${token}`
    );
    const stompClient = Stomp.over(socket);

    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      console.log("WebSocket connection established");

      // Subscribe to the supplier-specific notification queue
      stompClient.subscribe("/user/queue/inventoryReduction", (message) => {
        console.log("Received message:", message);
        const notification = JSON.parse(message.body);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      });
    });

    stompClient.onDisconnect = () => {
      console.log("WebSocket disconnected");
    };

    stompClient.onError = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      console.log("stompClient: " + stompClient);
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []); // Dependency array is empty to ensure this effect runs only once on mount

  const redirectToIMS = () => {
    navigation("/supplier-ims");
  };

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
        <span>账户余额(余额) | Account Balance (Balance)</span>
        <h1>¥ 1000.00</h1>
        {/* // Add any buttons or links that are necessary */}
      </div>

      <div className="action-panel">
        <div className="notifications">
          <h3>Inventory Reduction Notifications | 实时消息</h3>
          <div className="notification-list">
            {notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <p>SKU: {notification.skuCode}</p>
                <p>Quantity Reduced: {notification.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="notifications">
          <h3>Incoming Notifications | 未读消息</h3>
          <div className="notification-list">
            {Array.isArray(historyNotifications) &&
              historyNotifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <p>SKU: {notification.skuCode}</p>
                  <p>Quantity Reduced: {notification.quantity}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="temu-area">
        <div className="temu-logo">
          <img src={pageurl} alt="Logo" />
        </div>
        <button className="temu-button" onClick={redirectToIMS}>
          进入主页 | Enter Main Page
        </button>
      </div>
    </div>
  );
};

export default SupplierDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SupplierDashboard.css";
// import { Client } from "@stomp/stompjs";
// import Stomp from '@stomp/stompjs';

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { supplierId } = useParams();
  const [paypalToken, setPaypalToken] = useState(null);
  const [notifications, setNotifications] = useState([]); // State to hold notifications
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
      } catch (err) {
        setError(err.message + ", Please Login First!");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();

    // // WebSocket connection setup
    // const client = new Stomp.Client({
    //   brokerURL: `${process.env.REACT_APP_API_URL.replace('http', 'ws')}/ws`,
    //   onConnect: () => {
    //     client.subscribe('/user/queue/notifications', (message) => {
    //       const notification = JSON.parse(message.body);
    //       setNotifications((prevNotifications) => [...prevNotifications, notification]);
    //       console.log(notification)
    //     });
    //   },
    //   // Add other necessary configuration options
    // });

    // client.activate();

    // return () => client.deactivate();
  }, []);

  // // Set up WebSocket connection
  // useEffect(() => {
  //   const stompClient = new Client({
  //     brokerURL: `${process.env.REACT_APP_API_URL.replace('http', 'ws')}/ws`,
  //     connectHeaders: {
  //       login: "guest",
  //       passcode: "guest",
  //     },
  //     debug: function (str) {
  //       console.log("STOMP: " + str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });

  //   stompClient.onConnect = function (frame) {
  //     // Subscribe to the notifications topic
  //     stompClient.subscribe(
  //       `/queue/notifications-${supplierId}`,
  //       function (message) {
  //         if (message.body) {
  //           const newNotification = JSON.parse(message.body);
  //           setNotifications((prevNotifications) => [
  //             ...prevNotifications,
  //             newNotification,
  //           ]);
  //         }
  //       }
  //     );
  //   };

  //   stompClient.onStompError = function (frame) {
  //     console.error("Broker reported error: " + frame.headers["message"]);
  //     console.error("Additional details: " + frame.body);
  //   };

  //   stompClient.activate();
  //   setClient(stompClient);

  //   // Disconnect the client when the component unmounts
  //   return () => {
  //     if (client) {
  //       client.deactivate();
  //     }
  //   };
  // }, [supplierId]); // Reconnect if supplierId changes

  // // Render notification messages
  // const renderNotifications = () => {
  //   return notifications.map((notification, index) => (
  //     <div key={index}>
  //       {notification.skuCode}: {notification.quantity}
  //     </div>
  //   ));
  // };
  
  // Retrieve and store the PayPal token when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paypalToken = queryParams.get("token");
    if (paypalToken) {
      setPaypalToken(paypalToken);
      localStorage.setItem("token", paypalToken);
    }
  }, []);

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
        {/* // Add any specific actions or display elements here */}
      </div>
      <div className="temu-area">
        <div className="temu-logo">
          <img src={pageurl} alt="Logo" />
        </div>
        <button className="temu-button" onClick={redirectToIMS}>
          进入 | Enter Main Page
        </button>
      </div>
      {/* <div className="notifications">
        <h2>Notifications</h2>
        {renderNotifications()}
      </div> */}
    </div>
  );
};

export default SupplierDashboard;

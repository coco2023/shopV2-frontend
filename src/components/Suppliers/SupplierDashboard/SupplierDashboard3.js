import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const SupplierDashboard3 = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Establish the WebSocket connection
    const socket = new SockJS('http://localhost:9001/ws');  // Update '/ws' to match your WebSocket endpoint
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      // Subscribe to the supplier-specific notification queue
      stompClient.subscribe('/user/queue/inventoryReduction', (message) => {
        // Message received from the server
        const notification = JSON.parse(message.body);
        
        // Update state to render the notification in the UI
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
    });

    return () => {
      // Disconnect the WebSocket client when the component unmounts
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  return (
    <div className="supplier-dashboard">
      <h2>Supplier Dashboard</h2>

      {/* Render notifications */}
      <div className="notifications">
        <h3>Notifications</h3>
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            <p>SKU: {notification.skuCode}, Quantity Reduced: {notification.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierDashboard3;

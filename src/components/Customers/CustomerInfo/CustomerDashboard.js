import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token provided.");
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const config = {
        headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
      };

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/customers/auth/info`,
          config
        );
        setUserInfo(response.data);
        setMessage(''); // Clear any previous error message

      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessage(`${error.message}, You haven't logged in yet. Please log in first.`);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      {userInfo ? (
        <>
          <h2>Hi, {userInfo.name} | User Dashboard</h2>
          <div>
            <p>Email: {userInfo.email}</p>
            <p>Name: {userInfo.name}</p>
            <p>Contact Info: {userInfo.contactInfo}</p>
            <p>User Type: {userInfo.userType}</p>
            {/* Render other user info here */}
          </div>
        </>
      ) : (
        <p>{message}</p> // Render message if userInfo is null
      )}
      
    </div>
  );
};

export default CustomerDashboard;

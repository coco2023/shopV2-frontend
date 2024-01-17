import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthMiddlewarePage = () => {
  const navigation = useNavigate(); // Initialize useHistory hook

  useEffect(() => {
    // Retrieve the token from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    console.log("mid page save token: " + token)

    if (token) {
      // Save the token to localStorage
      localStorage.setItem("token", token);
      // Redirect to the SupplierDashboard
      navigation("/supplier/profile");
    } else {
      // Handle the case where no token is found
      // You can redirect to an error page or take appropriate action
      console.error("No token found in the URL.");
    }
  });

  return <div>Auth Middleware Page...</div>;
};

export default AuthMiddlewarePage;

import React, { useState } from "react";
import "./SupplierLogin.css"; // Assuming you have a CSS file for styling

const SupplierLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/login`; // ${supplierId}
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the login logic here, perhaps sending a request to your server
    console.log("Login attempt:", username, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} id="login-form">
        <div className="supplier-input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="supplier-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button className="supplier-button" type="submit">Login</button>
        or
        <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
        <img src={paypalLogo} alt="PayPal Logo" /> Log in with PayPal
      </button>

      </form>
    </div>
  );
};

export default SupplierLogin;

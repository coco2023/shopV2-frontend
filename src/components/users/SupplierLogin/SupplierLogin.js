import React, { useState } from "react";
import "./SupplierLogin.css"; // Assuming you have a CSS file for styling
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useHistory for redirection

const SupplierLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [requestBody, setRequestBody] = useState({
    username: "",
    password: "",
    roleName: "",
  });
  const navigation = useNavigate(); // Initialize useHistory hook

  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    // window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/login`; // ${supplierId}
    window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/paypal`;
  };

  const redirectToRegisterPage = () => {
    navigation("/register")
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/user/login`,
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        requestBody
      );
      // Handle response, store token, redirect, etc.
      console.log("response.data: " + response.data);
      // Store the token in local storage or in-memory storage
      localStorage.setItem("token", response.data.token); // Store the token: no `Bearer `

    console.log(requestBody.roleName)
    if (requestBody.roleName === "SUPPLIER") {
      // Redirect to the supplier profile page
      navigation(`/supplier/profile?token=${response.data.token}`);
    } 
    
    if (requestBody.roleName === "CUSTOMER") {
      navigation(`/index`);
    }

     } catch (error) {
      console.error("Login error", error);
      // Handle error
    }
  };

  return (
    <div className="registration-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          {/* <label>Username:</label> */}
          <input
            type="text"
            name="username"
            placeholder="username"
            value={requestBody.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* <label>Password:</label> */}
          <input
            type="password"
            name="password"
            placeholder="password"
            value={requestBody.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <label>
            <input
              type="radio"
              name="roleName"
              value="SUPPLIER"
              checked={requestBody.roleName === "SUPPLIER"}
              onChange={handleChange}
              required
            />
            Supplier
          </label>
          <label>
            <input
              type="radio"
              name="roleName"
              value="CUSTOMER"
              checked={requestBody.roleName === "CUSTOMER"}
              onChange={handleChange}
            />
            Customer
          </label>
          {/* <label>
            <input
              type="radio"
              name="roleName"
              value="ADMIN"
              checked={requestBody.roleName === "ADMIN"}
              onChange={handleChange}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              name="roleName"
              value="TESTER"
              checked={requestBody.roleName === "TESTER"}
              onChange={handleChange}
            />
            Tester
          </label> */}
        </div>

        <button type="submit">Login</button>
      </form>
      or
      <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
        <img src={paypalLogo} alt="PayPal Logo" /> Login via PayPal
      </button>
      <p>
        PayPal Test Account: <br />
        email:sb-z9ugk28934884@business.example.com <br />
        password:A,wq0(1#
      </p>

      <button className="paypal-login-btn" onClick={redirectToRegisterPage}>Haven't had an Account? Click to Register</button>
    </div>
  );
};

export default SupplierLogin;

import React, { useState } from "react";
import axios from "axios";
import "./SupplierRegistration.css";
import { useNavigate } from "react-router-dom"; // Import useHistory for redirection

const SupplierRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    roleName: "",
  });
  const [message, setMessage] = useState("");
  const navigation = useNavigate(); // Initialize useHistory hook

  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        formData
      );
      setMessage("Registration successful");
      console.log(response.data);
      // Redirect to login or other appropriate page
      navigation(`/supplierLogin`)
    } catch (error) {
      setMessage(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error")
      );
      console.error("Error during registration:", error.response);
    }
  };

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/paypal`;
  };

  const redirectToLoginPage = () => {
    navigation("/supplierLogin")
  }

  return (
    <div className="registration-container">
      <h2>Register Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label>Username:</label> */}
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* <label>Email:</label> */}
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
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
              checked={formData.roleName === "SUPPLIER"}
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
              checked={formData.roleName === "CUSTOMER"}
              onChange={handleChange}
            />
            Customer
          </label>
          {/* <label>
            <input
              type="radio"
              name="roleName"
              value="ADMIN"
              checked={formData.roleName === "ADMIN"}
              onChange={handleChange}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              name="roleName"
              value="TESTER"
              checked={formData.roleName === "TESTER"}
              onChange={handleChange}
            />
            Tester
          </label> */}
        </div>

        <button type="submit">Register</button>
      </form>
      or
      <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
        <img src={paypalLogo} alt="PayPal Logo" /> Register via PayPal
      </button>
      {message && <p>{message}</p>}

      <br />
      <button className="paypal-login-btn" onClick={redirectToLoginPage}>Already have an account? Click to Login</button>
    </div>
  );
};

export default SupplierRegistration;

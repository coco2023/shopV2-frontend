import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");

  const paypalLogo = [
    "/assets/img/paypal/PayPal_Monogram_One_Color_Transparent_RGB_White.png",
  ];

  const handleLoginWithPayPal = () => {
    // Redirect to PayPal OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/authorize/3`; // ${supplierId}
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you can handle the login logic or API call
    console.log("Username: ", username, "Password: ", password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} id="login-form">
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
          or
          <button className="paypal-login-btn" onClick={handleLoginWithPayPal}>
            <img src={paypalLogo} alt="PayPal Logo" /> Log in with PayPal
          </button>
        </div>
      </form>
    </div>
  );

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const navigate = useNavigate();

  // const handleLogin = async () => {
  //   try {
  //       navigate.push('/user'); // Redirect to the user index page
  //   //   const response = await fetch('http://localhost:9001/login', { // Replace with your Spring backend URL
  //   //     method: 'POST',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //     },
  //   //     body: JSON.stringify({ username, password }),
  //   //   });

  //   //   if (response.ok) {
  //   //     const data = await response.json();
  //   //     // Assuming the response includes a JWT token
  //   //     localStorage.setItem('authToken', data.token); // Consider secure storage
  //   //     history.push('/user'); // Redirect to the user index page
  //   //   } else {
  //   //     setError('Invalid username or password');
  //   //   }
  //   } catch (error) {
  //     setError('Network error, please try again later.');
  //   }
  // };

  // return (
  //   <div>
  //     <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
  //     <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
  //     <button onClick={handleLogin}>Login</button>
  //     {error && <div style={{ color: 'red' }}>{error}</div>}
  //   </div>
  // );
}

export default LoginPage;

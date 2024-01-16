// src/LoginFailure.js

import React from "react";

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

const LoginFailure = () => {
  return (
    //         <div className="login-failure-page">
    <div style={styles.container}>
      <h1>Login Failed</h1>
      <p>Sorry, we were unable to log you in. Please try again.</p>
      <button onClick={() => (window.location.href = "/")}>Return Home</button>
      <button onClick={() => (window.location.href = "/login")}>
        Try Again
      </button>
    </div>
  );
};

export default LoginFailure;

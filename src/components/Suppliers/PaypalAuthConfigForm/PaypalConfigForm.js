import React, { useState } from "react";
import axios from "axios";
// import "./PaypalConfigForm.css"

const PaypalConfigForm = ({ supplierId }) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/v2/suppliers/configure-paypal/${supplierId}`,
        {
          paypalClientId: clientId,
          paypalClientSecret: clientSecret,
        }
      );

      setMessage(response.data);
    } catch (error) {
      setMessage("Error updating PayPal configuration");
    }
  };

  return (
    <div className="create-configform-modal">
      <h2>Update PayPal Configuration</h2>
      <label>
        PayPal Client ID:
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
      </label>
      <br />
      <label>
        PayPal Client Secret:
        <input
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSubmit}>Update</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaypalConfigForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PayPalReturnPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    // Make a request to your backend to check the payment status based on the token in the URL
    const supplierId = new URLSearchParams(window.location.search).get('supplierId');
    const token = new URLSearchParams(window.location.search).get('token');
    console.log("token: " + token, "supplierId: " + supplierId);
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/payments/paypal/check-payment-status?token=${token}&supplierId=${supplierId}`)
      .then((response) => {
        setPaymentStatus(response.data.status);
        console.log("Status response: " + response)
      })
      .catch((error) => {
        console.error('Error checking payment status:', error);
      });
  }, []);

  return (
    <div>
      <h2>PayPal Return Page</h2>
      <p>Payment Status: {paymentStatus}</p>
      {/* Display appropriate content based on the payment status */}
    </div>
  );
};

export default PayPalReturnPage;

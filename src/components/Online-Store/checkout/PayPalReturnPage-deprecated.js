// Import necessary dependencies
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import axios from "axios";

const PayPalReturnPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("status");

  // Handle the payment status here
  const handleBackendRequest = async () => {
    try {
      const response = await axios.get("http://localhost:9001/api/v1/payments/paypal-return", {
        params: { status: paymentStatus }, // Include the payment status as a query parameter
      });

      // Handle the response from the backend
      console.log("Backend response:", response.data);
    } catch (error) {
      // Handle errors if the request fails
      console.error("Error making backend request:", error);
    }
  };

  // Call the function when the component loads or as needed
  useEffect(() => {
    handleBackendRequest();
  }, []);

  // You can display appropriate content based on the paymentStatus
  // Define scenarios based on paymentStatus
  let content;
  switch (paymentStatus) {
    case "success":
      content = (
        <div>
          <h1>Payment Successful</h1>
          <p>Thank you for your payment.</p>
          {/* You can add more content specific to successful payments */}
        </div>
      );
      break;
    case "cancelled":
      content = (
        <div>
          <h1>Payment Cancelled</h1>
          <p>Your payment was cancelled by the user.</p>
          {/* You can add more content specific to cancelled payments */}
        </div>
      );
      break;
    default:
      content = (
        <div>
          <h1>Unknown Payment Status</h1>
          <p>The payment status is unknown or invalid.</p>
          {/* You can add more content for other payment statuses */}
        </div>
      );
  }

  return (
    <div>
      <h1>PayPal Return Page</h1>
      <p>Payment Status: {paymentStatus}</p>
      {/* Add logic to display appropriate content */}
    </div>
  );
};

export default PayPalReturnPage;

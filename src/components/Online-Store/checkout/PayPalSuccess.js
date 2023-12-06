import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// import { completePayment } from "./CheckoutUtils";

const PayPalSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");

    if (paymentId && payerId) {
      completePayment(paymentId, payerId);
    } else {
      // Handle the case where the parameters are not available
      console.error("Payment failed: Missing paymentId or PayerID");
      navigate("/payment-failed"); // Redirect to a failure page or handle otherwise
    }
  }, [searchParams, navigate]);

  const completePayment = async (paymentId, payerId) => {
    try {
      const response = await fetch(
        `http://localhost:9001/api/v1/payments/paypal/complete?paymentId=${paymentId}&PayerID=${payerId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete PayPal payment");
      }

      console.log("paymentId: " + paymentId + ", payerId: " + payerId);
      const responseData = await response.json();
      console.log("Payment completed successfully:", responseData);
      navigate("/order-confirmation", {
        state: { paymentDetails: responseData },
      }); // Redirect to a confirmation page
    } catch (error) {
      console.error("Error completing PayPal payment:", error);
      navigate("/payment-failed"); // Redirect to a failure page or handle otherwise
    }
  };

  return <div>Processing PayPal payment...</div>;
};

export default PayPalSuccess;

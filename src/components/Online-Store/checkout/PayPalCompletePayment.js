import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completePayPalPayment } from "./CheckoutUtils";
// Import the custom useBeforeUnload hook
import useBeforeUnload from './useBeforeUnload';

const PayPalCompletePayment = () => {

  // Use the useBeforeUnload component to handle beforeunload events
  useBeforeUnload();

  const navigate = useNavigate();
  const salesOrderData = JSON.parse(sessionStorage.getItem("salesOrderData"));
  const salesOrderDetailData = JSON.parse(
    sessionStorage.getItem("salesOrderDetailData")
  );
  console.log(
    "sessionStorage: salesOrderDetailData",
    salesOrderData,
    salesOrderDetailData
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentId = queryParams.get("paymentId");
    const payerId = queryParams.get("PayerID");

    const processComplete = async () => {
      if (paymentId && payerId) {
        try {
          const responseData = await completePayPalPayment(paymentId, payerId);
          sessionStorage.setItem('paymentData', JSON.stringify({
            paymentInfo: responseData,
            orderInfo: salesOrderData,
            orderDetailInfo: salesOrderDetailData,
          }));            
          window.location.href = `/payment-success`;
        } catch (error) {
          // Handle the case where the parameters are not available
          console.error("Payment failed: Missing paymentId or PayerID");
        }
      }
    };

    processComplete();
  }, []);

  return <div>Processing PayPal payment...</div>;
};

export default PayPalCompletePayment;

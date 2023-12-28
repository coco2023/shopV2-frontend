import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completePayPalPayment } from "./CheckoutUtils";

const PayPalCompletePayment = () => {

  const salesOrderData = JSON.parse(sessionStorage.getItem("salesOrderData"));
  const salesOrderDetailData = JSON.parse(
    sessionStorage.getItem("salesOrderDetailData")
  );
  const supplierId = salesOrderData.supplierId; // JSON.parse(sessionStorage.getItem("supplierId"));
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
          const responseData = await completePayPalPayment(paymentId, payerId, supplierId);
          // store the orderSn info
          sessionStorage.setItem('orderDataInfo', JSON.stringify({
            paymentInfo: responseData,
            salesOrderSn: salesOrderData.salesOrderSn, 
            orderDetailInfo: salesOrderDetailData,
          }));
          // sessionStorage.setItem('paymentData', JSON.stringify({
          //   paymentInfo: responseData,
          //   orderInfo: salesOrderData,
          //   orderDetailInfo: salesOrderDetailData,
          // }));            
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

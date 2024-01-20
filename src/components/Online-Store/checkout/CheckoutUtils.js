export const createSalesOrder = async (preOrderData, preOrderDetailData) => {
  function generateSalesOrderSn() {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Generate a random number (adjust range as needed)

    // Combine timestamp and random number to create the serial number
    const salesOrderSn = `SO-${timestamp}-${randomPart}`;

    return salesOrderSn;
  }

  const salesOrderData = preOrderData;
  salesOrderData.salesOrderSn = generateSalesOrderSn();

  const salesOrderDetailData = preOrderDetailData;
  salesOrderDetailData.salesOrderSn = salesOrderData.salesOrderSn;

  // Step 1: Create the SalesOrder
  const salesOrderResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/v1/salesOrders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesOrderData),
    }
  );

  console.log("salesOrderResponse: " + JSON.stringify(salesOrderResponse.salesOrder));


  if (!salesOrderResponse.ok) {
    console.error("Failed to create SalesOrder.");
    return;
  }

  // Step 2: Create the SalesOrderDetail
  const salesOrderDetailResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesOrderDetailData),
    }
  );

  if (!salesOrderDetailResponse.ok) {
    console.error("Failed to create SalesOrderDetail.");
    return;
  }

  return {
    salesOrderData,
    salesOrderDetailData,
  };
};

export const processPaymentWithStripe = async (stripeToken, salesOrder, salesOrderDetailData) => {
  try {
    console.log("Stripe Token:", stripeToken);
    console.log("salesOrder:", salesOrder);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/payments/stripe/charge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: stripeToken,
          salesOrder: salesOrder,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData.status == "succeeded") {
      console.log("Payment successful:", responseData);
      // Handle successful payment (e.g., navigate to a success page, update UI)
      sessionStorage.setItem('orderDataInfo', JSON.stringify({
        paymentInfo: responseData,
        salesOrderSn: salesOrder.salesOrderSn, 
        orderDetailInfo: salesOrderDetailData,
      }));

      // sessionStorage.setItem('paymentData', JSON.stringify({
      //   paymentInfo: responseData,
      //   orderInfo: salesOrder,
      //   orderDetailInfo: salesOrderDetailData,
      // }));            
      window.location.href = "/payment-success";

    } else {
      console.log("Payment failed:", responseData);
      // Handle failed payment (e.g., display an error message)
      throw new Error(
        `Payment failed: ${responseData.transactionId || "Payment failed"}`
      );
    }
  } catch (error) {
    console.error("Error during payment processing:", error);
    throw new Error(`Payment failed: ${error || "Payment failed"}`);
  }
};

export const processPaymentWithPayPal = async (salesOrder) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/payments/paypal/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesOrder),
      }
    );

    console.log("salesOrder: ", salesOrder)
    const responseData = await response.json();
    console.log("PayPal create - responseData: " + JSON.stringify(responseData));

    if (!response.ok) {
      throw new Error(
        responseData.message || "Failed to initiate PayPal payment"
      );
    }

    return responseData.approvalUrl; // Assuming the response contains the redirect URL
  } catch (error) {
    console.error("Error initiating PayPal payment:", error);
    throw error;
  }
};

export const completePayPalPayment = async (paymentId, payerId, supplierId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/payments/paypal/complete?paymentId=${paymentId}&PayerID=${payerId}&SupplierId=${supplierId}`,
      {
        method: "POST",
      }
    );

    console.log("***response" + response);
    if (!response.ok) {
      throw new Error("Failed to complete PayPal payment");
    }

    const responseData = await response.json();
    console.log(
      "paymentId: " + paymentId + ", payerId: " + payerId,
      "Payment completed successfully:",
      responseData
    );
    return responseData;
  } catch (error) {
    console.error("Error completing PayPal payment:", error);
  }
};

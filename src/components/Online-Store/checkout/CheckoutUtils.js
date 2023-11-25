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
    "http://localhost:9001/api/v1/salesOrders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salesOrderData),
    }
  );

  if (!salesOrderResponse.ok) {
    console.error("Failed to create SalesOrder.");
    return;
  }

  // Step 2: Create the SalesOrderDetail
  const salesOrderDetailResponse = await fetch(
    "http://localhost:9001/api/v1/salesOrderDetails",
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

export const processPaymentWithStripe = async (stripeToken, salesOrder) => {
  try {
    console.log("Stripe Token:", stripeToken);
    console.log("salesOrder:", salesOrder);

    const response = await fetch('http://localhost:9001/api/v1/payments/stripe/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: stripeToken,
        salesOrder: salesOrder
      }),
    });

    const responseData = await response.json();

    if (responseData.status == "succeeded") {
      console.log('Payment successful:', responseData);
      // Handle successful payment (e.g., navigate to a success page, update UI)
      return {
        responseData,
        salesOrder
      }
    } else {
      console.log('Payment failed:', responseData);
      // Handle failed payment (e.g., display an error message)
      throw new Error(`Payment failed: ${responseData.transactionId || 'Payment failed'}`);
    }
  } catch (error) {
    console.error('Error during payment processing:', error);
    throw new Error(`Payment failed: ${error || 'Payment failed'}`);
  }
  
};
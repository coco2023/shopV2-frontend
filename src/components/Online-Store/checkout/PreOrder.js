import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createSalesOrder } from "./CheckoutUtils.js";
import { processPaymentWithStripe } from "./CheckoutUtils.js";
import { processPaymentWithPayPal } from "./CheckoutUtils.js";
import "./PreOrder.css";
import { useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PreOrder = () => {

  const { productSkuCode } = useParams();
  const [productInfo, setProductInfo] = useState(null);

  // Stripe
  const stripePromise = loadStripe("pk_test_R59H51fw2NragH95O9OatOgT");
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = useRef();

  // Define the initial preOrder data
  const initialPreOrderData = {
    salesOrderSn: "",
    customerId: "12",
    orderDate: new Date().toISOString(),
    totalAmount: null,
    shippingAddress: "1010 W Green St",
    billingAddress: "1010 W Green St",
    orderStatus: "PENDING",
    paymentMethod: "PayPal",
    customerName: "tester12",
    customerEmail: "test@gmail.com",
    paymentProcessed: true,
  };

  // Define the initial salesOrderDetail data
  const initialSalesOrderDetailData = {
    salesOrderSn: "",
    skuCode: "",
    quantity: 1,
    unitPrice: 0.0,
    lineTotal: 0.0,
    discount: 0.0,
  };

  // Create state for preOrder data
  const [preOrderData, setPreOrderData] = useState(initialPreOrderData);

  // Create state for preOrder data
  const [preOrderDetailData, setPreOrderDetailData] = useState(
    initialSalesOrderDetailData
  );

  // Define a function to handle user input changes
  const handleInputPreOrderChange = (e) => {
    const { name, value } = e.target;
    setPreOrderData({
      ...preOrderData,
      [name]: value,
    });
  };

  // Define a function to handle user input changes
  const handleInputPreOrderDetailChange = (e) => {
    const value = e.target.value;

    setPreOrderDetailData({
      ...preOrderDetailData,
      quantity: value,
      lineTotal: preOrderDetailData.unitPrice * value,
    });

    setPreOrderData({
      ...preOrderData,
      totalAmount: preOrderDetailData.unitPrice * value,
    });
  };

  // Fetch product information based on the SKU code
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/products/product/${productSkuCode}`
        );
        if (response.ok) {
          const productData = await response.json();
          setProductInfo(productData);
        } else {
          console.error("Failed to fetch product information");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching product information:",
          error
        );
      }
    };

    fetchProductInfo();
  }, [productSkuCode]);

  useEffect(() => {
    if (productInfo) {

      const updatedPreOrderData = {
        ...initialPreOrderData,
        totalAmount: productInfo.price * preOrderDetailData.quantity,
      };

      const updatedSalesOrderDetailData = {
        ...initialSalesOrderDetailData,
        skuCode: productInfo.skuCode,
        unitPrice: productInfo.price,
        lineTotal: productInfo.price * preOrderDetailData.quantity,
      };

      setPreOrderData(updatedPreOrderData);
      setPreOrderDetailData(updatedSalesOrderDetailData);
    }
  }, [productInfo]);

  const StripeCheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    // Function to create a SalesOrder and SalesOrderDetail based on productInfo
    const handlePlaceOrder = async () => {
      if (preOrderData.paymentMethod === "Stripe") {
        if (!stripe || !elements) {
          return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
          console.log("Error:", error);
          return;
        }

        // create SalesOrder
        const salesOrderResponse = createSalesOrder(
          preOrderData,
          preOrderDetailData
        );
        console.log("salesOrder: ", salesOrderResponse);
        console.log("SalesOrder and SalesOrderDetail created successfully.");

        let finalSalesDetailData;
        salesOrderResponse
          .then(({ salesOrderData, salesOrderDetailData }) => {
            console.log("finalSalesOrder: ", salesOrderData);
            console.log("finalSalesOrderDetail: ", salesOrderDetailData);
            finalSalesDetailData = salesOrderDetailData;

            // Process payment with Stripe using finalSalesOrder
            processPaymentWithStripe(token.id, salesOrderData, salesOrderDetailData);
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      } else if (preOrderData.paymentMethod === "PayPal") {
        console.log("payPal:")
        // create SalesOrder
        const salesOrderResponse = createSalesOrder(
          preOrderData,
          preOrderDetailData
        );
        console.log("salesOrder: ", salesOrderResponse);
        console.log("SalesOrder and SalesOrderDetail created successfully.");

        salesOrderResponse
          .then(async ({ salesOrderData, salesOrderDetailData }) => {
            // Store data in session storage
            sessionStorage.setItem('salesOrderData', JSON.stringify(salesOrderData));
            sessionStorage.setItem('salesOrderDetailData', JSON.stringify(salesOrderDetailData));
            console.log("***salesOrder Data to PayPal: " + JSON.stringify(salesOrderData));

            const redirectUrl = await processPaymentWithPayPal(salesOrderData);
            window.location.href = redirectUrl; // Redirect to PayPal

          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
    };

    return (
      <div className="info-section">
        {preOrderData.paymentMethod === "Stripe" && <CardElement />}
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    );
  };

  return (
    <div className="checkout-page">
      <div className="left-basic-info">
        <div className="shipping-billing-info-edit">
          <div className="info-section">
            <h3>Shipping address</h3>
            <p>Chitchi +1 (217)111-1111</p>
            <p>1010 W Green St, Room 103</p>
            <p>URBANA, IL 61811-1234, United States</p>
            Shipping Address:
            <input
              type="text"
              id="shippingAddress"
              name="shippingAddress"
              value={preOrderData.shippingAddress}
              onChange={handleInputPreOrderChange}
            />
            <button>Change address</button>
          </div>
        </div>
        <div className="product-info-edit">
          <h3>Item details</h3>
          {productInfo && (
            <div className="product-item">
              <img src={productInfo.imageUrl} alt={productInfo.productName} />
              <div className="product-details">
                <p>{productInfo.productName}</p>
                <p>${preOrderDetailData.unitPrice}</p>
                Qty:{" "}
                <select
                  value={preOrderDetailData.quantity}
                  onChange={handleInputPreOrderDetailChange}
                  name="quantity"
                  id="quantity"
                >
                  {Array.from(
                    { length: Math.min(productInfo.stockQuantity, 100) },
                    (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>Payment methods</h3>
          Customer ID:
          <input
            type="text"
            id="customerId"
            name="customerId"
            value={preOrderData.customerId}
            onChange={handleInputPreOrderChange}
          />
          Customer Name:
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={preOrderData.customerName}
            onChange={handleInputPreOrderChange}
          />
          Customer Email:
          <input
            type="text"
            id="customerEmail"
            name="customerEmail"
            value={preOrderData.customerEmail}
            onChange={handleInputPreOrderChange}
          />
          Billing Address:
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={preOrderData.billingAddress}
            onChange={handleInputPreOrderChange}
          />
          Payment Method:
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={preOrderData.paymentMethod}
            onChange={handleInputPreOrderChange}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="PNC">PNC</option>
            <option value="AliPay">AliPay</option>
            <option value="WeChatPay">WeChatPay</option>
            {/* Add more payment methods as needed */}
          </select>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="coupon-code">
          <input type="text" placeholder="Enter coupon code" />
          <button>Apply</button>
        </div>
        <div className="summary-details">
          <div className="detail">
            <span>Item(s) total:</span>
            <span>${preOrderDetailData.unitPrice}</span>
          </div>
          <div className="detail">
            <span>Item(s) discount:</span>
            <span>-${preOrderDetailData.discount.toFixed(2)}</span>
          </div>
          <div className="detail">
            <span>Subtotal:</span>
            <span>${preOrderData.totalAmount}</span>
          </div>
          <div className="detail">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div className="detail">
            <span>Sales tax:</span>
            <span>
              $
              {( // preOrderData.totalAmount - preOrderData.lineTotal
                0
              ).toFixed(2)}
            </span>
          </div>
          <div className="total">
            <span>Order total</span>
            {/* <span>${preOrderData.totalAmount}</span> */}
            <span>${preOrderData.totalAmount}</span>
          </div>
        </div>
        <div className="plant-tree">
          <input type="checkbox" id="plant-tree" />
          <label htmlFor="plant-tree">
            We invite you to plant a tree for $0.25
          </label>
        </div>
        <Elements stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default PreOrder;

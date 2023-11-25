import React from "react";
import { useLocation } from "react-router-dom";
import "./PaymentSuccessPage.css";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { paymentInfo, orderInfo, orderDetailInfo } = location.state || {};
  console.log("paymentInfo: ", paymentInfo, orderDetailInfo, orderInfo);

  return (
    <div className="payment-success-container">
      <div className="order-details-header">
        <h1>Delivered</h1>
        <p>Order time: {orderInfo.orderDate}</p>
        <p>Order Sn: {orderInfo.salesOrderSn}</p>
      </div>

      <div className="shipping-and-item-container">
        <div className="shipping-details">
          <h2>Shipping to</h2>
          <p>
            {orderInfo.customerName} {orderInfo.customerEmail}
          </p>
          <p>{orderInfo.shippingAddress}</p>
        </div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="item-details">
          {Array.isArray(orderDetailInfo) ? (
            orderDetailInfo.map((item, index) => (
              <div key={index} className="item">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="item-image"
                />
                <div className="item-info">
                  <h3>{item.productName}</h3>
                  <p>SKU: {item.skuCode}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.unitPrice.toFixed(2)}</p>
                  <p>Total: ${item.lineTotal.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="product-item">
              <img
                src={orderDetailInfo.imageUrl}
                alt={orderDetailInfo.productName}
              />
              <div className="product-details">
                <p>{orderDetailInfo.productName}</p>
                <p>${orderDetailInfo.unitPrice}</p>
                <p>Quantity: {orderDetailInfo.quantity}</p>
                <p>Total: ${orderDetailInfo.lineTotal}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <p>Item(s) Total: ${orderInfo.totalAmount}</p>
          <p>Tax: ${orderInfo.taxAmount ? orderInfo.taxAmount : 0}</p>
          <p>Shipping: FREE</p>
          <p>Total: ${orderInfo.totalAmount}</p>
        </div>
      </div>

      <div className="payment-and-method-container">
        <div className="payment-details">
          <h2>Payment details</h2>
          <p>Order total: ${orderInfo.totalAmount}</p>
          {/* Include discount, subtotal, sales tax, etc. */}
        </div>

        <div className="payment-method">
          <h2>Payment method</h2>
          <p>{paymentInfo.paymentMethod}</p>
          <h2>Transaction Id</h2>
          <p>{paymentInfo.transactionId}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

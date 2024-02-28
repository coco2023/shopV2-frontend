import React, { useEffect, useState } from 'react';
// import { useLocation } from "react-router-dom";
import "./PaymentSuccessPage.css";
import IntercomChat from '../../Assist/intercom/IntercomChat';

const PaymentSuccessPage = () => {
  const extractData = JSON.parse(sessionStorage.getItem("orderDataInfo"));
  const { paymentInfo, salesOrderSn, orderDetailInfo } = extractData;
  const [ orderInfo, setOrderInfo ] = useState(null);

  // find SalesOrder Entity via salesOrderSn
  const getSalesOrder = async (salesOrderSn) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrders/salesOrderSn/${salesOrderSn}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setOrderInfo(data);
      // return data;
    } catch (error) {
      console.error("Error fetching sales order:", error);
    }
  };

  useEffect(() => {
    if (salesOrderSn) {
      getSalesOrder(salesOrderSn);
    }
  }, [salesOrderSn])

  if (!orderInfo) {
    return <div>Loading...</div>;
  }

  console.log(
    "***successPage: paymentInfo: ",
    paymentInfo,
    orderInfo,
    orderDetailInfo
  );

  return (
    <div className="payment-success-container">
      <div className="order-details-header">
        <h2>Order Status: {orderInfo.orderStatus}</h2>
        <p>Order time: {orderInfo.orderDate}</p>
        <p>Order Sn: {salesOrderSn}</p>
        <p>Supplier Id: {orderInfo.supplierId}</p>
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
          <h2>Payment Status</h2>
          <p> {paymentInfo.status} </p>
          <h2>Payment details</h2>
          <p>Order total: ${orderInfo.totalAmount}</p>
          {/* Include discount, subtotal, sales tax, etc. */}
        </div>

        <div className="payment-method">
          <h2>Payment method</h2>
          <p>{orderInfo.paymentMethod}</p>
          <h2>Transaction Id</h2>
          <p>{paymentInfo.transactionId}</p>
        </div>
      </div>

      <IntercomChat/>

    </div>
  );
};

export default PaymentSuccessPage;

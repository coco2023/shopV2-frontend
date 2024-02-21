import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createSalesOrder } from "./CheckoutUtils.js";
import { processPaymentWithStripe } from "./CheckoutUtils.js";
import { processPaymentWithPayPal } from "./CheckoutUtils.js";
import { checkOrderStatus } from "./CheckoutUtils.js"
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
    supplierId: 0,
  };

  // Define the initial salesOrderDetail data
  const initialSalesOrderDetailData = {
    salesOrderSn: "",
    skuCode: "",
    quantity: 1,
    unitPrice: 0.0,
    lineTotal: 0.0,
    discount: 0.0,
    supplierId: 0,
  };

  // Create state for preOrder data
  const [preOrderData, setPreOrderData] = useState(initialPreOrderData);

  // Create state for preOrder data
  const [preOrderDetailData, setPreOrderDetailData] = useState(
    initialSalesOrderDetailData
  );

  // isProcessingOrder 跟踪订单是否正在处理中
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // 设置一个状态标志来控制支付按钮的可用性, 防止用户在第一次点击支付按钮开始轮询时多次点击支付按钮导致重复创建订单。
  // 这个状态标志可以在用户首次点击支付按钮时设置为 true，以表示一个支付流程已经开始，直到这个支付流程结束（无论是成功、失败还是取消），这个状态标志才被重置为 false。同时，这个状态标志可以用来控制支付按钮的禁用状态以及显示一个加载提示给用户，表明订单正在处理中。
  // isPlacingOrder: 支付流程是否已经开始
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
        supplierId: productInfo.supplierId,
      };

      const updatedSalesOrderDetailData = {
        ...initialSalesOrderDetailData,
        skuCode: productInfo.skuCode,
        unitPrice: productInfo.price,
        lineTotal: productInfo.price * preOrderDetailData.quantity,
        supplierId: productInfo.supplierId,
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
      if (isPlacingOrder) {
        // 如果已经在下单支付中，则直接返回，防止重复操作
        return;
      }
    
      setIsPlacingOrder(true);  // 标记支付流程开始

      if (preOrderData.paymentMethod === "Stripe") {
        setIsProcessingOrder(false);  // 开始处理订单，显示加载界面

        if (!stripe || !elements) {
          return;
        }
        preOrderData.paymentMethod = "Stripe";
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
            setIsProcessingOrder(false);  // 隐藏加载状态

          })
          .catch((error) => {
            console.error("An error occurred:", error);
            setIsProcessingOrder(false);  // 隐藏加载状态
          });
      console.log("finish!")
      } else if (preOrderData.paymentMethod === "PayPal") {

        setIsProcessingOrder(true);  // 开始处理订单，显示加载界面

        preOrderData.paymentMethod = "PayPal";

        // create SalesOrder
        const salesOrderResponse = createSalesOrder(
          preOrderData,
          preOrderDetailData
        );
        console.log("success - salesOrder: ", salesOrderResponse);
        console.log("success - SalesOrder and SalesOrderDetail created successfully.");

        salesOrderResponse
          .then(async ({ salesOrderData, salesOrderDetailData }) => {
            // Store data in session storage; use for: PayPalCompletePayment
            sessionStorage.setItem('salesOrderData', JSON.stringify(salesOrderData));
            sessionStorage.setItem('salesOrderDetailData', JSON.stringify(salesOrderDetailData));
            console.log("***salesOrder Data to PayPal: " + JSON.stringify(salesOrderData));

            const redirectUrl = await processPaymentWithPayPal(salesOrderData);

            // 开始轮询订单状态
            const intervalId = setInterval(async () => {
              try {
                const statusResponse = await checkOrderStatus(salesOrderData.salesOrderSn);
                console.log("statusResponse:", statusResponse);
        
                if (statusResponse) { //  && statusResponse.status === "CREATED"
                  console.log("create success!")
                  clearInterval(intervalId);  // 停止轮询
                  setIsProcessingOrder(false);  // 隐藏加载状态
                  window.location.href = statusResponse.approvalUrl;  // 重定向到支付页面
                  setIsPlacingOrder(false);  // 标记支付流程结束
                } 
                // else if (statusResponse) { //  && statusResponse.status !== 'PROCESSING'
                //   clearInterval(intervalId);  // 停止轮询
                //   setIsProcessingOrder(false);  // 隐藏加载状态
                //   // 可以在这里处理订单非处理中状态，例如显示错误或状态消息
                //   setIsPlacingOrder(false);  // 出错时也要重置标志
                // }
                // 如果订单状态仍然是PROCESSING，则轮询将继续
              } catch (error) {
                console.error("Error fetching order status:", error);
                clearInterval(intervalId);  // 出错时停止轮询
                setIsProcessingOrder(false);  // 隐藏加载状态
                // 可以在这里处理错误情况
              }
            }, 3000);  // 每5秒轮询一次
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }
      console.log("finish!")
    };
  

    return (
      <div className="info-section">
        {isProcessingOrder && (
          <div className="loading-overlay">
            <div className="loading-message">Your order is being processed. Please wait...</div>
          </div>
        )}

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
                <p>supplier Id: {productInfo.supplierId}</p>
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
          {/* Payment Method:
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
          </select> */}
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

        <div className="order-summary">
          <br />
        <h3>Select Your Payment Method</h3>

          {/* <select
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
          </select> */}
        
        <Elements stripe={stripePromise}>
          <StripeCheckoutForm />
        </Elements>

        <p>
          Stripe test Payment Card: 4242424242424242 <br/>
          Stripe test Payment Card Date: 04/24 | CVC: 424 <br/>
          PayPal test Payment Account: sb-1j09x28410285@personal.example.com <br/> 
          PayPal test Payment Password: p76*E&a,

        </p>

          <div className="payment-methods">

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={preOrderData.paymentMethod === "PayPal"}
              onChange={handleInputPreOrderChange}
            />
            <img src="/assets/img/PaymentCheckout/paypal.svg" alt="PayPal" />
          </label>
          <br />
          <br />

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={preOrderData.paymentMethod === "Stripe"}
              onChange={handleInputPreOrderChange}
            />
            <img src="/assets/img/PaymentCheckout/stripe2.svg" alt="Stripe" />
            Credit Card
          </label>
          <br />
          <br />

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="AliPay"
              checked={preOrderData.paymentMethod === "AliPay"}
              onChange={handleInputPreOrderChange}
              disabled 
            />
            <img className="payment-logo" src="/assets/img/PaymentCheckout/alipay.png" alt="AliPay" />
            AliPay (Coming Soon!)
          </label>
          <br />
          <br />

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Klarna"
              checked={preOrderData.paymentMethod === "Klarna"}
              onChange={handleInputPreOrderChange}
              disabled 
            />
            <img className="payment-logo" src="/assets/img/PaymentCheckout/klarna.svg" alt="Klarna" />
            Klarna (Coming Soon!)
          </label>
          <br />
          <br />

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="WeChatPay"
              checked={preOrderData.paymentMethod === "WeChatPay"}
              onChange={handleInputPreOrderChange}
              disabled 
            />
            <img className="payment-logo" src="/assets/img/PaymentCheckout/wechat.png" alt="WeChat Pay" />
            WeChat Pay (Coming Soon!)
          </label>
          <br />
          <br />

        </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder;

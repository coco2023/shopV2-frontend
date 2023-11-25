import React, { useEffect, useState } from "react";
import "./SuccessPage.css"; // Don't forget to create and link a CSS file for styles
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const SuccessPage = () => {
  const [checkoutDetails, setCheckoutDetails] = useState();
  const location = useLocation(); // Hook to get access to the location object

  useEffect(() => {
    console.log("this is successPage!");
    const stripeApiKey = process.env.REACT_APP_STRIPE_API_KEY;
    console.log("Stripe API Key: ", stripeApiKey);

    // Function to get a query parameter value by name
    function getQueryParam(name) {
      const params = new URLSearchParams(location.search);
      return params.get(name);
    }

    // Get the payment_intent_id from the URL query parameters
    const paymentIntentId = getQueryParam("payment_intent_id");
    // Now you can use paymentIntentId in your component, for example, display it
    console.log("Payment Intent ID:", paymentIntentId);

    // Replace with your Stripe API endpoint for retrieving payment events
    const stripeEndpoint = `https://api.stripe.com/v1/checkout/sessions/${paymentIntentId}`;
    console.log("stripeEndpoint: " + stripeEndpoint);

    // fetch the url to check the detailed transaction recepit
    fetch(stripeEndpoint, {
      method: "GET",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${stripeApiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("successfully get checkout data: " + data);
        setCheckoutDetails(data);
        console.log("CheckoutDetails: " + checkoutDetails);
      })
      .catch((error) => {
        console.error("Error fetching payment event data:", error);
      });
  }, [location]);

  // download as pdf
  const handleDownload = () => {
    const pdf = new jsPDF();
    const checkoutDetails = document.getElementById("checkout-details");
    console.log("checkoutDetails: " + checkoutDetails);

    // Adding elements from checkout details to the PDF
    pdf.text("Checkout Details", 10, 10);

    let yOffset = 20; // starting vertical position
    const maxWidth = 80; // maximum width for the value text in the PDF

    checkoutDetails.querySelectorAll(".detail-item").forEach((item) => {
      const description = item.querySelector(".description").textContent;
      let value = item.querySelector(".value").textContent; // Define value using let
      console.log("value: " + value);

      // Check if the description matches any of the specified fields and wrap text if too long
      if (["ID", "Customer ID", "Order ID"].includes(description)) {
        value = pdf.splitTextToSize(value, maxWidth);
      }

      pdf.text(description, 10, yOffset);
      pdf.text(value, 100, yOffset);
      yOffset += (Array.isArray(value) ? value.length : 1) * 10; // Move down for next item, considering potential wrapped lines
    });

    // Save the generated PDF
    pdf.save("checkout_details.pdf");
  };

  return (
    <div className="card" >
      <div
        style={{
          borderRadius: "200px",
          height: "200px",
          width: "200px",
          background: "#F8FAF5",
          margin: "0 auto",
        }}
      >
        <i className="checkmark">✓</i>
      </div>
      <h1 className="successPage_h1">Success</h1>
      <button
        id="download-btn"
        className="download-btn"
        onClick={handleDownload}
      >
        ⬇️ Download Receipt
      </button>
      <br />
      <br />

      {checkoutDetails ? (
        <div id="checkout-details" className="checkout-details">
          <div class="session-details">
            <h2>Checkout Session Details</h2>

            <div class="detail-item">
              <span class="description">ID</span>
              <span class="value id-value">{checkoutDetails.id}</span>
            </div>

            <div class="detail-item">
              <span class="description">Payment Intent ID</span>
              <span class="value">{checkoutDetails.payment_intent}</span>
            </div>

            <div class="detail-item">
              <span class="description">Customer</span>
              <span class="value">{checkoutDetails.customer_details.name}</span>
            </div>

            <div class="detail-item">
              <span class="description">Customer Email</span>
              <span class="value">{checkoutDetails.customer_email}</span>
            </div>

            <div class="detail-item">
              <span class="description">Customer ID</span>
              <span class="value">{checkoutDetails.metadata.custom_id}</span>
            </div>

            <div class="detail-item">
              <span class="description">Order ID</span>
              <span class="value">
                {checkoutDetails.metadata.custom_order_id}
              </span>
            </div>

            <div class="detail-item-button">
              <span class="description">Subtotal (Cents)</span>
              <span class="value">{checkoutDetails.amount_subtotal}</span>
            </div>

            <div class="detail-item">
              <span class="description">Total (Cents)</span>
              <span class="value">{checkoutDetails.amount_total}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="successPage_p">Loading checkout details...</p>
      )}

      <br />
      <p className="successPage_p">
        We received your purchase request & appreciate your business! <br />
        If you have any questions, please email{" "}
        <a href="mailto:admin@umiuni.com" className="successPage_a">admin@umiuni.com</a>
      </p>
    </div>
  );
};

export default SuccessPage;

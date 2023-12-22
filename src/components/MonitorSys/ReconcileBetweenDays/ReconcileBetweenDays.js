import React, { useState } from "react";
import axios from "axios";
import "./ReconcileBetweenDays.css"

const ReconcileBetweenDays = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reconciliationResult, setReconciliationResult] = useState(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [error, setError] = useState(null);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const formatDate = (dateString) => {
    return dateString.replace(/-/g, "/");
  };

  const handleReconcilePastDaysResponse = (data) => {
    // Assuming the data is an array and needs to be reversed
    // This will not mutate the original data array
    const reversedData = [...data].reverse();
    setReconciliationResult(reversedData);
    console.log(reversedData);
  };

  const reconcileBetweenDates = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsReconciling(true);
    setReconciliationResult(null);
    setError(null);

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/reconciliation/reconcile/between-days`,
        {
          params: { start: formattedStartDate, end: formattedEndDate },
        }
      );
      handleReconcilePastDaysResponse(response.data);
    } catch (err) {
      setError("Reconciliation failed: " + (err.response?.data || err.message));
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="reconcile-between-dates-container">
      <h2>Reconcile Between Dates</h2>
      <div className="date-inputs">
        <input
          className="date-picker"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          className="date-picker"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <button
          className="reconcile-button"
          onClick={reconcileBetweenDates}
          disabled={isReconciling}
        >
          {isReconciling ? "Reconciling..." : "Reconcile"}
        </button>
      </div>
      {reconciliationResult && (
        <div className="results-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Sales Order SN</th>
                <th>Transaction ID</th>
                <th>Total Amount</th>
                <th>PayPal Service Fee</th>
                <th>Net Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Payment Method</th>
                <th>Customer Name</th>
                <th>Error Log</th>
              </tr>
            </thead>
            <tbody>
              {reconciliationResult.map((result, index) => (
                <tr key={index}>
                  <td>{result.salesOrder?.salesOrderSn || "N/A"} </td>
                  <td>{result.payPalPayment?.transactionId || "N/A"}</td>
                  <td>${result.salesOrder?.totalAmount || "N/A"}</td>
                  <td>${result.payPalPayment?.payPalFee || "N/A"}</td>
                  <td>${result.payPalPayment?.net || "N/A"}</td>
                  <td>{result.payPalPayment?.status || "N/A"}</td>
                  <td>{result.salesOrder?.orderStatus || "N/A"}</td>
                  <td>{result.payPalPayment?.paymentMethod || "N/A"}</td>
                  <td>{result.salesOrder?.customerName || "N/A"}</td>
                  <td>{result.reconcileErrorLog || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}{" "}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </div>
  );
};

export default ReconcileBetweenDays;

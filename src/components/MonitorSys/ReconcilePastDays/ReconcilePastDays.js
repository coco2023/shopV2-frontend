import React, { useState } from 'react';
import axios from 'axios';
import "./ReconcilePastDays.css"

const ReconcilePastDays = () => {
  const [days, setDays] = useState(1);
  const [reconciliationResult, setReconciliationResult] = useState(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [error, setError] = useState(null);

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleReconcilePastDaysResponse = (data) => {
    // Assuming the data is an array and needs to be reversed
    // This will not mutate the original data array
    const reversedData = [...data].reverse();
    setReconciliationResult(reversedData);
    console.log(reversedData)
  };
  
  const reconcilePastDays = async () => {
    setIsReconciling(true);
    setReconciliationResult(null);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/reconciliation/reconcile/past-days/${days}`);
      // setReconciliationResult(response.data);
      handleReconcilePastDaysResponse(response.data);
    } catch (err) {
      setError('Reconciliation failed: ' + (err.response?.data || err.message));
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="reconcile-past-days-container">
      <h2>Reconcile Past Days</h2>
      <div className="input-group">
        <input
          type="number"
          value={days}
          onChange={handleDaysChange}
          min="1"
          placeholder="Enter number of past days"
          className="days-input"
        />
        <button onClick={reconcilePastDays} disabled={isReconciling} className="reconcile-button">
          {isReconciling ? 'Reconciling...' : 'Reconcile'}
        </button>
      </div>
      {reconciliationResult && (
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
                <td>{result.salesOrder?.salesOrderSn  || "N/A"} </td>
                <td>{result.payPalPayment?.transactionId  || "N/A"}</td>
                <td>${result.salesOrder?.totalAmount  || "N/A"}</td>
                <td>${result.payPalPayment?.payPalFee  || "N/A"}</td>
                <td>${result.payPalPayment?.net  || "N/A"}</td>
                <td>{result.payPalPayment?.status  || "N/A"}</td>
                <td>{result.salesOrder?.orderStatus  || "N/A"}</td>
                <td>{result.payPalPayment?.paymentMethod  || "N/A"}</td>
                <td>{result.salesOrder?.customerName  || "N/A"}</td>
                <td>{result.reconcileErrorLog  || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
};

export default ReconcilePastDays;

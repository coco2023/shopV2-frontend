import React, { useState } from "react";
import axios from "axios";
import "./ReconcileWithOrder.css";

const formatDate = (dateArray) => {
  const date = new Date(...dateArray);
  return date.toLocaleString();
};

const ReconcileWithOrder = () => {
  const [salesOrderSn, setSalesOrderSn] = useState("");
  const [reconciliationResult, setReconciliationResult] = useState(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [error, setError] = useState(null);

  const handleSalesOrderSnChange = (event) => {
    setSalesOrderSn(event.target.value);
  };

  const reconcilePayment = async () => {
    if (!salesOrderSn) {
      setError("Please enter a Sales Order SN.");
      return;
    }

    setIsReconciling(true);
    setReconciliationResult(null);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/reconciliation/reconcile`,
        {
          params: { salesOrderSn },
        }
      );
      setReconciliationResult(response.data);
    } catch (err) {
      setError("Reconciliation failed: " + (err.response?.data || err.message));
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="reconcile-container">
      <h2>Reconcile Payment</h2>
      <div className="reconcile-input-group">
        <input
          type="text"
          value={salesOrderSn}
          onChange={handleSalesOrderSnChange}
          placeholder="Enter Sales Order SN"
          className="reconcile-input"
        />
        <button
          onClick={reconcilePayment}
          disabled={isReconciling}
          className="reconcile-button"
        >
          {isReconciling ? "Reconciling..." : "Reconcile"}
        </button>{" "}
        Sample SalesOrderSn: SO-1703200050520-9208
      </div>
      {reconciliationResult &&
        reconciliationResult.salesOrder &&
        reconciliationResult.payPalPayment && (
          <div className="reconciliation-result">
            <table className="reconciliation-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sales Order SN</td>
                  <td>{reconciliationResult.salesOrder.salesOrderSn}</td>
                </tr>
                <tr>
                  <td>Transaction ID</td>
                  <td>{reconciliationResult.payPalPayment.transactionId}</td>
                </tr>
                <tr>
                  <td>Order Status</td>
                  <td>{reconciliationResult.salesOrder.orderStatus}</td>
                </tr>
                <tr>
                  <td>Payment State</td>
                  <td>{reconciliationResult.payPalPayment.paymentState}</td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>{reconciliationResult.payPalPayment.paymentMethod}</td>
                </tr>
                <tr>
                  <td>Total Order Amount</td>
                  <td>${reconciliationResult.salesOrder.totalAmount}</td>
                </tr>
                <tr>
                  <td>PayPal Service Fee</td>
                  <td>${reconciliationResult.payPalPayment.payPalFee}</td>
                </tr>
                <tr>
                  <td>Net Amount</td>
                  <td>${reconciliationResult.payPalPayment.net}</td>
                </tr>
                <tr>
                  <td>Payment Creation Time</td>
                  <td>
                    {formatDate(reconciliationResult.payPalPayment.createTime)}
                  </td>
                </tr>
                <tr>
                  <td>Customer Name</td>
                  <td>{reconciliationResult.salesOrder.customerName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      {reconciliationResult && reconciliationResult.reconcileErrorLog && (
        <div className="reconcile-error">Error: {error}</div>
      )}
    </div>
  );
};

export default ReconcileWithOrder;

import React, { useState } from "react";
import axios from "axios";
import { downloadCSV } from "./downloadCsvUtils";
import "./PaypalTransactionUploader.css"

function PaypalTransactionUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/v1/reconciliation/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setTransactions(response.data);
        console.log("File successfully uploaded", response.data);
      })
      .catch((error) => {
        console.error("Error uploading file", error);
      });
  };

  return (
    <div className="container-reconcile-content">
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>

        <a
          href="assets/csv/sample_transactions.csv"
          download="Sample_Transactions.csv"
          className="download-sample"
        >
          Download Sample CSV
        </a>
      </div>

      <div>
        <h2>Reconcile Transaction Records Will Show Here</h2>
        <button onClick={() => downloadCSV(transactions)}>Download CSV</button>
        <div className="reconcile-scrollable-table">
          <table className="reconcile-table reconcile-table-bordered">
            <thead>
              <tr className="reconcile-table-heading"><h3>Error Log</h3></tr>
              <tr>
                <th>ErrorCode</th>
                <th>ErrorMessage</th>
                <th>Transaction SN</th>
                <th>Sales Order SN</th>
                <th>Error Type</th>
                <th>Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(
                (result, index) =>
                  result.reconcileErrorLog && (
                    <tr key={`error-${index}`}>
                      <td>{result.reconcileErrorLog.errorCode}</td>
                      <td>{result.reconcileErrorLog.errorMessage}</td>
                      <td>{result.reconcileErrorLog.transactionSn || "N/A"}</td>
                      <td>{result.reconcileErrorLog.salesOrderSn}</td>
                      <td>{result.reconcileErrorLog.errorType}</td>
                      <td>{result.reconcileErrorLog.description}</td>
                      <td>
                        {new Date(
                          result.reconcileErrorLog.timestamp[0],
                          result.reconcileErrorLog.timestamp[1] - 1,
                          result.reconcileErrorLog.timestamp[2],
                          result.reconcileErrorLog.timestamp[3],
                          result.reconcileErrorLog.timestamp[4],
                          result.reconcileErrorLog.timestamp[5]
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
              )}
            </tbody>

            <thead>
              <tr className="reconcile-table-heading">
                <h3>Reconcile Transaction Records</h3>
              </tr>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Sales Order SN</th>
                <th>Fees</th>
                <th>Net Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((result, index) => (
                <tr key={index}>
                  <td>{result.paypalDBPaymentRecord?.createTime || "N/A"}</td>
                  <td>
                    {result.paypalDBPaymentRecord?.transactionId ||
                      result.paypalTransactionRecord.transactionId}
                  </td>
                  <td>
                    {result.paypalDBPaymentRecord?.salesOrderSn ||
                      result.paypalTransactionRecord.salesOrderSn}
                  </td>
                  <td>
                    {result.paypalDBPaymentRecord?.payPalFee ||
                      result.paypalTransactionRecord.fees}
                  </td>
                  <td>
                    {result.paypalDBPaymentRecord?.net ||
                      result.paypalTransactionRecord.net}
                  </td>
                  <td>{result.paypalDBPaymentRecord?.status || "N/A"}</td>
                  <td>
                    {result.paypalDBPaymentRecord?.paymentMethod || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaypalTransactionUploader;

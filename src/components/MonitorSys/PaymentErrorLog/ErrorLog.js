import React, { useState, useEffect } from "react";
import axios from "axios";

// ErrorLog component
const ErrorLog = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchErrorLogs = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/payments/get-payment-error-logs/all`
        );
        const sortedLogs = response.data.sort((a, b) => b.id - a.id);
        setErrorLogs(sortedLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchErrorLogs();
  }, []);

  if (loading) {
    return <div>Loading error logs...</div>;
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <h2>Payment Error Logs</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Transaction SN</th>
            <th>Sales Order SN</th>
            <th>Error Code</th>
            <th>Error Message</th>
            <th>Error Type</th>
            <th>Description</th>
            <th>Stack Trace</th>
          </tr>
        </thead>
        <tbody>
          {errorLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.transactionSn}</td>
              <td>{log.salesOrderSn}</td>
              <td>{log.errorCode}</td>
              <td>{log.errorMessage}</td>
              <td>{log.errorType}</td>
              <td>{log.description}</td>
              <td>{log.stackTrace}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorLog;

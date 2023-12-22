import React, { useState } from "react";
import axios from "axios";
import "./MonthlySalesReport.css";

const MonthlySalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("CSV");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const formatDate = (dateString) => {
    return dateString.replace(/-/g, "/");
  };

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsGenerating(true);
    setReportData([]);
    setError(null);

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/reconciliation/monthly-sales-report`,
        {
          params: {
            start: formattedStartDate,
            end: formattedEndDate,
            type: reportType,
          },
          responseType: reportType === "CSV" ? "blob" : "json",
          // responseType: reportType === "JSON" ? "json" : "blob",
        }
      );

      console.log(response.data);

      // Convert the object to an array of entries
      const dataArray = Object.entries(response.data).map(([date, data]) => ({
        date,
        ...data,
      }));
      setReportData(dataArray);

      if (reportType === "CSV") {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `monthly-sales-report.${reportType.toLowerCase()}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
        setReportData([]);
      }
    } catch (err) {
      setError(
        "Failed to generate the report: " + (err.response?.data || err.message)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="monthly-sales-report-container">
      <h2>Generate Monthly Sales Report</h2>
      <div>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <select value={reportType} onChange={handleReportTypeChange}>
          <option value="CSV">CSV</option>
          <option value="JSON">JSON Visualize</option>
          {/* Add other types as needed */}
        </select>
        <button onClick={generateReport} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Report"}
        </button>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
      {reportData.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Payments Received</th>
              <th>Total Amount Received</th>
              <th>Fees</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.paymentsReceived}</td>
                <td>${item.totalAmountReceived.toFixed(2)}</td>
                <td>${item.fees.toFixed(2)}</td>
                <td>${item.netAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MonthlySalesReport;

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SuppliersFinance = () => {
  const { supplierId } = useParams();
  const [financeReports, setFinanceReports] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [reportType, setReportType] = useState("monthly"); // State to hold the report type
  const location = useLocation(); // Hook to access the current location

  const handleMonthChange = (date) => {
    // Set the date to the second day of the selected month
    const secondDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
    setStartDate(secondDayOfMonth);
  };

  // Format date to 'yyyy/MM/dd'
  const dateString = startDate.toISOString().split("T")[0].replace(/-/g, "/");

  const fetchReports = async () => {
    console.log("date: " + dateString, "reportType: " + reportType);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/finance/${supplierId}/financial-report`,
        {
          params: {
            date: dateString,
            type: reportType,
          },
        }
      );
      setFinanceReports(response.data);
    } catch (error) {
      console.error("Error fetching financial financeReports:", error);
    }
  };

  // Check the current URL to determine the active tab
  useEffect(() => {
    if (location.pathname.includes("monthly")) {
      setReportType("monthly");
    } else if (location.pathname.includes("yearly")) {
      setReportType("yearly");
    }
  }, [location]);

  return (
    <div className="brand-container">
      <h2>Financial Reports</h2>

      {reportType === "monthly" && (
        <DatePicker
          selected={startDate}
          onChange={handleMonthChange}
          dateFormat="yyyy/MM/dd"
          showMonthYearPicker
          placeholderText="Select a month"
          // Custom filter for DatePicker to limit the available years
          filterDate={(date) => {
            const year = date.getFullYear();
            return year === 2022 || year === 2023;
          }}
        />
      )}
      {reportType === "yearly" && (
        <DatePicker
          selected={startDate}
          onChange={handleMonthChange}
          dateFormat="yyyy"
          showYearPicker
          placeholderText="Select a year"
          // Custom filter for DatePicker to limit the available years
          filterDate={(date) => {
            const year = date.getFullYear();
            return year === 2022 || year === 2023;
          }}
        />
      )}

      <button onClick={fetchReports}>Generate Report</button>

      <table className="brand-table">
        <thead>
          <tr>
            <th>Report Date</th>
            <th>Payments Received</th>
            <th>Total Tax</th>
            <th>Total Service Fee</th>
            <th>Other Fees</th>
            <th>Total Net Amount</th>
            <th>Total Amount Received</th>
            <th>Accounts Receivable</th>
            <th>Actual Receipts</th>
            <th>Outstanding Accounts</th>
            <th>Opening Balance</th>
            <th>Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {financeReports.map((report, index) => (
            <tr key={index}>
              <td>{report.reportDate}</td>
              <td>{report.paymentsNumReceived}</td>
              <td>{report.totalTax}</td>
              <td>{report.totalServiceFee}</td>
              <td>{report.otherFees}</td>
              <td>{report.totalNetAmount}</td>
              <td>{report.totalAmountReceived}</td>
              <td>{report.accountsReceivable}</td>
              <td>{report.actualReceipts}</td>
              <td>{report.outstandingAccounts}</td>
              <td>{report.openingBalance}</td>
              <td>{report.closingBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuppliersFinance;

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SuppliersFinance.css";

const SuppliersFinance = () => {
  const { supplierId } = useParams();
  const [financeReports, setFinanceReports] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2023-12-01"));
  const [startYear, setStartYear] = useState(new Date('2023-01-01'));
  const [dateString, setDateString] = useState(null);
  const [reportType, setReportType] = useState("monthly"); // State to hold the report type
  const location = useLocation(); // Hook to access the current location

  const handleMonthlyDateChange = (date) => {
    setDateString(
      `${startDate.getFullYear()}/${String(startDate.getMonth() + 1).padStart(2,"0")}`
    );
  };

  const handleYearlyDateChange = (date) => {
    setDateString(`${startDate.getFullYear()}`);
  };

  const fetchReports = async () => {
    console.log("date: " + dateString, "reportType: " + reportType);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/finance/${supplierId}/financial-report/get`,
        {
          params: {
            time: dateString,
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
          onChange={handleMonthlyDateChange}
          dateFormat="yyyy/MM"
          showMonthYearPicker
          picker="month"
          value="2023/12"
          placeholderText="Select a month"
          className="custom-datepicker"
        />
      )}
      {reportType === "yearly" && (
        <DatePicker
          selected={startYear}
          onChange={handleYearlyDateChange}
          dateFormat="yyyy"
          showYearPicker
          placeholderText="Select a year"
          value="2023"
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

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Make sure to install axios with npm or yarn
import "./SupplierFinanceReport.css";

const SupplierFinanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [financeReports, setFinanceReports] = useState([]);
  const [reportType, setReportType] = useState("monthly");

  const fetchFinanceReports = async (time, type) => {
    const url = `${process.env.REACT_APP_API_URL}/api/v1/suppliers/finance/3/financial-report/get?time=${time}&type=${type}`;
    try {
      const response = await axios.get(url);
      const sortedReports = response.data.sort(
        (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
      );
      setFinanceReports(sortedReports);
    } catch (error) {
      console.error("Error fetching finance reports:", error);
    }
  };

  useEffect(() => {
    const formattedDate =
      reportType === "monthly"
        ? `${selectedDate.getFullYear()}/${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}`
        : `${selectedDate.getFullYear()}`;
    fetchFinanceReports(formattedDate, reportType);
  }, [selectedDate, reportType]);

  return (
    <div className="brand-container">
      <div className="tab-bar">
        <button
          className={`tab ${reportType === "monthly" ? "active" : ""}`}
          onClick={() => setReportType("monthly")}
        >
          Monthly Financial Reports | 日汇总
        </button>
        <button
          className={`tab ${reportType === "yearly" ? "active" : ""}`}
          onClick={() => setReportType("yearly")}
        >
          Yearly Financial Reports | 月汇总
        </button>
      </div>

      <div className="date-picker-container">
        {reportType === "monthly" ? (
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            placeholderText="Select a month"
            className="custom-datepicker"
            minDate={new Date('2022-01-01')}
            maxDate={new Date()}
          />
        ) : (
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Select a year"
            className="custom-datepicker"
            // Custom filter for DatePicker to limit the available years
            filterDate={(date) => {
              const year = date.getFullYear();
              return year === 2022 || year === 2023;
            }}
          />
        )}
      </div>

      <table className="salesOrder-table">
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
          <tr>
            <th>日期</th>
            <th>到账总数</th>
            <th>税费</th>
            <th>服务费</th>
            <th>其他费用</th>
            <th>净利润</th>
            <th>到账总额</th>
            <th>应收账款</th>
            <th>实收账款</th>
            <th>未结清账款</th>
            <th>期初余额</th>
            <th>期末余额</th>
          </tr>
        </thead>
        <tbody>
          {financeReports.map((report, index) => (
            <tr key={index}>
              <td>{report.reportDate}</td>
              <td>{report.paymentsNumReceived}</td>
              <td>{report.totalTax.toFixed(2)}</td>
              <td>{report.totalServiceFee.toFixed(2)}</td>
              <td>{report.otherFees.toFixed(2)}</td>
              <td>{report.totalNetAmount.toFixed(2)}</td>
              <td>{report.totalAmountReceived.toFixed(2)}</td>
              <td>{report.accountsReceivable.toFixed(2)}</td>
              <td>{report.actualReceipts.toFixed(2)}</td>
              <td>{report.outstandingAccounts.toFixed(2)}</td>
              <td>{report.openingBalance.toFixed(2)}</td>
              <td>{report.closingBalance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierFinanceReport;

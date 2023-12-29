import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SuppliersPayPalPayment.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const SuppliersPayPalPayment = () => {
  const { supplierId } = useParams();
  const [payments, setPayments] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 20; // Number of items to display per page

  useEffect(() => {
    // Fetch all payments when the component mounts
    fetchPayments();
  }, []);

  useEffect(() => {
    // Update filteredPayments whenever payments change
    if (searchId === "" && !selectedPayment) {
      setFilteredPayments(payments);
    }
  }, [payments, searchId, selectedPayment]);

  // get all
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/payments/${supplierId}/all`
      );
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedPayments = filteredPayments.slice(
    offset,
    offset + itemsPerPage
  );

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/payments/${supplierId}/payment/${searchId}`
      );
      const foundPayment = response.data;

      if (foundPayment) {
        // Display only the matched brand in the table
        setFilteredPayments([foundPayment]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered payments and indicate that the search is not active
        setFilteredPayments([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching brand by ID:", error);
      setFilteredPayments([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="brand-container">
      <div className="header-row">
        <h1>Payment List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <table className="brand-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>PayPal Token</th>
            <th>Invoice SN</th>
            <th>Sales Order SN</th>
            <th>Transaction ID</th>
            <th>Payment State</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>PayPal Fee</th>
            <th>Net</th>
            <th>Payer ID</th>
            <th>Merchant ID</th>
            <th>Supplier ID</th>
            <th>Create Time</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.paypalToken}</td>
              <td>{payment.invoiceSn}</td>
              <td>{payment.salesOrderSn}</td>
              <td>{payment.transactionId}</td>
              <td>{payment.paymentState}</td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.status}</td>
              <td>{payment.payPalFee}</td>
              <td>{payment.net}</td>
              <td>{payment.payerId}</td>
              <td>{payment.merchantId}</td>
              <td>{payment.supplierId}</td>
              <td>
                {payment.createTime}
                {/* {payment.createTime ? payment.createTime.toLocaleString() : ""} */}
              </td>
              <td>
                {payment.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"page-link-disabled"}
          activeClassName={"page-link-active"}
        />
      </div>
    </div>
  );
};

export default SuppliersPayPalPayment;

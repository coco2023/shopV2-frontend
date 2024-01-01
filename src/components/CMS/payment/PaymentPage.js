import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentPage.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const PaymentPage = () => {
  const [payments, setBrands] = useState([]);
  const [payment, setPayment] = useState({
    invoiceId: null, // Replace with the initial value or leave it as null
    transactionId: "",
    paymentDate: null, // Replace with the initial value or leave it as null
    amount: 0.0, // Replace with the initial value
    paymentStatus: "PENDING", // Replace with the initial status value
    paymentMethod: "", // Replace with the initial payment method
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  // get all
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/payments/all`
      );
      setBrands(response.data);
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

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedPayment(false);
  };

  const handlePaymentClick = (selectedPayment) => {
    setSelectedPayment(selectedPayment);
    setPayment(selectedPayment); // Initialize the input with the selected brand's name
  };

  const handleEditPayment = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/payments/${selectedPayment.paymentId}`,
        payment
      );
      fetchPayments();
      setSelectedPayment(null);
      setPayment([]);
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/payments/${id}`);
      fetchPayments();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  // create brand
  const handleShowCreateModal = () => {
    setPayment([]);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateBrand = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/payments`, payment);
      fetchPayments();
      setPayment([]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/payments/${searchId}`
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
    <div className="product-container">
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

        <button onClick={handleShowCreateModal}>Create Payment</button>
      </div>

      <table className="product-table">
        {/* <table className="sales-order-table"> */}
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Invoice ID</th>
            <th>Transaction ID</th>
            <th>Payment Date</th>
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((payment) => (
            <tr key={payment.paymentId}>
              <td>{payment.paymentId}</td>
              <td>{payment.invoiceId}</td>
              <td>{payment.transactionId}</td>
              <td>{payment.paymentDate}</td>
              <td>{payment.amount.toFixed(2)}</td>
              <td>{payment.paymentStatus}</td>
              <td>{payment.paymentMethod}</td>
              <td>
                <button
                  onClick={() => handlePaymentClick(payment)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePayment(payment.paymentId)}
                  className="button-danger"
                >
                  Delete
                </button>
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

      {/* select */}
      {selectedPayment && (
        <div className="create-brand-modal">
          <h2>Edit Payment</h2>
          <input
            type="text"
            id="invoiceId"
            name="invoiceId"
            placeholder="Invoice ID"
            value={payment.invoiceId}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="transactionId"
            name="transactionId"
            placeholder="Transaction ID"
            value={payment.transactionId}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentDate"
            name="paymentDate"
            placeholder="Payment Date"
            value={payment.paymentDate}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="amount"
            name="amount"
            placeholder="Amount"
            value={payment.amount}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentStatus"
            name="paymentStatus"
            placeholder="Payment Status"
            value={payment.paymentStatus}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            placeholder="Payment Method"
            value={payment.paymentMethod}
            onChange={handleInputChange}
          />

          <button onClick={handleEditPayment}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-brand-modal">
          <h2>Create Brand</h2>
          <input
            type="text"
            id="invoiceId"
            name="invoiceId"
            placeholder="Invoice ID"
            value={payment.invoiceId}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="transactionId"
            name="transactionId"
            placeholder="Transaction ID"
            value={payment.transactionId}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentDate"
            name="paymentDate"
            placeholder="Payment Date"
            value={payment.paymentDate}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="amount"
            name="amount"
            placeholder="Amount"
            value={payment.amount}
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentStatus"
            name="paymentStatus"
            placeholder="Payment Status"
            value={
              payment.paymentStatus
            }
            onChange={handleInputChange}
          />

          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            placeholder="Payment Method"
            value={payment.paymentMethod}
            onChange={handleInputChange}
          />

          <button onClick={handleCreateBrand}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

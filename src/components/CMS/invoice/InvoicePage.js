import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InvoicePage.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState({
    salesOrderId: null,
    issueDate: "",
    dueDate: null,
    itemsTotal: 0,
    itemsDiscount: 0,
    subTotal: 0,
    taxAmount: 0,
    shippingAmount: 0,
    totalAmount: 0,
    paidStatus: "UNPAID", // Set the initial paidStatus value as needed
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    // Fetch all Invoices when the component mounts
    fetchInvoices();
  }, []);

  useEffect(() => {
    // Update filteredBrands whenever Invoices change
    if (searchId === "" && !selectedInvoice) {
      setFilteredInvoices(invoices);
    }
  }, [invoices, searchId, selectedInvoice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  // get all
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/invoices/all`
      );
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching Invoices:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedInvoices = filteredInvoices.slice(
    offset,
    offset + itemsPerPage
  );

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedInvoice(false);
  };

  const handleInvoiceClick = (selectedInvoice) => {
    setSelectedInvoice(selectedInvoice);
    setInvoice(selectedInvoice);
  };

  const handleEditInvoice = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/invoices/${selectedInvoice.invoiceId}`,
        invoice
      );
      fetchInvoices();
      setSelectedInvoice(null);
      setInvoice([]);
    } catch (error) {
      console.error("Error updating Invoice:", error);
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/invoices/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting Invoice:", error);
    }
  };

  // create Invoice
  const handleShowCreateModal = () => {
    setInvoice([]);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateInvoice = async () => {
    console.log("***Create:", invoice);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/invoices`, invoice);
      fetchInvoices();
      setInvoice([]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating Invoice:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/invoices/${searchId}`
      );
      const foundInvoice = response.data;

      if (foundInvoice) {
        // Display only the matched Invoice in the table
        setFilteredInvoices([foundInvoice]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered Invoices and indicate that the search is not active
        setFilteredInvoices([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching Invoice by ID:", error);
      setFilteredInvoices([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="invoice-container">
      <div className="header-row">
        <h1>Invoice List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Invoice</button>
      </div>

      <table className="invoice-table">
        {/* <table className="sales-order-table"> */}
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Sales Order ID</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Items Total</th>
            <th>Items Discount</th>
            <th>Subtotal</th>
            <th>Tax Amount</th>
            <th>Shipping Amount</th>
            <th>Total Amount</th>
            <th>Paid Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.salesOrderId}</td>
              <td>{invoice.issueDate}</td>
              <td>{invoice.dueDate}</td>
              <td>{invoice.itemsTotal.toFixed(2)}</td>
              <td>
                {invoice.itemsDiscount ? invoice.itemsDiscount.toFixed(2) : ""}
              </td>
              <td>{invoice.subTotal.toFixed(2)}</td>
              <td>{invoice.taxAmount ? invoice.taxAmount.toFixed(2) : ""}</td>
              <td>
                {invoice.shippingAmount
                  ? invoice.shippingAmount.toFixed(2)
                  : ""}
              </td>
              <td>{invoice.totalAmount.toFixed(2)}</td>
              <td>{invoice.paidStatus}</td>
              <td>
                <button
                  onClick={() => handleInvoiceClick(invoice)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteInvoice(invoice.salesOrderId)}
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
      {selectedInvoice && (
        <div className="create-invoice-modal">
          <h2>Edit Invoice</h2>
          <div className="input-columns">
            <div className="column">
              <input
                type="text"
                name="salesOrderId"
                placeholder="Sales Order ID"
                value={invoice.salesOrderId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="issueDate"
                placeholder="Issue Date"
                value={invoice.issueDate}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="dueDate"
                placeholder="Due Date"
                value={invoice.dueDate}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="itemsTotal"
                placeholder="Items Total"
                value={invoice.itemsTotal}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="itemsDiscount"
                placeholder="Items Discount"
                value={invoice.itemsDiscount}
                onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <input
                type="text"
                name="subTotal"
                placeholder="Subtotal"
                value={invoice.subTotal}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="taxAmount"
                placeholder="Tax Amount"
                value={invoice.taxAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="shippingAmount"
                placeholder="Shipping Amount"
                value={invoice.shippingAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="totalAmount"
                placeholder="Total Amount"
                value={invoice.totalAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="paidStatus"
                placeholder="Paid Status"
                value={invoice.paidStatus}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button onClick={handleEditInvoice}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-invoice-modal">
          <h2>Create Invoice</h2>
          <div className="input-columns">
            <div className="column">
              <input
                type="text"
                name="salesOrderId"
                placeholder="Sales Order ID"
                value={invoice.salesOrderId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="issueDate"
                placeholder="Issue Date"
                value={invoice.issueDate}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="dueDate"
                placeholder="Due Date"
                value={invoice.dueDate}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="itemsTotal"
                placeholder="Items Total"
                value={invoice.itemsTotal}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="itemsDiscount"
                placeholder="Items Discount"
                value={invoice.itemsDiscount}
                onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <input
                type="text"
                name="subTotal"
                placeholder="Subtotal"
                value={invoice.subTotal}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="taxAmount"
                placeholder="Tax Amount"
                value={invoice.taxAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="shippingAmount"
                placeholder="Shipping Amount"
                value={invoice.shippingAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="totalAmount"
                placeholder="Total Amount"
                value={invoice.totalAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="paidStatus"
                placeholder="Paid Status"
                value={invoice.paidStatus}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button onClick={handleCreateInvoice}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;

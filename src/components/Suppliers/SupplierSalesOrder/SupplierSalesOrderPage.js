import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupplierSalesOrderPage.css";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const SupplierSalesOrderPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesOrder, setSalesOrder] = useState({
    salesOrderSn: "",
    customerId: null,
    orderDate: new Date(), // You can replace with the initial date value
    totalAmount: 0.0, // You can replace with the initial value
    shippingAddress: "",
    billingAddress: "",
    orderStatus: "PENDING", // You can replace with the initial status value
    paymentMethod: "",
  });

  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 20; // Number of items to display per page

  const { supplierId } = useParams();

  // generate a random SalesOrderSn
  function generateSalesOrderSn() {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Generate a random number (adjust range as needed)

    // Combine timestamp and random number to create the serial number
    const salesOrderSn = `SO-${timestamp}-${randomPart}`;

    return salesOrderSn;
  }
  
  useEffect(() => {
    // Fetch all SalesOrders when the component mounts
    fetchBrands();
  }, []);

  useEffect(() => {
    // Update filteredBrands whenever SalesOrders change
    if (searchId === "" && !selectedSalesOrder) {
      setFilteredSalesOrders(salesOrders);
    }
  }, [salesOrders, searchId, selectedSalesOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalesOrder((prevSalesOrder) => ({
      ...prevSalesOrder,
      [name]: value,
    }));
  };

  // get all
  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/salesOrders/${supplierId}/all`
      );
      setSalesOrders(response.data);
    } catch (error) {
      console.error("Error fetching salesOrders:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredSalesOrders.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedSalesOrders = filteredSalesOrders.slice(
    offset,
    offset + itemsPerPage
  );

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedSalesOrder(false);
  };

  const handleSalesOrderClick = (selectedSalesOrder) => {
    setSelectedSalesOrder(selectedSalesOrder);
    setSalesOrder(selectedSalesOrder);
  };

  const handleEditBrand = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}api/v1/suppliers/salesOrders/${supplierId}/${selectedSalesOrder.salesOrderId}`,
        salesOrder
      );
      fetchBrands();
      setSelectedSalesOrder(null);
      setSalesOrder();
    } catch (error) {
      console.error("Error updating SalesOrder:", error);
    }
  };

  const handleDeleteSalesOrder = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/suppliers/salesOrders/${supplierId}/${id}`);
      fetchBrands();
    } catch (error) {
      console.error("Error deleting SalesOrder:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/suppliers/salesOrders/${supplierId}/${searchId}`
      );
      const foundSalesOrder = response.data;

      if (foundSalesOrder) {
        // Display only the matched SalesOrder in the table
        setFilteredSalesOrders([foundSalesOrder]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered SalesOrders and indicate that the search is not active
        setFilteredSalesOrders([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching SalesOrder by ID:", error);
      setFilteredSalesOrders([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="product-container">
      <div className="header-row">
        <h1>SalesOrder List</h1>

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

      <table className="product-table">
        {/* <table className="sales-order-table"> */}
        <thead>
          <tr>
            <th>Sales Order ID</th>
            <th>Sales Order SN</th>
            <th>Customer ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Shipping Address</th>
            <th>Billing Address</th>
            <th>Order Status</th>
            <th>Payment Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSalesOrders.map((salesOrder) => (
            <tr key={salesOrder.salesOrderId}>
              <td>{salesOrder.salesOrderId}</td>
              <td>{salesOrder.salesOrderSn}</td>
              <td>{salesOrder.customerId}</td>
              <td>{salesOrder.orderDate}</td>
              <td>{salesOrder.totalAmount.toFixed(2)}</td>
              <td>{salesOrder.shippingAddress}</td>
              <td>{salesOrder.billingAddress}</td>
              <td>{salesOrder.orderStatus}</td>
              <td>{salesOrder.paymentMethod}</td>
              <td className="td-button">
                <button
                  onClick={() => handleSalesOrderClick(salesOrder)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSalesOrder(salesOrder.salesOrderId)}
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
      {selectedSalesOrder && (
        <div className="create-salesOrder-modal">
          <h2>Edit SalesOrder</h2>
          <input
            type="text"
            name="salesOrderSn"
            placeholder="Sales Order SN"
            value={salesOrder.salesOrderSn}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="customerId"
            placeholder="Customer ID"
            value={salesOrder.customerId}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="orderDate"
            placeholder="Order Date"
            value={salesOrder.orderDate}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="totalAmount"
            placeholder="Total Amount"
            value={salesOrder.totalAmount}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="shippingAddress"
            placeholder="Shipping Address"
            value={salesOrder.shippingAddress}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="billingAddress"
            placeholder="Billing Address"
            value={salesOrder.billingAddress}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="orderStatus"
            placeholder="Order Status"
            value={salesOrder.orderStatus}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="paymentMethod"
            placeholder="Payment Details"
            value={salesOrder.paymentMethod}
            onChange={handleInputChange}
          />
          <button onClick={handleEditBrand}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

    </div>
  );
};

export default SupplierSalesOrderPage;

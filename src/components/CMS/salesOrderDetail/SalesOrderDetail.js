import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalesOrderDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const SalesOrderDetailPage = () => {
  const [salesOrderDetails, setSalesOrderDetails] = useState([]);
  const [salesOrderDetail, setSalesOrderDetail] = useState({
    salesOrderSn: null,
    skuCode: null,
    quantity: 0,
    unitPrice: 0.0,
    lineTotal: 0.0,
  });
  const [selectedSalesOrderDetail, setSelectedSalesOrderDetail] =
    useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredSalesOrderDetails, setFilteredSalesOrderDetails] = useState(
    []
  );
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 20; // Number of items to display per page

  // generate a random SalesOrderSn
  function generateSalesOrderSn() {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Generate a random number (adjust range as needed)

    // Combine timestamp and random number to create the serial number
    const salesOrderSn = `SO-${timestamp}-${randomPart}`;

    return salesOrderSn;
  }

  useEffect(() => {
    // Fetch all SalesOrderDetails when the component mounts
    fetchSalesOrderDetails();
  }, []);

  useEffect(() => {
    // Update filteredSalesOrderDetails whenever salesOrderDetails change
    if (searchId === "" && !selectedSalesOrderDetail) {
      setFilteredSalesOrderDetails(salesOrderDetails);
    }
  }, [salesOrderDetails, searchId, selectedSalesOrderDetail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalesOrderDetail((prevSalesOrderDetail) => ({
      ...prevSalesOrderDetail,
      [name]: value,
    }));
  };

  // get all
  const fetchSalesOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails/all`
      );
      setSalesOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching salesOrderDetails:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredSalesOrderDetails.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedSalesOrderDetails = filteredSalesOrderDetails.slice(
    offset,
    offset + itemsPerPage
  );

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedSalesOrderDetail(false);
  };

    const handleSalesOrderDetailClick = (selectedSalesOrderDetail) => {
    setSelectedSalesOrderDetail(selectedSalesOrderDetail);
    setSalesOrderDetail(selectedSalesOrderDetail);
  };

  const handleEditSalesOrderDetail = async () => {
    console.log("***Update: ", selectedSalesOrderDetail)
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails/${selectedSalesOrderDetail.salesOrderDetailId}`,
        salesOrderDetail
      );
      fetchSalesOrderDetails();
      setSelectedSalesOrderDetail(null);
      setSalesOrderDetail([]);
    } catch (error) {
      console.error("Error updating salesOrderDetail:", error);
    }
  };

  const handleDeleteSalesOrderDetail = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails/${id}`
      );
      fetchSalesOrderDetails();
    } catch (error) {
      console.error("Error deleting salesOrderDetail:", error);
    }
  };

  // create SalesOrderDetails
  const handleShowCreateModal = () => {
    setSalesOrderDetail([]);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSalesOrderDetail = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails`,
        salesOrderDetail
      );
      fetchSalesOrderDetails();
      setSalesOrderDetail([]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating SalesOrderDetail:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/salesOrderDetails/${searchId}`
      );
      const foundSalesOrderDetail = response.data;

      if (foundSalesOrderDetail) {
        // Display only the matched salesOrderDetail in the table
        setFilteredSalesOrderDetails([foundSalesOrderDetail]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered salesOrderDetails and indicate that the search is not active
        setFilteredSalesOrderDetails([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching salesOrderDetail by ID:", error);
      setFilteredSalesOrderDetails([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="salesOrderDetail-container">
      <div className="header-row">
        <h1>SalesOrderDetails List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create SalesOrderDetail</button>
      </div>

      <table className="salesOrderDetail-table">
        {/* <table className="sales-order-table"> */}
        <thead>
          <tr>
            <th>Sales Order Detail ID</th>
            <th>Sales Order Sn</th>
            <th>SKU Code</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Line Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSalesOrderDetails.map((salesOrderDetail) => (
            <tr key={salesOrderDetail.salesOrderDetailId}>
              <td>{salesOrderDetail.salesOrderDetailId}</td>
              <td>{salesOrderDetail.salesOrderSn}</td>
              <td>{salesOrderDetail.skuCode}</td>
              <td>{salesOrderDetail.quantity}</td>
              <td>{salesOrderDetail.unitPrice.toFixed(2)}</td>
              <td>{salesOrderDetail.lineTotal.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => handleSalesOrderDetailClick(salesOrderDetail)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDeleteSalesOrderDetail(salesOrderDetail.salesOrderId)
                  }
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
      {selectedSalesOrderDetail && (
        <div className="create-salesOrderDetail-modal">
          <h2>Edit SalesOrderDetail</h2>
          <input
            type="text"
            id="salesOrderSn"
            name="salesOrderSn"
            placeholder="Enter salesOrderSn"
            value={salesOrderDetail.salesOrderSn}
            readOnly
          />
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            placeholder="Enter skuCode"
            value={salesOrderDetail.skuCode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="quantity"
            name="quantity"
            placeholder="Enter Quantity"
            value={salesOrderDetail.quantity}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="unitPrice"
            name="unitPrice"
            placeholder="Enter Unit Price"
            value={salesOrderDetail.unitPrice}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="lineTotal"
            name="lineTotal"
            placeholder="Enter Line Total"
            value={salesOrderDetail.lineTotal}
            onChange={handleInputChange}
          />
          <button onClick={handleEditSalesOrderDetail}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-salesOrderDetail-modal">
          <h2>Create SalesOrderDetails</h2>
          <input
            type="text"
            id="salesOrderSn"
            name="salesOrderSn"
            placeholder="Enter salesOrderSn"
            value={generateSalesOrderSn()}
            readOnly
          />
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            placeholder="Enter skuCode"
            value={salesOrderDetail.skuCode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="quantity"
            name="quantity"
            placeholder="Enter Quantity"
            value={salesOrderDetail.quantity}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="unitPrice"
            name="unitPrice"
            placeholder="Enter Unit Price"
            value={salesOrderDetail.unitPrice}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="lineTotal"
            name="lineTotal"
            placeholder="Enter Line Total"
            value={salesOrderDetail.lineTotal}
            onChange={handleInputChange}
          />
          <button onClick={handleCreateSalesOrderDetail}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SalesOrderDetailPage;

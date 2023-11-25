import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupplierPage.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({
    supplierName: "",
    contactInfo: "",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    // Fetch all suppliers when the component mounts
    fetchSuppliers();
  }, []);

  useEffect(() => {
    // Update filteredSuppliers whenever suppliers change
    if (searchId === "" && !selectedSupplier) {
      setFilteredSuppliers(suppliers);
    }
  }, [suppliers, searchId, selectedSupplier]);

  // Function to update state for each input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      [name]: value,
    }));
  };

  // get all
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9001/api/v1/suppliers/all"
      );
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedSuppliers = filteredSuppliers.slice(
    offset,
    offset + itemsPerPage
  );

  // edit & delete
  const handleSupplierClick = (selectedSupplier) => {
    console.log("***selectedSupplier: ", selectedSupplier);
    setSelectedSupplier(selectedSupplier);
    setSupplier({
      supplierName: selectedSupplier.supplierName,
      contactInfo: selectedSupplier.contactInfo,
    });
  };

  const handleEditSupplier = async () => {
    console.log("***Edit supplier: ", supplier);
    try {
      await axios.put(
        `http://localhost:9001/api/v1/suppliers/${selectedSupplier.supplierId}`,
        supplier
      );
      fetchSuppliers();
      setSelectedSupplier(null);
      setSupplier({ supplierName: "", contactInfo: "" });
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`http://localhost:9001/api/v1/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // create supplier
  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateSupplier = async () => {
    try {
      await axios.post("http://localhost:9001/api/v1/suppliers", supplier);
      fetchSuppliers();
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9001/api/v1/suppliers/${searchId}`
      );
      const foundSupplier = response.data;

      if (foundSupplier) {
        // Display only the matched supplier in the table
        setFilteredSuppliers([foundSupplier]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered suppliers and indicate that the search is not active
        setFilteredSuppliers([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching suppliers by ID:", error);
      setFilteredSuppliers([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="supplier-container">
      <div className="header-row">
        <h1>Supplier List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Supplier</button>
      </div>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Contact Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSuppliers.map((supplier) => (
            <tr key={supplier.supplierId}>
              <td>{supplier.supplierId}</td>
              <td>{supplier.supplierName}</td>
              <td>{supplier.contactInfo}</td>
              <td>
                <button
                  onClick={() => handleSupplierClick(supplier)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSupplier(supplier.supplierId)}
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
      {selectedSupplier && (
        <div className="create-supplier-modal">
          <h2>Edit Supplier</h2>
          <input
            type="text"
            name="supplierName"
            placeholder="Supplier name"
            value={supplier.supplierName}
            // onChange={(e) => setSupplier({ supplierName: e.target.value })}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Supplier Contact Info"
            value={supplier.contactInfo}
            // onChange={(e) => setSupplier({ contactInfo: e.target.value })}
            onChange={handleChange}
          />
          <button onClick={handleEditSupplier}>Update</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-supplier-modal">
          <h2>Create Supplier</h2>
          <input
            type="text"
            name="supplierName"
            placeholder="Supplier name"
            value={supplier.supplierName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Supplier contactInfo"
            value={supplier.contactInfo}
            onChange={handleChange}
          />
          <button onClick={handleCreateSupplier}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SupplierPage;

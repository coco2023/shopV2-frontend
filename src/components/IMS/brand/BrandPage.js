import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BrandPage.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState({ name: "" });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    // Fetch all brands when the component mounts
    fetchBrands();
  }, []);

  useEffect(() => {
    // Update filteredBrands whenever brands change
    if (searchId === "" && !selectedBrand) {
      setFilteredBrands(brands);
    }
  }, [brands, searchId, selectedBrand]);

  // get all
  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/brands/all`
      );
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredBrands.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedBrands = filteredBrands.slice(offset, offset + itemsPerPage);

  // edit & delete
    const handleCloseEditModal = () => {
      setSelectedBrand(false);
    };
  
  const handleBrandClick = (selectedBrand) => {
    setSelectedBrand(selectedBrand);
    setBrand({ name: selectedBrand.brandName }); // Initialize the input with the selected brand's name
  };

  const handleEditBrand = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/brands/${selectedBrand.brandId}`,
        { brandName: brand.name }
      );
      fetchBrands();
      setSelectedBrand(null);
      setBrand({ name: "" });
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/brands/${id}`);
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  // create brand
  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateBrand = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/brands`, {
        brandName: brand.name,
      });
      fetchBrands();
      setBrand({ name: "" });
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/brands/${searchId}`
      );
      const foundBrand = response.data;

      if (foundBrand) {
        // Display only the matched brand in the table
        setFilteredBrands([foundBrand]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered brands and indicate that the search is not active
        setFilteredBrands([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching brand by ID:", error);
      setFilteredBrands([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="brand-container">
      <div className="header-row">
        <h1>Brand List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Brand</button>
      </div>

      <table className="brand-table">
        <thead>
          <tr>
            <th>Brand ID</th>
            <th>Brand Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBrands.map((brand) => (
            <tr key={brand.brandId}>
              <td>{brand.brandId}</td>
              <td>{brand.brandName}</td>
              <td>
                <button
                  onClick={() => handleBrandClick(brand)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBrand(brand.brandId)}
                  className="button-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <tbody>
          {isSearchActive
            ? paginatedBrands.map((brand) => (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>{brand.brandName}</td>
                  <td>
                    <button
                      onClick={() => handleBrandClick(brand)}
                      className="button-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.brandId)}
                      className="button-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            : brands.map((brand) => (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>{brand.brandName}</td>
                  <td>
                    <button
                      onClick={() => handleBrandClick(brand)}
                      className="button-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.brandId)}
                      className="button-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table> */}

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
      {selectedBrand && (
        <div className="create-brand-modal">
          <h2>Edit Brand</h2>
          <input
            type="text"
            placeholder="Brand name"
            value={brand.name}
            onChange={(e) => setBrand({ name: e.target.value })}
          />
          <button onClick={handleEditBrand}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-brand-modal">
          <h2>Create Brand</h2>
          <input
            type="text"
            placeholder="Brand name"
            value={brand.name}
            onChange={(e) => setBrand({ name: e.target.value })}
          />
          <button onClick={handleCreateBrand}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BrandPage;

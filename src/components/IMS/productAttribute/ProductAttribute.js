import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductAttribute.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const ProductAttributePage = () => {
  const [productAttributes, setProductAttributes] = useState([]);
  const [productAttribute, setProductAttribute] = useState({
    productId: null, 
    skuCode: "",
    attributeName: "",
    attributeValue: "",
  });
  const [selectedProductAttribute, setSelectedProductAttribute] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchId2, setSearchId2] = useState("");
  const [filteredProductAttributes, setFilteredProductAttributes] = useState([]);
  const [isSearchActive1, setIsSearchActive1] = useState(false);
  const [isSearchActive2, setIsSearchActive2] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 20; // Number of items to display per page

  useEffect(() => {
    // Fetch all ProductAttribute when the component mounts
    fetchProductAttributes();
  }, []);

  useEffect(() => {
    // Update FilteredProductAttributes whenever productAttributes change
    if (searchId === "" && !selectedProductAttribute) {
      setFilteredProductAttributes(productAttributes);
    }
    if (searchId2 === "" && !selectedProductAttribute) {
      setFilteredProductAttributes(productAttributes);
    }
  }, [productAttributes, searchId, selectedProductAttribute, searchId2]);

  // You can also create a function to handle changes in the productAttribute state
  const handleAttributeInputChange = (event) => {
    const { name, value } = event.target;
    setProductAttribute({
      ...productAttribute,
      [name]: value,
    });
  };

  // get all
  const fetchProductAttributes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/all`
      );
      setProductAttributes(response.data);
    } catch (error) {
      console.error("Error fetching ProductAttributes:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredProductAttributes.length / itemsPerPage);

  const paginatedProductAttributes = filteredProductAttributes.slice(offset, offset + itemsPerPage);

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedProductAttribute(false);
  };

  const handleProductAttributeClick = (selectedProductAttribute) => {
    setSelectedProductAttribute(selectedProductAttribute);
    setProductAttribute(selectedProductAttribute); 
  };

  const handleEditProductAttribute = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${selectedProductAttribute.attributeId}`, productAttribute
      );
      fetchProductAttributes();
      setSelectedProductAttribute(null);
      setProductAttribute();
    } catch (error) {
      console.error("Error updating ProductAttribute:", error);
    }
  };

  const handleDeleteProductAttribute = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${id}`
      );
      fetchProductAttributes();
    } catch (error) {
      console.error("Error deleting ProductAttribute:", error);
    }
  };

  // create ProductAttribute
  const handleShowCreateModal = () => {
    setProductAttribute([]);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateProductAttribute = async () => {
    console.log("***Create: ", productAttribute)
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/productAttributes`, productAttribute);
      fetchProductAttributes();
      setProductAttribute();
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating ProductAttribute:", error);
    }
  };

  // search by attributeId
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${searchId}`
      );
      const foundProductAttribute = response.data;
      console.log("***searchByAttributeId: " + foundProductAttribute)

      if (foundProductAttribute) {
        setFilteredProductAttributes([foundProductAttribute]);
        setIsSearchActive1(true);
      } else {
        setFilteredProductAttributes([]);
        setIsSearchActive1(false);
      }
    } catch (error) {
      console.error("Error fetching productAttribute by ID:", error);
      setFilteredProductAttributes([]);
      setIsSearchActive1(false);
    }
  };

    // search by productId
    const handleSearchbyProductId = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${searchId2}/attributes`
        );
        const foundProductAttribute = response.data;
        console.log("***searchByProductId: " + foundProductAttribute)
  
        if (foundProductAttribute && foundProductAttribute.length > 0) {
          setFilteredProductAttributes([foundProductAttribute]);
          setIsSearchActive2(true);
        } else {
          setFilteredProductAttributes([]);
          setIsSearchActive2(false);
        }
      } catch (error) {
        console.error("Error fetching productAttribute by ID:", error);
        setFilteredProductAttributes([]);
        setIsSearchActive2(false);
      }
    };  

  return (
    <div className="product-container">
      <div className="header-row">
        <h1>Product-Attribute List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by AttributeID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ProductId"
            value={searchId2}
            onChange={(e) => setSearchId2(e.target.value)}
          />
          <button onClick={handleSearchbyProductId}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Product-Attribute</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Attribute ID</th>
            <th>Product ID</th>
            <th>SKU Code</th>
            <th>Attribute Name</th>
            <th>Attribute Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductAttributes.flat().map((item) => (
            <tr key={item.attributeId}>
              <td>{item.attributeId}</td>
              <td>{item.productId}</td>
              <td>{item.skuCode}</td>
              <td>{item.attributeName}</td>
              <td>{item.attributeValue}</td>
              <td>
                <button
                  onClick={() => handleProductAttributeClick(item)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProductAttribute(item.attributeId)}
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
      {selectedProductAttribute && (
        <div className="create-productAttribute-modal">
          <h2>Edit Product-Attribute</h2>
          <input
            type="text"
            id="productId"
            name="productId"
            placeholder="Enter Product ID"
            value={productAttribute.productId}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            placeholder="Enter SKU Code"
            value={productAttribute.skuCode}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="attributeName"
            name="attributeName"
            placeholder="Enter Attribute Name"
            value={productAttribute.attributeName}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="attributeValue"
            name="attributeValue"
            placeholder="Enter Attribute Value"
            value={productAttribute.attributeValue}
            onChange={handleAttributeInputChange}
          />
          <button onClick={handleEditProductAttribute}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-productAttribute-modal">
          <h2>Create Product-Attribute</h2>
          <input
            type="text"
            id="productId"
            name="productId"
            placeholder="Enter Product ID"
            value={productAttribute.productId}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            placeholder="Enter SKU Code"
            value={productAttribute.skuCode}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="attributeName"
            name="attributeName"
            placeholder="Enter Attribute Name"
            value={productAttribute.attributeName}
            onChange={handleAttributeInputChange}
          />
          <input
            type="text"
            id="attributeValue"
            name="attributeValue"
            placeholder="Enter Attribute Value"
            value={productAttribute.attributeValue}
            onChange={handleAttributeInputChange}
          />
          <button onClick={handleCreateProductAttribute}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ProductAttributePage;

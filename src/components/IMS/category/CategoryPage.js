import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryPage.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    // Fetch all categories when the component mounts
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update filteredCategories whenever Categories change
    if (searchId === "" && !selectedCategory) {
      setFilteredCategories(categories);
    }
  }, [categories, searchId, selectedCategory]);

  // get all
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/categories/all`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedCategories = filteredCategories.slice(
    offset,
    offset + itemsPerPage
  );

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedCategory(false);
  };

  const handleCategoryClick = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
    setCategory({ name: selectedCategory.categoryName }); // Initialize the input with the selected category's name
  };

  const handleEditCategory = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/categories/${selectedCategory.categoryId}`,
        { categoryName: category.name }
      );
      fetchCategories();
      setSelectedCategory(null);
      setCategory({ name: "" });
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  // create category
  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/categories`, {
        categoryName: category.name,
      });
      fetchCategories();
      setCategory({ name: "" });
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating categories:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/categories/${searchId}`
      );
      const foundCategory = response.data;

      if (foundCategory) {
        // Display only the matched category in the table
        setFilteredCategories([foundCategory]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered categories and indicate that the search is not active
        setFilteredCategories([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching categorie by ID:", error);
      setFilteredCategories([]);
      setIsSearchActive(false);
    }
  };

  return (
    <div className="category-container">
      <div className="header-row">
        <h1>Category List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Category</button>
      </div>
      
      <table className="category-table">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.categoryName}</td>
              <td>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.categoryId)}
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
      {selectedCategory && (
        <div className="create-category-modal">
          <h2>Edit Category</h2>
          <input
            type="text"
            placeholder="Category name"
            value={category.name}
            onChange={(e) => setCategory({ name: e.target.value })}
          />
          <button onClick={handleEditCategory}>Update</button>
          <button onClick={handleCloseEditModal}>Cancel</button>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-category-modal">
          <h2>Create Category</h2>
          <input
            type="text"
            placeholder="Category name"
            value={category.name}
            onChange={(e) => setCategory({ name: e.target.value })}
          />
          <button onClick={handleCreateCategory}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

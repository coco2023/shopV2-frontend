import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Product.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactPaginate from "react-paginate";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [product, setProduct] = useState({
    productName: "",
    skuCode: "",
    categoryId: null, // Replace with the initial value or leave it as null
    categoryName: "",
    brandId: null, // Replace with the initial value or leave it as null
    brandName: "",
    supplierId: null, // Replace with the initial value or leave it as null
    supplierName: "",
    description: "",
    price: 0.0, // Replace with the initial value
    discount: 0.0,
    finalPrice: 0.0,
    rating: 0.0,
    salesAmount: 0,
    imageUrl: "",
    stockQuantity: 0, // Replace with the initial value
    stockStatus: "IN_STOCK", // Replace with the initial status value
    shippingInfo: "",
    lastStockUpdate: new Date(),
  });
  const [productAttribute, setProductAttribute] = useState({
    productId: null, 
    skuCode: "",
    attributeName: "",
    attributeValue: "",
  });
  const [showAttributeCreateModal, setShowAttributeCreateModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const itemsPerPage = 20; // Number of items to display per page

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedProducts = filteredProducts.slice(
    offset,
    offset + itemsPerPage
  );
    
  useEffect(() => {
    // Fetch all products when the component mounts
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update filteredProducts whenever products change
    if (searchId === "" && !selectedProduct) {
      setFilteredProducts(products);
    }
  }, [products, searchId, selectedProduct]);

  // Function to update state for each input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // get all
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/products/all`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedProduct(false);
  };

  const handleProductClick = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setProduct(selectedProduct);
  };

  const handleEditProduct = async () => {
    console.log("***update: ", product);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/products/${selectedProduct.productId}`,
        product
      );
      fetchProducts();
      setSelectedProduct(null);
      setProduct();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // create product
  const handleShowCreateModal = () => {
    setProduct([]);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setShowAttributeCreateModal(false);
  };

  const handleCreateProduct = async () => {
    console.log("***Create product: ", product);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/products`, product);
      fetchProducts();
      setProduct({});
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/products/${searchId}`
      );
      const foundProduct = response.data;

      if (foundProduct) {
        // Display only the matched product in the table
        setFilteredProducts([foundProduct]);
        setIsSearchActive(true);
      } else {
        // Clear the filtered products and indicate that the search is not active
        setFilteredProducts([]);
        setIsSearchActive(false);
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      setFilteredProducts([]);
      setIsSearchActive(false);
    }
  };

  // fetch Attributes
  const fetchAttributes = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${productId}/attributes`
      );
      return response.data; // assuming this endpoint returns the attributes
    } catch (error) {
      console.error("Error fetching attributes:", error);
      return []; // return empty array or handle error as needed
    } 
  };

  useEffect(() => {
    products.forEach(async (product) => {
      const attrs = await fetchAttributes(product.productId);
      if (Array.isArray(attrs)) {
        setAttributes(prev => ({ ...prev, [product.productId]: attrs }));
      } else {
        console.error("Expected an array for attributes:", attrs);
      }
    });
  }, [products]); // Run when products change

  // create ProductAttribute
  const handleShowCreateProductAttributesModal = (product) => {
    console.log("***product.productId: " + product.productId)
    setProductAttribute({
      productId: product.productId,
      skuCode: product.skuCode,
    });
    setShowAttributeCreateModal(true);
  };

  // a function to handle changes in the productAttribute state
  const handleAttributeInputChange = (event) => {
    const { name, value } = event.target;
    setProductAttribute({
      ...productAttribute,
      [name]: value,
    });
  };  
  
  // create ProductAttribute
  const handleCreateProductAttribute = async () => {
    console.log("***Create: ", productAttribute)
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/productAttributes`, productAttribute);

      console.log("url: " + process.env.REACT_APP_API_URL)
      setProductAttribute();
      handleCloseCreateModal();
      fetchProducts();
    } catch (error) {
      console.error("Error creating ProductAttribute:", error);
    }
  };
  
  return (
    <div className="product-container">
      <div className="header-row">
        <h1>Product List</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <button onClick={handleShowCreateModal}>Create Product</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>SKU Code</th>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th className="attributes-column">Attributes</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Final Price</th>
            <th>Rating</th>
            <th>SalesAmount</th>
            <th>Image URL</th>
            <th>Stock Quantity</th>
            <th>Stock Status</th>
            <th>Shipping Info</th>
            <th>Last Stock Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.productName}</td>
              <td>{product.skuCode}</td>
              <td>{product.categoryId}</td>
              <td>{product.categoryName}</td>
              <td>{product.brandId}</td>
              <td>{product.brandName}</td>
              <td>{product.supplierId}</td>
              <td>{product.supplierName}</td>
              <td className="attributes-column">
                {attributes[product.productId] ? (
                  attributes[product.productId].map((attribute) => (
                    <div key={attribute.attributeId}>
                      {attribute.attributeName}: {attribute.attributeValue}
                    </div>
                  ))
                ) : (
                  <div>Loading</div>
                )}
                <button className="button-secondary" onClick={() => handleShowCreateProductAttributesModal(product)}>Add</button>
              </td>
              <td>{product.description}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.discount}</td>
              <td>{product.finalPrice}</td>
              <td>{product.rating}</td>
              <td>{product.salesAmount}</td>
              <td>{product.imageUrl}</td>
              <td>{product.stockQuantity}</td>
              <td>{product.stockStatus}</td>
              <td>{product.shippingInfo}</td>
              <td>{product.lastStockUpdate}</td>
              <td className="td-button">
                <button
                  onClick={() => handleProductClick(product)}
                  className="button-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
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

      {/* update */}
      {selectedProduct && (
        <div className="create-product-modal">
          <div>
            <h2>Edit Product</h2>
          </div>
          <div className="input-columns">
            <div className="column">
              <input
                type="text"
                id="productName"
                name="productName"
                placeholder="Enter Product Name"
                value={product.productName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="skuCode"
                name="skuCode"
                placeholder="Enter SKU Code"
                value={product.skuCode}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryId"
                name="categoryId"
                placeholder="Enter Category ID"
                value={product.categoryId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryName"
                name="categoryName"
                placeholder="Enter Category Name"
                value={product.categoryName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandId"
                name="brandId"
                placeholder="Enter Brand ID"
                value={product.brandId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter Brand Name"
                value={product.brandName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierId"
                name="supplierId"
                placeholder="Enter Supplier ID"
                value={product.supplierId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierName"
                name="supplierName"
                placeholder="Enter Supplier Name"
                value={product.supplierName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter Description"
                value={product.description}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="price"
                name="price"
                placeholder="Enter Price"
                value={product.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="Enter discount"
                value={product.discount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="finalPrice"
                name="finalPrice"
                placeholder="Enter final Price"
                value={product.finalPrice}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="rating"
                name="rating"
                placeholder="Enter rating"
                value={product.rating}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="salesAmount"
                name="salesAmount"
                placeholder="Enter salesAmount"
                value={product.salesAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter Image URL"
                value={product.imageUrl}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="Enter Stock Quantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockStatus"
                name="stockStatus"
                placeholder="Enter Stock Status"
                value={product.stockStatus}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="shippingInfo"
                name="shippingInfo"
                placeholder="Enter Shipping Info"
                value={product.shippingInfo}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="lastStockUpdate"
                name="lastStockUpdate"
                placeholder="Enter Last Stock Update"
                value={product.lastStockUpdate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button onClick={handleEditProduct}>Update</button>
            <button onClick={handleCloseEditModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-product-modal">
          <h2>Create Product</h2>
          <div className="input-columns">
            <div className="column">
              <input
                type="text"
                id="productName"
                name="productName"
                placeholder="productName"
                value={product.productName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="skuCode"
                name="skuCode"
                placeholder="Enter SKU Code"
                value={product.skuCode}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryId"
                name="categoryId"
                placeholder="Enter Category ID"
                value={product.categoryId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryName"
                name="categoryName"
                placeholder="Enter Category Name"
                value={product.categoryName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandId"
                name="brandId"
                placeholder="Enter Brand ID"
                value={product.brandId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter Brand Name"
                value={product.brandName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierId"
                name="supplierId"
                placeholder="Enter Supplier ID"
                value={product.supplierId}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierName"
                name="supplierName"
                placeholder="Enter Supplier Name"
                value={product.supplierName}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter Description"
                value={product.description}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="price"
                name="price"
                placeholder="Enter Price"
                value={product.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="Enter discount"
                value={product.discount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="finalPrice"
                name="finalPrice"
                placeholder="Enter final Price"
                value={product.finalPrice}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="rating"
                name="rating"
                placeholder="Enter rating"
                value={product.rating}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="salesAmount"
                name="salesAmount"
                placeholder="Enter salesAmount"
                value={product.salesAmount}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter Image URL"
                value={product.imageUrl}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="Enter Stock Quantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockStatus"
                name="stockStatus"
                placeholder="Enter Stock Status"
                value={product.stockStatus}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="shippingInfo"
                name="shippingInfo"
                placeholder="Enter Shipping Info"
                value={product.shippingInfo}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="lastStockUpdate"
                name="lastStockUpdate"
                placeholder="Enter Last Stock Update"
                value={product.lastStockUpdate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button onClick={handleCreateProduct}>Create</button>
          <button onClick={handleCloseCreateModal}>Cancel</button>
        </div>
      )}

       {/* create ProductAttributes */}
       {showAttributeCreateModal && (
        <div className="create-productAttribute-modal">
          <h2>Create Product-Attribute</h2>
          <input
            type="text"
            id="productId"
            name="productId"
            placeholder="Enter Product ID"
            value={productAttribute.productId}
            readOnly
            />
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            placeholder="Enter SKU Code"
            value={productAttribute.skuCode}
            readOnly
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

export default ProductPage;

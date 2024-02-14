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
    productImageIds: null
  });
  const [productAttribute, setProductAttribute] = useState({
    productId: null, 
    skuCode: "",
    attributeName: "",
    attributeValue: "",
  });
  const [showAttributeCreateModal, setShowAttributeCreateModal] = useState(false);

  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const [productsPerPage, setProductsPerPage] = useState(6); // 每页显示的产品数量
  const [pageCount, setPageCount] = useState(1); // 初始总页数设为1
  const itemsPerPage = 6; // Number of items to display per page
  const [totalPages, setTotalPages] = useState(0); // 用于存储后端返回的总页数

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
    
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
      const params = {
        page: currentPage, // 使用当前页码
        size: itemsPerPage, // 使用每页的项目数
      };  
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/products/main/all`,
        { params }
      );
      setProducts(response.data.content);
      setPageCount(response.data.totalPages); // 更新总页数
      // console.log("Params:", params);
      // console.log("Response data:", response.data);
      // console.log("Total pages set to:", response.data.totalPages);
      setTotalPages(response.data.totalPages); // 更新总页数

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 当组件挂载或currentPage/itemsPerPage更改时，获取产品
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]); // 当currentPage或itemsPerPage变化时重新获取产品
  
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileSelect = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleImageUpload = async (e) => {
    if (!selectedFiles) {
      console.error('No files selected');
      return;
    }

    const formData = new FormData();
    // Construct product details JSON string
    const productDetails = JSON.stringify(product);
    console.log("productDetails: " + productDetails)

    // Append product details to formData
    formData.append('product', productDetails);
    // Append selected files to formData
    for (let file of selectedFiles) {
      formData.append('newImages', file);
    }

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/products/${selectedProduct.productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset states
      setSelectedFiles(null);
      setSelectedProduct(null);
      fetchProducts();

    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  // fetch product images
  const fetchProductImage = async (productId, imageId) => {
    // Construct the URL to fetch the image
    const getImageUrl = `${process.env.REACT_APP_API_URL}/api/v1/products/${productId}/images/main/s3/img/${imageId}`;
    return getImageUrl; // Directly use the URL as image source in <img> tags
  };
    
  const handleProductClick = async (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setProduct(selectedProduct);
    const getImageUrls = await Promise.all(selectedProduct.productImageIds.map(id => 
      fetchProductImage(product.productId, id)
    ));
    setSelectedProductImages(getImageUrls);
  };

  useEffect(() => {
    console.log("SelectedProductImages: " + selectedProductImages); // Log to verify the update
  }, [selectedProductImages]); // This effect runs whenever selectedProductImages changes
  
  // edit & delete
  const handleCloseEditModal = () => {
    setSelectedProduct(false);
  };

  const handleEditProductWithImages = async (e) => {
    if (!selectedProduct) {
      console.error("No product selected");
      return;
    }
  
    const formData = new FormData();
  
    // Add product details to formData as a JSON string
    product.productImageIds = selectedProduct.productImageIds;
    const productDetails = JSON.stringify(product);
    formData.append('product', productDetails);
    console.log('product: ' + productDetails)
  
    // Append new images to formData if selectedFiles is not null
    if (selectedFiles) {
      for (let file of selectedFiles) {
        formData.append('newImages', file);
      }
    }
  
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/products/${selectedProduct.productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Log response or handle success (e.g., clear selected files, update UI, close modal)
      console.log("Product updated successfully:", response.data);      
  
      // Reset states
      setSelectedFiles(null);
      setSelectedProduct(null);
      fetchProducts();

    } catch (error) {
      console.error("Error updating product with images:", error);
    }
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

  const handleCreateProductWithImages = async (e) => {
    const formData = new FormData();

    // Convert product details object to a JSON string and append to formData
    const productDetails = JSON.stringify(product); // Assuming `product` state contains all the necessary product fields
    formData.append('product', productDetails);
    console.log(productDetails, product)
  
    // Append images to formData if any are selected
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(file => {
        formData.append('images', file);
      });
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Log the response or handle it as needed
      console.log("Product created successfully:", response.data);
  
      fetchProducts();
      setProduct({});
      setSelectedFiles(null);
  
    } catch (error) {
      console.error("Error creating product:", error);
    }  
  }
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
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          
          {products.map((product) => (
            <tr key={product.productId} onClick={() => handleProductClick(product)}> {/* show edit product when clicking the rows */}
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
              {/* <td className="td-button">
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
              </td>*/}
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
          // count={totalPages} page={currentPage + 1}
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

              <div>
                <div className="product-images">
                  {selectedProductImages.map((getImageUrls, index) => (
                    <img key={index} src={getImageUrls} alt={`Product ${index}`} className="product-image-thumbnail" />
                  ))}
                </div>
                <input type="file" multiple onChange={handleFileSelect} />
                <button onClick={() => handleEditProductWithImages(selectedProduct.productId)}>Upload</button>
              </div>

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
                value={product.skuCode || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryId"
                name="categoryId"
                placeholder="Enter Category ID"
                value={product.categoryId  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="categoryName"
                name="categoryName"
                placeholder="Enter Category Name"
                value={product.categoryName  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandId"
                name="brandId"
                placeholder="Enter Brand ID"
                value={product.brandId  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter Brand Name"
                value={product.brandName  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierId"
                name="supplierId"
                placeholder="Enter Supplier ID"
                value={product.supplierId  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="supplierName"
                name="supplierName"
                placeholder="Enter Supplier Name"
                value={product.supplierName  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter Description"
                value={product.description  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="price"
                name="price"
                placeholder="Enter Price"
                value={product.price  || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="column">
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="Enter discount"
                value={product.discount  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="finalPrice"
                name="finalPrice"
                placeholder="Enter final Price"
                value={product.finalPrice  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="rating"
                name="rating"
                placeholder="Enter rating"
                value={product.rating  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="salesAmount"
                name="salesAmount"
                placeholder="Enter salesAmount"
                value={product.salesAmount  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter Image URL"
                value={product.imageUrl  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="Enter Stock Quantity"
                value={product.stockQuantity  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="stockStatus"
                name="stockStatus"
                placeholder="Enter Stock Status"
                value={product.stockStatus  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="shippingInfo"
                name="shippingInfo"
                placeholder="Enter Shipping Info"
                value={product.shippingInfo  || ""}
                onChange={handleInputChange}
              />

              <input
                type="text"
                id="lastStockUpdate"
                name="lastStockUpdate"
                placeholder="Enter Last Stock Update"
                value={product.lastStockUpdate  || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button onClick={handleEditProductWithImages}>Update</button>
            <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  className="button-danger"
                >
                  Delete
            </button>
            <button onClick={handleCloseEditModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* create */}
      {showCreateModal && (
        <div className="create-product-modal">
          <div>
            <h2>Add Images</h2>
            <input type="file" multiple onChange={handleFileSelect} />
            {/* <button onClick={() => handleEditProductWithImages()}>Upload</button> */}
          </div>

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
          <button onClick={handleCreateProductWithImages}>Create</button>
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

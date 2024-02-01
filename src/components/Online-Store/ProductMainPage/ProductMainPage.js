import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard"; // Importing the ProductCard component
import "./ProductMainPage.css"; // Importing CSS for the main page layout

const ProductMainPage = () => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 20; // 4 columns * 6 rows

  useEffect(() => {
    loadMoreProducts(); // 初始加载
  }, []);

  const loadMoreProducts = async () => {
    try {
      // request for the products in the next page
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/main/all`, {
        params: {
          page: currentPage,
          size: productsPerPage,
        },
      });
      // Add products from the response to the visibleProductList
      // add products to the visibleProductList            
      // setVisibleProducts(prevProducts => [...prevProducts, ...response.data]);

      setVisibleProducts(prevProducts => [
        ...prevProducts,
        ...response.data.content // Assuming the product data is in the 'content' field
      ]);

      setCurrentPage(prevPage => prevPage + 1); // 更新当前页码，为下一次加载做准备
      // Update state with the new current page, but ensure not to exceed totalPages
      // This assumes the API returns the current page index in 'number' field and total pages in 'totalPages'
      const newPage = response.data.number + 1;
      setCurrentPage(newPage < response.data.totalPages ? newPage : currentPage);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div>
      <div className="product-main-page">
        {visibleProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
      <div className="load-more-container">
        <button className="load-more-btn" onClick={loadMoreProducts}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductMainPage;

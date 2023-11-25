import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard"; // Importing the ProductCard component
import "./ProductMainPage.css"; // Importing CSS for the main page layout

const ProductMainPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30; // 5 columns * 6 rows

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9001/api/v1/products/all"
        );
        setProducts(response.data);
        setVisibleProducts(response.data.slice(0, productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const nextProducts = products.slice(0, nextPage * productsPerPage);
    setVisibleProducts(nextProducts);
    setCurrentPage(nextPage);
  };

  return (
    <div>
      <div className="product-main-page">
        {visibleProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
      {visibleProducts.length < products.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMoreProducts}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductMainPage;

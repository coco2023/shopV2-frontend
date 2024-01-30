import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard"; // Importing the ProductCard component
import "./ProductMainPage.css"; // Importing CSS for the main page layout

const ProductMainPage = () => {
  const [products, setProducts] = useState([]);
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
      // add products to the visibleProductList
      setVisibleProducts(prevProducts => [...prevProducts, ...response.data]);
      setCurrentPage(prevPage => prevPage + 1); // 更新当前页码，为下一次加载做准备
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/v1/products/all`
  //       );
  //       setProducts(response.data);
  //       setVisibleProducts(response.data.slice(0, productsPerPage));
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // const loadMoreProducts = () => {
  //   const nextPage = currentPage + 1;
  //   const nextProducts = products.slice(0, nextPage * productsPerPage);
  //   setVisibleProducts(nextProducts);
  //   setCurrentPage(nextPage);
  // };

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
      {/* {visibleProducts.length < products.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMoreProducts}>
            Load More
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ProductMainPage;

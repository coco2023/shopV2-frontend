import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard"; // Importing the ProductCard component
import ProductCard2 from "../ProductCard/2hand/ProductCard2"; // Importing the ProductCard component
import ForumPage from "../Forum/ForumPage";
import "./ProductMainPage.css"; // Importing CSS for the main page layout

const ProductMainPage = () => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const productsPerPage = 20; // 4 columns * 6 rows

  const [activeTab, setActiveTab] = useState("shop"); // 'shop' or 'second-hand'

  useEffect(() => {
    loadMoreProducts(); // 初始加载
  }, []);

  const loadMoreProducts = async () => {
    try {
      // request for the products in the next page
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/products/main/all`,
        {
          params: {
            page: currentPage,
            size: productsPerPage,
          },
        }
      );
      // Add products from the response to the visibleProductList
      // add products to the visibleProductList
      // setVisibleProducts(prevProducts => [...prevProducts, ...response.data]);

      setVisibleProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.content, // Assuming the product data is in the 'content' field
      ]);

      setCurrentPage((prevPage) => prevPage + 1); // 更新当前页码，为下一次加载做准备
      // Update state with the new current page, but ensure not to exceed totalPages
      // This assumes the API returns the current page index in 'number' field and total pages in 'totalPages'
      // const newPage = response.data.number + 1;
      setTotalPage(response.data.totalPages);
      const newPage = response.data.number + 1;
      if (newPage >= response.data.totalPages) {
        console.log("reach to the end!!");
      }
      // setCurrentPage(newPage < response.data.totalPages ? newPage : currentPage);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "shop":
        return (
          <div className="product-main-page">
            {visibleProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
            {currentPage < totalPage && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={loadMoreProducts}>
                  Load More
                </button>
              </div>
            )}
          </div>
        );
      case "second-hand":
        return (
          <div className="product-main-page">
            {visibleProducts.map((product) => (
              <ProductCard2 key={product.productId} product={product} />
            ))}
            {currentPage < totalPage && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={loadMoreProducts}>
                  Load More
                </button>
              </div>
            )}
          </div>
        );
        case "forum":
          return (
            <div>
              <ForumPage />
            </div>
          );  
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div>
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === "shop" ? "active" : ""}`}
          onClick={() => setActiveTab("shop")}
        >
          Shop
        </button>
        <button
          className={`tab-btn ${activeTab === "second-hand" ? "active" : ""}`}
          onClick={() => setActiveTab("second-hand")}
        >
          Second-Hand
        </button>
        <button
          className={`tab-btn ${activeTab === "forum" ? "active" : ""}`}
          onClick={() => setActiveTab("forum")}
        >
          Umi论坛 | Umi-Talk
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductMainPage;

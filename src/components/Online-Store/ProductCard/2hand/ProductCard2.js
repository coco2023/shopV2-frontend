import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard2.css"; // Make sure to update the CSS file accordingly

const ProductCard2 = ({ product }) => {
  const navigate = useNavigate();
  const images = [
    "/assets/img/img_overview/img_overview_1.png",

  ]

  // Function to construct the image URL from the first image ID
  const getImageUrl = () => {
    // Check if productImageIds is defined and has at least one ID
    if (product.productImageIds && product.productImageIds.length > 0) {
      // Construct the URL for the first image ID
      // return `${process.env.REACT_APP_API_URL}/api/v1/products/${product.productId}/images/${product.productImageIds[0]}`;
      return `${process.env.REACT_APP_API_URL}/api/v1/products/${product.productId}/images/main/s3/img/${product.productImageIds[0]}`;
    }
    // Fallback image URL if no IDs are available
    return images; // Update this path to your actual default image location
  };
  
  // Helper function to limit the description to a certain length
  const truncateDescription = (description, length = 50) => {
    return description.length > length
      ? description.substring(0, length) + "..."
      : description;
  };

  // Assuming you have a way to get the discount percentage, price, etc.
  const discountPercentage = product.discount; // Placeholder for discount calculation logic
  const salesNumber = product.salesAmount; // Placeholder for sales number

  // Handler for the Buy It Now functionality
  const checkout = (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent div
    // Implement Buy It Now logic here
    console.log(`Product ${product.productId} purchased`);
    // Navigate to a checkout page or directly handle the purchase
    window.open(`/preOrder/${product.skuCode}`, "_blank");
  };

  // Handler for the Add to Cart functionality
  const addToCart = (event) => {
    event.stopPropagation(); // Prevent click event from bubbling up to the parent div
    // Implement Add to Cart logic here
    console.log(`Product ${product.productId} added to cart`);
  };

  // Handler to navigate to ProductDetailsPage
  const redirectToDetails = () => {
    console.log(product)
    // navigate(`/details/${product.productId}`);
    window.open(`/details/${product.productId}`, "_blank");
  };

  return (
    <div className="product-card-2" onClick={redirectToDetails}>
      <div className="product-image-container-2">
        <img
          src={getImageUrl()}
          alt={product.productName}
          className="product-image-product-card-2"
        />
      </div>

      <div className="product-details-container-2">
        <span>
          {truncateDescription(product.description)}
        </span>
        <div className="product-pricing-2">
          <span className="product-price-2">${product.price}</span>
          <span className="product-sales-2">{product.salesAmount} ON SALE</span> 
          <button className="product-add-to-cart-2" onClick={checkout}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5164/5164197.png" // "https://cdn-icons-png.flaticon.com/512/6313/6313421.png" //"https://cdn-icons-png.flaticon.com/512/4521/4521207.png" // "https://cdn-icons-png.flaticon.com/512/7343/7343378.png" "https://cdn-icons-png.flaticon.com/512/4521/4521207.png"
              alt="Checkout"
              className="cart-icon-2"
            />
          </button>
        </div>
        <div className="product-meta-2">
          <span className="product-category-2">{product.categoryName}</span> |
          <span className="product-brand-2">{product.brandName}</span> |
          <span className="product-supplier-2">{product.supplierName}</span>
        </div>
        <div className="product-rating-2">
          {/* Placeholder for rating, replace with actual rating component */}
          ★★★★☆ ({product.rating})
        </div>

        {/* <div className="product-description">
          <p className="product-title">{product.productName}</p> 
          <p className="product-price">${product.price} | {salesNumber} ON SALE | {product.stockQuantity} IN STOCK</p>
          <p className="product-meta">
            {product.categoryName} | {product.brandName} | {product.supplierName}
          </p>
        </div>

        <div className="product-description">
          <div className="product-rating">
            ★★★★☆
          </div>
          <button className="product-add-to-cart" onClick={checkout}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/5164/5164197.png"
                alt="Checkout"
                className="cart-icon"
              />
          </button>
        </div> */}
      </div>
    </div>
  );
  };

export default ProductCard2;

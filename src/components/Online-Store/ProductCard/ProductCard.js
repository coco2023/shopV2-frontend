import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css"; // Make sure to update the CSS file accordingly

const ProductCard = ({ product }) => {
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
      return `${process.env.REACT_APP_API_URL}/api/v1/products/${product.productId}/images/main/img/${product.productImageIds[0]}`;
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
    <div className="product-card" onClick={redirectToDetails}>
      <img
        src={getImageUrl()} // Use the getImageUrl function to set the src
        alt={product.productName}
        className="product-image"
      />

      <div className="product-description">
        {truncateDescription(product.description)}
      </div>
      <div className="product-pricing">
        <span className="product-price">${product.price}</span>
        {/* {discountPercentage && (
          <span className="product-discount">-{discountPercentage}%</span>
        )} */}
        <span className="product-sales">{salesNumber} ON SALE</span> | 
        <span className="product-stock">{product.stockQuantity} IN_STOCK</span>
        <button className="product-add-to-cart" onClick={checkout}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5164/5164197.png" // "https://cdn-icons-png.flaticon.com/512/6313/6313421.png" //"https://cdn-icons-png.flaticon.com/512/4521/4521207.png" // "https://cdn-icons-png.flaticon.com/512/7343/7343378.png" "https://cdn-icons-png.flaticon.com/512/4521/4521207.png"
            alt="Checkout"
            className="cart-icon"
          />
        </button>
        {/* <button className="product-add-to-cart" onClick={addToCart}>
          <img
            src="https://icones.pro/wp-content/uploads/2021/05/icone-de-panier-orange.png"
            alt="Add to Cart"
            className="cart-icon"
          />
        </button> */}
      </div>
      <div className="product-meta">
        <span className="product-category">{product.categoryName}</span> |
        <span className="product-brand">{product.brandName}</span> |
        <span className="product-supplier">{product.supplierName}</span>
      </div>
      <div className="product-rating">
        {/* Placeholder for rating, replace with actual rating component */}
        ★★★★☆ ({product.rating})
      </div>
    </div>
  );
};

export default ProductCard;

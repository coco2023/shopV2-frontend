import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import IntercomChat from "../../Assist/intercom/IntercomChat";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [productAttributes, setProductAttributes] = useState([]);
  const { productId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const leftArrowIcon = "/assets/img/svg/leftArrowIcon.svg";
  const rightArrowIcon = "/assets/img/svg/rightArrowIcon.svg";
  const [selectedProductImages, setSelectedProductImages] = useState([]);

  // Function to change the active image index
  const changeImage = (index) => {
    if (index >= 0 && index < selectedProductImages.length) {
      setActiveIndex(index);
    }
  };

  // Function to go to the previous image
  const goPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? selectedProductImages.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next image
  const goNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === selectedProductImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  //   const images = [
  //   "/assets/img/img_overview/img_overview_3.png",
  //   "/assets/img/img_slider/20230129183716.jpg",
  //   "/assets/img/img_slider/test-product01.jpg",
  //   "/assets/img/img_overview/img_overview_2.png",
  //   "/assets/img/img_slider/20230129183716.jpg",
  //   "/assets/img/img_overview/1.jpg",
  //   "/assets/img/img_slider/test-product01.jpg",
  //   "/assets/img/img_overview/img_overview_1.png",
  // ];

  // fetch product images
  const fetchProductImage = async (productId, imageId) => {
    // Construct the URL to fetch the image
    // const getImageUrl = `${process.env.REACT_APP_API_URL}/api/v1/products/${productId}/images/${imageId}`;
    const getImageUrl = `${process.env.REACT_APP_API_URL}/api/v1/products/${productId}/images/main/s3/img/${imageId}`;
    console.log(getImageUrl)
    return getImageUrl; // Directly use the URL as image source in <img> tags
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/products/${productId}`
        );
        setProduct(productRes.data);
        console.log("***Product: " + productRes.data.productImageIds);
        const getImageUrls = await Promise.all(productRes.data.productImageIds.map(id => 
          fetchProductImage(productRes.data.productId, id)
        ));
        setSelectedProductImages(getImageUrls);
        console.log("selectedProductImages: " + selectedProductImages)
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Handle error
      }
    };

    const fetchProductAttributes = async () => {
      try {
        const attributesRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/productAttributes/${productId}/attributes`
        );
        setProductAttributes(attributesRes.data);
        console.log("***Attributes: " + productAttributes);
      } catch (error) {
        console.error("Error fetching product attributes:", error);
        // Handle error
      }
    };

    fetchProduct();
    fetchProductAttributes();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // Handler for the Add to Cart functionality
  const addToCart = (event) => {
    event.stopPropagation(); // Prevent click event from bubbling up to the parent div
    // Implement Add to Cart logic here
    console.log(`Product ${product.productId} added to cart`);
  };

  // Handler for the Buy It Now functionality
  const checkout = async (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent div
    try {
      // Replace 'your-api-url' with the actual URL of your API
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/products/product/${product.skuCode}`);
      
      if (response.status === 200) {
        const productDetails = response.data;
        console.log('Product Details:', productDetails);
        // Now, you have the product details, and you can proceed with the checkout logic.
        // window.open(`/checkout/${product.skuCode}`, '_blank');
        window.open(`/preOrder/${product.skuCode}`, '_blank');
      } else {
        console.error('Failed to fetch product details.');
      }
    } catch (error) {
      console.error('An error occurred while fetching product details:', error);
    }
    };

  return (
    <div className="product-details-container-1">
      <div className="image-gallery">
          <div className="product-image-small">
            {selectedProductImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt="Small Product"
                className={activeIndex === index ? "active" : ""}
                onClick={() => changeImage(index)}
              />
            ))}
          </div>

          <div className="product-image-overview-wrapper">
            {/* Left arrow */}
            <button onClick={goPrev} className="arrow-button left-arrow">
              <img src={leftArrowIcon} alt="Previous" />
            </button>

            <div className="product-image-overview">
              <img src={selectedProductImages[activeIndex]} alt="Product Overview" />
            </div>

            {/* Right arrow */}
            <button onClick={goNext} className="arrow-button right-arrow">
              <img src={rightArrowIcon} alt="Next" />
            </button>
        </div>
      </div>

      <div className="product-info">
        <h1>{product.productName}</h1>
        <p className="sku-code">SKU: {product.skuCode}</p>
        <p className="price">Price: ${product.price.toFixed(2)}</p>
        <p className="stock-quantity">
          Stock Quantity: {product.stockQuantity}
        </p>
        <p className="stock-status">Stock Status: {product.stockStatus}</p>
        <p className="category-name">Category: {product.categoryName}</p>
        <p className="brand-name">Brand: {product.brandName}</p>
        <p className="supplier-name">Supplier: {product.supplierName}</p>
        <p className="description">Description: {product.description}</p>
        <p className="shipping-info">Shipping Info: {product.shippingInfo}</p>

        <div className="product-attributes">
          {productAttributes.map((attribute) => (
            <div key={attribute.attributeId} className="attribute">
              <strong>{attribute.attributeName}:</strong>{" "}
              {attribute.attributeValue}
            </div>
          ))}
        </div>

        {/* <button className="add-to-cart-btn" onClick={addToCart}>
          Add to Cart
        </button> */}
        <button className="add-to-cart-btn" onClick={checkout}>
          Buy It
        </button>
      </div>

      <IntercomChat/>

    </div>
  );
};

export default ProductDetails;

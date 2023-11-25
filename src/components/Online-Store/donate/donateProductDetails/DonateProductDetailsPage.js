import React, { useState } from "react";
import "./DonateProductDetailsPage.css";

const DonateProductDetailsPage = () => {
  // State for the selected price and custom price
  const [customPrice, setCustomPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("666"); // Default selected value
  const [activeIndex, setActiveIndex] = useState(0);
  const leftArrowIcon = "/assets/img/svg/leftArrowIcon.svg";
  const rightArrowIcon = "/assets/img/svg/rightArrowIcon.svg";

  const images = [
    "/assets/img/img_overview/img_overview_3.png",
    "/assets/img/img_slider/20230129183716.jpg",
    "/assets/img/img_slider/test-product01.jpg",
    "/assets/img/img_overview/img_overview_2.png",
    "/assets/img/img_slider/20230129183716.jpg",
    "/assets/img/img_overview/1.jpg",
    "/assets/img/img_slider/test-product01.jpg",
    "/assets/img/img_overview/img_overview_1.png",
  ];

  // Function to change the active image index
  const changeImage = (index) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  };

  // Function to go to the previous image
  const goPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next image
  const goNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePriceChange = (event) => {
    setTotalPrice(event.target.value);
    // If custom price is selected, clear the custom price input
    if (event.target.value !== "custom") {
      setCustomPrice("");
    }
  };

  const handleCustomPriceChange = (event) => {
    setCustomPrice(event.target.value);
    // Automatically select the custom price option
    setTotalPrice("custom");
  };

  return (
    <div className="container">
      <div className="product-image">
        <div className="product-image-small">
          {images.map((src, index) => (
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
            <img src={images[activeIndex]} alt="Product Overview" />
          </div>

          {/* Right arrow */}
          <button onClick={goNext} className="arrow-button right-arrow">
            <img src={rightArrowIcon} alt="Next" />
          </button>

        </div>
      </div>

      <div className="product-info">
        <h1>Donate UmiUni !</h1>
        <span className="rating">
          ⭐⭐⭐⭐⭐ 6.66 ( Wish you all the best! )
        </span>
        <p className="description">
          Thank you to all who have generously donated to UmiUni. 🌳🌸🌟
          <br />
          Your kindness not only supports our mission but also reinforces the
          belief that together 👭💜🌼
          <br />
          we can make a big difference! 💪🚀🎯
          <br />
          Here's to a brighter and unified future! 🌊💙💖💫💌
        </p>

        <form
          id="checkout-form"
          method="POST"
          action="http://localhost:4242/create-checkout-session"
        >
          <p className="price" id="displayPrice">
            ${(totalPrice === "custom" ? customPrice : totalPrice) / 100}
          </p>

          <div className="fixed-price-option">
            <div className="product-options">
              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="100"
                  checked={totalPrice === "100"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="https://inews.gtimg.com/om_bt/OulEPZqTuYgSUe1sup0B5VtZ7bGeukZjaDuWg0W6VGunkAA/641"
                    className="product-image-right"
                  />
                  <span className="product-description">$1.00</span>
                </div>
              </label>

              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="300"
                  checked={totalPrice === "300"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="http://pic.enorth.com.cn/005/007/154/00500715496_e4b9c075.png"
                    alt="Brown Bag"
                    className="product-image-right"
                  />
                  <span className="product-description">$3.00</span>
                </div>
              </label>

              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="500"
                  checked={totalPrice === "500"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="https://inews.gtimg.com/om_bt/OulEPZqTuYgSUe1sup0B5VtZ7bGeukZjaDuWg0W6VGunkAA/641"
                    alt="test-pic"
                    className="product-image-right"
                  />
                  <span className="product-description">$5.00</span>
                </div>
              </label>

              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="666"
                  checked={totalPrice === "666"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="http://pic.enorth.com.cn/005/007/154/00500715496_e4b9c075.png"
                    className="product-image-right"
                  />
                  <span className="product-description">$6.66</span>
                </div>
              </label>
            </div>

            <div className="product-options">
              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="1000"
                  checked={totalPrice === "1000"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="http://pic.enorth.com.cn/005/007/154/00500715496_e4b9c075.png"
                    alt="Brown Bag"
                    className="product-image-right"
                  />
                  <span className="product-description">$10.00</span>
                </div>
              </label>

              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="10000"
                  checked={totalPrice === "10000"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="https://inews.gtimg.com/om_bt/OulEPZqTuYgSUe1sup0B5VtZ7bGeukZjaDuWg0W6VGunkAA/641"
                    alt="test-pic"
                    className="product-image-right"
                  />
                  <span className="product-description">$100.00</span>
                </div>
              </label>

              <label className="option-label">
                <input
                  type="radio"
                  name="totalPrice"
                  value="5000"
                  checked={totalPrice === "5000"}
                  onChange={handlePriceChange}
                />
                <div className="product-wrapper">
                  <img
                    src="http://pic.enorth.com.cn/005/007/154/00500715496_e4b9c075.png"
                    alt="Brown Bag"
                    className="product-image-right"
                  />
                  <span className="product-description">$50.00</span>
                </div>
              </label>
            </div>
          </div>

          <div className="custom-price-option-wrapper">
            <div className="custom-price-option">
              <div className="custom-price-container">
                <label htmlFor="customPrice" className="custom-price-label">
                  <p> Or Customize Your Donate Price ($ cent) </p>
                  <input
                    type="text"
                    id="customPrice"
                    name="customPrice"
                    value={customPrice}
                    placeholder="Enter custom price $ cent"
                    onChange={handleCustomPriceChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-order">
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonateProductDetailsPage;

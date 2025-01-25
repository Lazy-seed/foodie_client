import React, { useState } from "react";
import { Link } from "react-router-dom";
import CartImage from "../assets/images/product/cart-1.jpg"; // Import image dynamically
import LogoWhite from "../assets/images/logo/logo-white.png"; // Import logo
import LogoMain from "../assets/images/logo/logo-main.png"; // Import mobile logo
import {MapPin} from "react-feather"
// Import CSS files for Navbar
import "../assets/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/fonts/fontawesome/css/all.min.css";
import "../assets/vendor/slick/slick.css";
import "../assets/vendor/nice-select/css/nice-select.css";
import "../assets/vendor/magnific-popup/dist/magnific-popup.css";
import "../assets/vendor/jquery-ui/jquery-ui.min.css";
import "../assets/vendor/animate.css";
import "../assets/css/style.css";
import "../assets/fonts/flaticon/flaticon_foodix.css";
import "../assets/css/default.css";
import PincodePop from "./PincodePop";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/slices/settingSlice";

const Navbar = () => {
  const dispatch = useDispatch()
  const locationData = useSelector((state) => state.settings.locationData);
  const handleModal = () => {
    dispatch(setLocation({...locationData, showModal:!locationData.showModal}));

}
  return (
    <>
      <PincodePop  />

      <div className="sidemenu-wrapper-cart">
        <div className="sidemenu-content">
          <div className="widget widget-shopping-cart">
            <h4>My cart</h4>
            <div className="sidemenu-cart-close">
              <i className="far fa-times"></i>
            </div>
            <div className="widget-shopping-cart-content">
              <ul className="foodix-mini-cart-list">
                <li className="foodix-menu-cart">
                  <a href="#" className="remove-cart">
                    <i className="far fa-trash-alt"></i>
                  </a>
                  <Link to="/products">
                    <img
                      src={CartImage}
                      alt="Cart Item"
                    />
                    Urban Bourbon Bliss Ribeye
                  </Link>
                  <span className="quantity">
                    1 × <span><span className="currency">$</span>940.00</span>
                  </span>
                </li>
                {/* Repeat for other cart items */}
              </ul>
              <div className="cart-mini-total">
                <div className="cart-total">
                  <span>
                    <strong>Subtotal:</strong>
                  </span>{" "}
                  <span className="amount">
                    1 × <span><span className="currency">$</span>940.00</span>
                  </span>
                </div>
              </div>
              <div className="cart-button">
                <Link to="/checkout" className="theme-btn style-one">
                  Proceed to checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header style={{ background: "#030303" }} className="header-area header-one navigation-white transparent-header position-fixed ">
        <div className="container">
          <div className="header-navigation">
            <div className="nav-overlay"></div>
            <div className="primary-menu">
              <div className="site-branding">
                <Link to="/" className="brand-logo">
                  <img
                    src={LogoWhite}
                    alt="Logo"
                  />
                </Link>
              </div>
              <div className="nav-inner-menu">
                <div className="foodix-nav-menu">
                  <nav className="main-menu">
                    <ul>
                      <li className="menu-item">
                        <Link to="/">Home</Link>
                      </li>
                      <li className="menu-item">
                        <Link to="/menu/Popular">Menu</Link>
                      </li>
                      <li className="menu-item">
                        <Link to="/profile/profile">Profile</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="nav-right-item gap-4 text-white">
                <div className="pointer" onClick={handleModal}> <MapPin size={20}/> {locationData?.location?.name}</div>

                <Link to="/cart" className="p-1 px-2 position-relative">
                  <i className="far fa-shopping-cart text-white"></i>
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    4
                    <span class="visually-hidden">unread messages</span>
                  </span>
                </Link>

                <div className="navbar-toggler">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default Navbar;

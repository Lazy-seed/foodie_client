import React from 'react';

// Import CSS files for Footer
import "../assets/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/fonts/fontawesome/css/all.min.css";
import "../assets/vendor/slick/slick.css";
import "../assets/vendor/nice-select/css/nice-select.css";
import "../assets/vendor/magnific-popup/dist/magnific-popup.css";
import "../assets/vendor/jquery-ui/jquery-ui.min.css";
import "../assets/vendor/animate.css";
import "../assets/css/style.css";

// Import images
import shape1 from '../assets/images/shape/shape-2.png';
import shape2 from '../assets/images/shape/shape-3.png';
import shape3 from '../assets/images/shape/shape-4.png';
import shape4 from '../assets/images/shape/shape-5.png';
import shape5 from '../assets/images/shape/shape-6.png';
import shape6 from '../assets/images/shape/shape-7.png';
import shape7 from '../assets/images/shape/shape-8.png';
import logoWhite from '../assets/images/logo/logo-white.png';

export default function Footer() {
  return (
    <footer className="footer-default p-r z-1">
      {/* Footer shapes */}
      <div className="footer-shape f-shape_one scene"><span data-depth=".3"><img src={shape1} alt="shape" /></span></div>
      <div className="footer-shape f-shape_two scene"><span data-depth=".4"><img src={shape2} alt="shape" /></span></div>
      <div className="footer-shape f-shape_three scene"><span data-depth=".5"><img src={shape3} alt="shape" /></span></div>
      <div className="footer-shape f-shape_four scene"><span data-depth=".6"><img src={shape4} alt="shape" /></span></div>
      <div className="footer-shape f-shape_five scene"><span data-depth=".7"><img src={shape5} alt="shape" /></span></div>
      <div className="footer-shape f-shape_six scene"><span data-depth=".8"><img src={shape6} alt="shape" /></span></div>
      <div className="footer-shape f-shape_seven scene"><span data-depth=".9"><img src={shape7} alt="shape" /></span></div>

      <div className="container">
        <div className="footer-widget-area pt-120 pb-75">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-about-widget mb-40 wow fadeInUp">
                <div className="widget-content">
                  <div className="footer-logo mb-25">
                    <a href="index-2.html"><img src={logoWhite} alt="Brand Logo" /></a>
                  </div>
                  <p>Discover culinary delights recipes and inspiration in our delightful food haven.</p>
                  <ul className="social-link">
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-contact-widget mb-40 wow fadeInUp">
                <div className="widget-content">
                  <h4 className="widget-title">Contact Us</h4>
                  <ul className="address-list">
                    <li>1901 Thornridge Cir. Shiloh, Hawaii 81063</li>
                    <li><a href="tel:+88-344-667-999">+88-344-667-999</a></li>
                    <li><a href="mailto:order@barger.com">order@foodix.com</a></li>		
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-nav-widget mb-40 wow fadeInUp">
                <div className="widget-content">
                  <h4 className="widget-title">Quick Link</h4>
                  <ul className="widget-menu">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Our Menu</a></li>
                    <li><a href="#">Gallery</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget footer-opening-widget mb-40 wow fadeInUp">
                <div className="widget-content">
                  <h4 className="widget-title">Opening time</h4>
                  <ul className="opening-schedule">
                    <li>Monday<span>: 10.00am - 05.00pm </span></li>
                    <li>Tuesday<span>: 10.20am - 05.30pm </span></li>
                    <li>Wednesday<span>: 10.30am - 05.50pm </span></li>
                    <li>Thursday<span>: 11.00am - 07.10pm </span></li>
                    <li>Friday : <span className="of-close">Closed</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright-area text-center">
        <div className="container">
          <div className="copyright-text">
            <p>&copy; 2024 All rights reserved design by Pixelfit</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// D:\projects\foodie\foodie\src\pages\Home.js
import React from "react";

const Home = () => {
    return (
        <div>
            <section className="hero-section">
                <div className="hero-wrapper-four">
                    <div className="hero-bg bg_cover" style={{ backgroundImage: "url(assets/images/hero/hero-four_bg.png)" }}></div>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-6 order-2 order-xl-1">
                                <div className="hero-content">
                                    <span className="tag-line wow fadeInDown" data-wow-delay=".5s">Hot for every Sunday</span>
                                    <h1 className="wow fadeInUp" data-wow-delay=".6s">Enjoy our <span>delicius</span> food</h1>
                                    <p className="wow fadeInDown" data-wow-delay=".7s">Savor the taste of our delicious, expertly crafted dishes made with the finest ingredients, offering a perfect blend of flavors.</p>
                                    <div className="hero-button wow fadeInUp" data-wow-delay=".75s">
                                        <a href="index-2.html" className="theme-btn style-one">Order Now</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 order-1 order-xl-2">
                                <div className="hero-image text-center text-xl-end">
                                    <div className="shape wow bounceInUp"><span><img src="assets/images/hero/text-03.png" alt="20% OFF" /></span></div>
                                    <img className="hero-img wow fadeInRight" data-wow-delay=".9s" src="assets/images/hero/hero-four_img1.png" alt="Hero Image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="category-section pt-130">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="section-title mb-50 wow fadeInUp">
                                <h2>our Categories</h2>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="category-button float-md-end mb-50 wow fadeInDown">
                                <a href="menu-v3.html" className="theme-btn style-two">See More</a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <a href="menu-v3.html" className="iconic-box style-four mb-40 wow fadeInUp">
                                <div className="icon">
                                    <i className="flaticon-burger"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Delish Burger</h4>
                                    <span>25 items</span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <a href="menu-v3.html" className="iconic-box style-four mb-40 wow fadeInDown">
                                <div className="icon">
                                    <i className="flaticon-sandwich-1"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Sandwiches</h4>
                                    <span>20 items</span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <a href="menu-v3.html" className="iconic-box style-four mb-40 wow fadeInUp">
                                <div className="icon">
                                    <i className="flaticon-shrimp"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Mexican Cuisine</h4>
                                    <span>30 items</span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <a href="menu-v3.html" className="iconic-box style-four mb-40 wow fadeInDown">
                                <div className="icon">
                                    <i className="flaticon-pasta"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Italian Cuisine</h4>
                                    <span>19 items</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section pt-90 pb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="about-image-box mb-50 text-center text-xl-start wow fadeInLeft">
                                <img src="assets/images/about/about-6.png" alt="About Image" />
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="section-content-box mb-50">
                                <div className="section-title wow fadeInDown">
                                    <span className="sub-title"><i className="flaticon-food-tray"></i> About us</span>
                                    <h2>Delicia's about fresh flavorful dining</h2>
                                </div>
                                <p className="wow fadeInUp">We are passionate about serving fresh, flavorful dishes crafted with the finest ingredients. Every meal is thoughtfully prepared to deliver a memorable dining experience you'll love.</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="iconic-box style-five mb-30 wow fadeInDown">
                                            <div className="icon">
                                                <img src="assets/images/icon/icon-7.svg" alt="Icon" />
                                            </div>
                                            <div className="content">
                                                <h3 className="title">1500+</h3>
                                                <p>Total Food Item</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="iconic-box style-five mb-30 wow fadeInDown">
                                            <div className="icon">
                                                <img src="assets/images/icon/icon-8.svg" alt="Icon" />
                                            </div>
                                            <div className="content">
                                                <h3 className="title">500+</h3>
                                                <p>Branch office</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-button wow fadeInUp">
                                    <a href="about.html" className="theme-btn style-one">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="offer-combo-section">
                <div className="offer-bg-wrapper bg_cover p-r z-1 pt-130 pb-80" style={{ backgroundImage: "url(assets/images/bg/offer-bg1.jpg)" }}>
                    <div className="shape shape-one"><span><img src="assets/images/bg/bn-img-6.png" alt="" /></span></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="section-content-box text-center text-lg-start mb-50 wow fadeInLeft">
                                    <div className="section-title text-white mb-30">
                                        <span className="sub-title"><i className="flaticon-food-tray"></i> Get 25% Discount</span>
                                        <h2>Today our special Combo offers </h2>
                                    </div>
                                    <div className="offer-countdown">
                                        <div className="simply-countdown"></div>
                                    </div>
                                    <a href="menu-details.html" className="theme-btn style-one">Read More</a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="offer-image-box text-center text-lg-end mb-50 wow fadeInRight">
                                    <img src="assets/images/bg/offer-img1.png" alt="Combo Package image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="why-choose-section pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center mb-55 wow fadeInDown">
                                <span className="sub-title"><i className="flaticon-food-tray"></i>Why choose us</span>
                                <h2>Why We’re Your Best Choice</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <div className="iconic-box style-six mb-40 wow fadeInDown">
                                <div className="icon">
                                    <i className="flaticon-healthy-food"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Hygienic Food</h4>
                                    <p>We are passionate about serving fresh, flavorful</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <div className="iconic-box style-six mb-40 wow fadeInUp">
                                <div className="icon">
                                    <i className="flaticon-clean-water"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Fresh Environment</h4>
                                    <p>We are passionate about serving fresh, flavorful</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <div className="iconic-box style-six mb-40 wow fadeInDown">
                                <div className="icon">
                                    <i className="flaticon-chef"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Skilled Chefs</h4>
                                    <p>We are passionate about serving fresh, flavorful</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 col-sm-12">
                            <div className="iconic-box style-six mb-40 wow fadeInUp">
                                <div className="icon">
                                    <i className="flaticon-party"></i>
                                </div>
                                <div className="content">
                                    <h4 className="title">Event & Party</h4>
                                    <p>We are passionate about serving fresh, flavorful</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

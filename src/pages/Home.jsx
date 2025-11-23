import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Award, Gift } from "react-feather";
import RecommendedSection from "../components/RecommendedSection";

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gray-50 py-20 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 z-10">
                            <span className="text-red-600 font-semibold tracking-wider uppercase mb-2 block">Hot for every Sunday</span>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Enjoy our <span className="text-red-600">delicious</span> food
                            </h1>
                            <p className="text-gray-600 text-lg mb-8 max-w-lg">
                                Savor the taste of our delicious, expertly crafted dishes made with the finest ingredients, offering a perfect blend of flavors.
                            </p>
                            <Link to="/menu/all" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 md:text-lg transition-colors duration-300">
                                Order Now <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </div>
                        <div className="lg:w-1/2 mt-10 lg:mt-0 relative">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Hero Food"
                                    className="rounded-full shadow-2xl w-full max-w-lg mx-auto animate-float"
                                />
                                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 font-bold rounded-full p-4 transform rotate-12 shadow-lg">
                                    20% OFF
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <RecommendedSection /> */}
            {/* Categories Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Categories</h2>
                            <div className="h-1 w-20 bg-red-600 mt-2"></div>
                        </div>
                        <Link to="/menu/all" className="text-red-600 font-medium hover:text-red-700 flex items-center">
                            See More <ArrowRight className="ml-1" size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Delish Burger", count: "25 items", icon: "🍔" },
                            { title: "Sandwiches", count: "20 items", icon: "🥪" },
                            { title: "Mexican Cuisine", count: "30 items", icon: "🌮" },
                            { title: "Italian Cuisine", count: "19 items", icon: "🍕" },
                        ].map((cat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-center group cursor-pointer">
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.title}</h3>
                                <span className="text-gray-500 text-sm">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="About Us"
                                className="rounded-2xl shadow-lg w-full"
                            />
                        </div>
                        <div className="lg:w-1/2">
                            <span className="text-red-600 font-semibold uppercase tracking-wider mb-2 block">About Us</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Delicia's about fresh flavorful dining</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                We are passionate about serving fresh, flavorful dishes crafted with the finest ingredients. Every meal is thoughtfully prepared to deliver a memorable dining experience you'll love.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-red-100 p-3 rounded-lg text-red-600">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-xl">1500+</h4>
                                        <p className="text-gray-500 text-sm">Total Food Items</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="bg-red-100 p-3 rounded-lg text-red-600">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-xl">500+</h4>
                                        <p className="text-gray-500 text-sm">Branch Offices</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/about" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-semibold uppercase tracking-wider mb-2 block">Why Choose Us</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why We’re Your Best Choice</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Hygienic Food", icon: <Shield size={32} />, desc: "We ensure strict hygiene standards." },
                            { title: "Fresh Environment", icon: <Star size={32} />, desc: "Relax in a clean, fresh atmosphere." },
                            { title: "Skilled Chefs", icon: <Award size={32} />, desc: "Expert chefs crafting your meals." },
                            { title: "Event & Party", icon: <Gift size={32} />, desc: "Perfect venue for your celebrations." },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

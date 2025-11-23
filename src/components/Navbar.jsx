import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, ShoppingCart, Menu, X } from "react-feather";
import LogoWhite from "../assets/images/logo/logo-white.png";
import PincodePop from "./PincodePop";
import { setLocation } from "../redux/slices/settingSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const locationData = useSelector((state) => state.settings?.locationData);
    const cartQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleModal = () => {
        dispatch(setLocation({ ...locationData, showModal: !locationData?.showModal }));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <PincodePop />
            <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img src={LogoWhite} alt="Foodo Logo" className="h-12" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className="text-white hover:text-red-500 font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/menu/Popular"
                                className="text-white hover:text-red-500 font-medium transition-colors"
                            >
                                Menu
                            </Link>
                            <Link
                                to="/profile/profile"
                                className="text-white hover:text-red-500 font-medium transition-colors"
                            >
                                Profile
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Location Selector */}
                            <button
                                onClick={handleModal}
                                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <MapPin size={18} />
                                <span className="text-sm font-medium">
                                    {locationData?.location?.city || "Select Location"}
                                </span>
                            </button>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ShoppingCart size={24} className="text-white" />
                                {cartQuantity > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-800">
                            <div className="flex flex-col space-y-4">
                                <Link
                                    to="/"
                                    onClick={toggleMobileMenu}
                                    className="text-white hover:text-red-500 font-medium transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/menu/Popular"
                                    onClick={toggleMobileMenu}
                                    className="text-white hover:text-red-500 font-medium transition-colors"
                                >
                                    Menu
                                </Link>
                                <Link
                                    to="/profile/profile"
                                    onClick={toggleMobileMenu}
                                    className="text-white hover:text-red-500 font-medium transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleModal();
                                        toggleMobileMenu();
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors w-full"
                                >
                                    <MapPin size={18} />
                                    <span className="text-sm font-medium">
                                        {locationData?.location?.city || "Select Location"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;

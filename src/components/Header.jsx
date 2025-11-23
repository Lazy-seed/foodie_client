import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu, X, LogOut } from 'react-feather';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector(selectCurrentUser);
    const cartQuantity = useSelector((state) => state.cart.totalQuantity);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-red-600">
                    Foodo
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-red-600 font-medium">Home</Link>
                    <Link to="/menu/all" className="text-gray-700 hover:text-red-600 font-medium">Menu</Link>
                    <Link to="/contact" className="text-gray-700 hover:text-red-600 font-medium">Contact</Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative text-gray-700 hover:text-red-600">
                        <ShoppingCart size={24} />
                        {cartQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartQuantity}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
                                <User size={24} />
                                <span className="hidden md:block font-medium">{user.name}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden group-hover:block">
                                <Link to="/profile/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                                    <LogOut size={16} className="mr-2" /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="text-gray-700 hover:text-red-600 font-medium">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-2 space-y-2">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-red-600" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/menu/all" className="block py-2 text-gray-700 hover:text-red-600" onClick={() => setIsOpen(false)}>Menu</Link>
                        <Link to="/contact" className="block py-2 text-gray-700 hover:text-red-600" onClick={() => setIsOpen(false)}>Contact</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

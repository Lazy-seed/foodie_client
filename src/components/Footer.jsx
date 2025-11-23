import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, GitHub } from 'react-feather';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-red-600 mb-4">Foodo</h3>
                        <p className="text-gray-400">
                            Delicious food delivered to your doorstep. Fresh, fast, and tasty.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link to="/menu/all" className="text-gray-400 hover:text-white">Menu</Link></li>
                            <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>123 Food Street, Tasty City</li>
                            <li>Phone: +1 234 567 890</li>
                            <li>Email: info@foodo.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><GitHub size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Foodo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

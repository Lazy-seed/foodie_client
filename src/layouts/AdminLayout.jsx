import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    BarChart2, Package, ShoppingBag, Users, LogOut, Menu, X, Home
} from 'react-feather';
import { logOut, selectCurrentUser } from '../features/auth/authSlice';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectCurrentUser);

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <BarChart2 size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    {sidebarOpen && <h1 className="text-xl font-bold">Foodo Admin</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            {...(item.path === '/admin/orders' && { 'data-demo': 'orders-link' })}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        <Home size={20} />
                        {sidebarOpen && <span className="font-medium">Back to Site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

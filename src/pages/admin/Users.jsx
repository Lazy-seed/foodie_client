import React, { useState, useEffect } from 'react';
import { Search, Slash, CheckCircle, Eye, DollarSign, ShoppingBag } from 'react-feather';
import JwtApi from '../../api/JwtApi';
import toast from 'react-hot-toast';
import moment from 'moment';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 15,
                ...(search && { search })
            });

            const res = await JwtApi.get(`admin/users?${params}`);
            setUsers(res.users || []);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (userId) => {
        try {
            await JwtApi.patch(`admin/users/${userId}/block`);
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            console.error('Failed to toggle block:', error);
            toast.error('Failed to update user status');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Users Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div key={user._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                {/* User Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    {user.isBlocked && (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                            Blocked
                                        </span>
                                    )}
                                </div>

                                {/* User Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                                            <ShoppingBag size={14} />
                                            <span>Orders</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{user.orderCount || 0}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                                            <DollarSign size={14} />
                                            <span>Total Spent</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">₹{user.totalSpent?.toFixed(2) || 0}</p>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Role:</span>
                                        <span className="font-medium text-gray-900 capitalize">{user.role}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Joined:</span>
                                        <span className="font-medium text-gray-900">
                                            {moment(user.createdAt).format('MMM DD, YYYY')}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleToggleBlock(user._id)}
                                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${user.isBlocked
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                        >
                                            {user.isBlocked ? (
                                                <>
                                                    <CheckCircle size={16} />
                                                    Unblock
                                                </>
                                            ) : (
                                                <>
                                                    <Slash size={16} />
                                                    Block
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-100 rounded-lg">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Users;

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'react-feather';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import JwtApi from '../../api/JwtApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, revenueRes, ordersRes, productsRes, ordersListRes] = await Promise.all([
                JwtApi.get('admin/analytics/stats'),
                JwtApi.get('admin/analytics/revenue-chart'),
                JwtApi.get('admin/analytics/orders-chart'),
                JwtApi.get('admin/analytics/top-products?limit=5'),
                JwtApi.get('admin/analytics/recent-orders?limit=5')
            ]);

            setStats(statsRes);
            setRevenueData(revenueRes.data || []);
            setOrdersData(ordersRes.data || []);
            setTopProducts(productsRes.products || []);
            setRecentOrders(ordersListRes.orders || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats?.totalRevenue?.toFixed(2) || 0}`}
                    icon={<DollarSign size={24} />}
                    color="green"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    icon={<ShoppingBag size={24} />}
                    color="blue"
                />
                <StatsCard
                    title="Active Users"
                    value={stats?.activeUsersCount || 0}
                    icon={<Users size={24} />}
                    color="purple"
                />
                <StatsCard
                    title="Avg Order Value"
                    value={`₹${stats?.avgOrderValue?.toFixed(2) || 0}`}
                    icon={<TrendingUp size={24} />}
                    color="yellow"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders by Status Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ordersData}
                                dataKey="count"
                                nameKey="_id"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {ordersData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {topProducts.map((product, index) => (
                            <div key={product._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                                <img
                                    src={product.imgUrl || 'https://via.placeholder.com/50'}
                                    alt={product.title}
                                    className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{product.title}</p>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{product.soldCount} sold</p>
                                    <p className="text-sm text-gray-500">₹{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">{order.userId?.name || 'Guest'}</p>
                                    <p className="text-sm text-gray-500">#{order._id.slice(-8)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">₹{order.totalPrice?.toFixed(2)}</p>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

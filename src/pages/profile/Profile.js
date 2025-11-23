import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, LogOut, Clock, MapPin, Phone } from 'react-feather';
import moment from 'moment';
import { logOut, selectCurrentUser } from '../../features/auth/authSlice';
import JwtApi from '../../api/JwtApi';

export default function Profile() {
  const { section } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [activeSection, setActiveSection] = useState(section || 'profile');
  const [orderList, setOrderList] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Sync activeSection with URL parameter
  useEffect(() => {
    setActiveSection(section || 'profile');
  }, [section]);

  const handleSectionChange = (section) => {
    navigate(`/profile/${section}`);
    setActiveSection(section);
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  // Fetch user orders
  const getOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await JwtApi.get('order/getorders');
      setOrderList(res);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'orders') {
      getOrders();
    }
  }, [activeSection]);

  // Status badge color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <nav className="space-y-2">
                  <button
                    onClick={() => handleSectionChange('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'profile'
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => handleSectionChange('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'orders'
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Package size={20} />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => handleSectionChange('logout')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'logout'
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <User size={40} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h3>
                        <p className="text-gray-500">Member since {moment(user?.createdAt).format('MMMM YYYY')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-lg text-gray-900">{user?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="text-lg text-gray-900">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                      Edit Profile
                    </button> */}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {activeSection === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                  {isLoadingOrders ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                  ) : orderList.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No orders yet</p>
                      <p className="text-gray-400 mt-2">Start shopping to see your orders here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderList.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          {/* Order Header */}
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="font-mono font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <span className="text-sm">{moment(order.createdAt).format('MMM DD, YYYY • hh:mm A')}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.productId?.imgUrl || 'https://via.placeholder.com/64'}
                                    alt={item.productId?.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.productId?.title || 'Product'}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <p className="font-semibold text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            {order.shippingAddress && (
                              <div className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <span>
                                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                                </span>
                              </div>
                            )}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="text-xl font-bold text-gray-900">₹{order.totalPrice?.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Logout Section */}
              {activeSection === 'logout' && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LogOut size={40} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Logout</h2>
                    <p className="text-gray-600 mb-8">Are you sure you want to log out of your account?</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleSectionChange('profile')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

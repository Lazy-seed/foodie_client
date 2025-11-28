import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, LogOut, Clock, MapPin, Phone, Plus } from 'react-feather';
import moment from 'moment';
import toast from 'react-hot-toast';
import { logOut, selectCurrentUser } from '../../features/auth/authSlice';
import JwtApi from '../../api/JwtApi';
import AddressCard from '../../components/AddressCard';
import AddressForm from '../../components/AddressForm';
import { socket } from '../../socket';

export default function Profile() {
  const { section } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [activeSection, setActiveSection] = useState(section || 'profile');
  const [orderList, setOrderList] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address management state
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

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

  // Fetch user addresses
  const getAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await JwtApi.get('address');
      setAddresses(res.addresses || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Add new address
  const handleAddAddress = async (addressData) => {
    setIsSavingAddress(true);
    try {
      await JwtApi.post('address', addressData);
      toast.success('Address added successfully');
      setShowAddressForm(false);
      getAddresses();
    } catch (err) {
      console.error('Failed to add address:', err);
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Update address
  const handleUpdateAddress = async (addressData) => {
    setIsSavingAddress(true);
    try {
      await JwtApi.put(`address/${editingAddress._id}`, addressData);
      toast.success('Address updated successfully');
      setEditingAddress(null);
      setShowAddressForm(false);
      getAddresses();
    } catch (err) {
      console.error('Failed to update address:', err);
      toast.error('Failed to update address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await JwtApi.delete(`address/${addressId}`);
      toast.success('Address deleted successfully');
      getAddresses();
    } catch (err) {
      console.error('Failed to delete address:', err);
      toast.error('Failed to delete address');
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await JwtApi.patch(`address/${addressId}/default`);
      toast.success('Default address updated');
      getAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
      toast.error('Failed to set default address');
    }
  };

  useEffect(() => {
    if (activeSection === 'orders') {
      getOrders();
    } else if (activeSection === 'addresses') {
      getAddresses();
    }
  }, [activeSection]);

  // Real-time order updates (List update only)
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      const { orderId, status } = data;

      setOrderList(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    };

    socket.on('orderStatusUpdated', handleStatusUpdate);

    return () => {
      socket.off('orderStatusUpdated', handleStatusUpdate);
    };
  }, []);

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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'profile'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </button>

                  <button
                    onClick={() => handleSectionChange('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'orders'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Package size={20} />
                    <span className="font-medium">Orders</span>
                  </button>

                  <button
                    onClick={() => handleSectionChange('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === 'addresses'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <MapPin size={20} />
                    <span className="font-medium">Addresses</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
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

              {/* Addresses Section */}
              {activeSection === 'addresses' && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                    {!showAddressForm && addresses.length < 5 && (
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setShowAddressForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        <Plus size={20} />
                        Add Address
                      </button>
                    )}
                  </div>

                  {showAddressForm ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <AddressForm
                        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                        onCancel={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        initialData={editingAddress}
                        isLoading={isSavingAddress}
                      />
                    </div>
                  ) : isLoadingAddresses ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading addresses...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
                      <p className="text-gray-600 mb-6">Add your first address to make checkout faster</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        <Plus size={20} />
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <>
                      {addresses.length >= 5 && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            You've reached the maximum limit of 5 addresses. Delete an address to add a new one.
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                          <AddressCard
                            key={address._id}
                            address={address}
                            isDefault={address.isDefault}
                            onEdit={(addr) => {
                              setEditingAddress(addr);
                              setShowAddressForm(true);
                            }}
                            onDelete={handleDeleteAddress}
                            onSetDefault={handleSetDefaultAddress}
                          />
                        ))}
                      </div>
                    </>
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

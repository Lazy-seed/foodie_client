import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, CreditCard } from 'react-feather';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '../../features/auth/authSlice';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from '../../features/cart/cartSlice';
import {
  useGetCartQuery,
  useUpdateCartItemApiMutation,
  useRemoveCartItemApiMutation
} from '../../features/cart/cartApiSlice';
import JwtApi from '../../api/JwtApi';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const localCartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const totalQuantity = useSelector(selectCartTotalQuantity);

  // Fetch cart from API if user is logged in
  const { data: apiCartData, isLoading: isLoadingCart } = useGetCartQuery(undefined, {
    skip: !user, // Only fetch if user is logged in
  });

  const [updateCartItemApi] = useUpdateCartItemApiMutation();
  const [removeCartItemApi] = useRemoveCartItemApiMutation();

  const [step, setStep] = useState('cart'); // cart, address
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    contact: "",
    orderNotes: "",
  });

  // Use API cart data if available, otherwise use local cart
  const cartItems = user && apiCartData?.items ? apiCartData.items : localCartItems;

  const shippingFee = 50;
  const finalTotal = totalAmount + shippingFee;

  const handleIncrease = async (item) => {
    const productId = item.productId?._id || item._id;
    if (user) {
      try {
        await updateCartItemApi({ productId, quantity: item.quantity + 1 }).unwrap();
      } catch (error) {
        toast.error("Failed to update cart");
      }
    } else {
      dispatch(increaseQuantity(productId));
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      toast.error("Use delete button to remove item");
      return;
    }
    const productId = item.productId?._id || item._id;
    if (user) {
      try {
        await updateCartItemApi({ productId, quantity: item.quantity - 1 }).unwrap();
      } catch (error) {
        toast.error("Failed to update cart");
      }
    } else {
      dispatch(decreaseQuantity(productId));
    }
  };

  const handleRemove = async (itemId) => {
    if (user) {
      try {
        await removeCartItemApi(itemId).unwrap();
        toast.success("Item removed");
      } catch (error) {
        toast.error("Failed to remove item");
      }
    } else {
      dispatch(removeFromCart(itemId));
      toast.success("Item removed");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Razorpay Payment Integration
   * This function creates a Razorpay order and handles the payment flow
   */
  const handlePayment = async () => {
    // Validate required fields
    if (!address.firstName || !address.addressLine1 || !address.contact) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Step 1: Create Razorpay order on backend
      const orderResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(finalTotal * 100), // Convert to paise (₹1 = 100 paise)
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.id) {
        throw new Error('Failed to create order');
      }

      // Step 2: Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Foodo',
        description: 'Food Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          // Step 3: Payment successful - verify payment on backend
          try {
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Step 4: Create order in database
              // Transform address data to match backend schema
              const orderData = {
                firstName: address.firstName,
                lastName: address.lastName,
                address: {
                  line1: address.addressLine1,
                  line2: address.addressLine2 || ''
                },
                city: address.city,
                postcode: address.postcode,
                contact: address.contact,
                orderNotes: address.orderNotes
              };

              await JwtApi.post('order/create', orderData);

              toast.success("Payment successful! Order placed.");
              dispatch(clearCart());
              navigate('/profile/orders');
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Payment verification failed");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: user.email,
          contact: address.contact,
        },
        theme: {
          color: '#DC2626', // Red color matching your theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.error("Payment cancelled");
          }
        }
      };

      // Step 5: Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  // Show loading state while fetching cart
  if (user && isLoadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/menu/Popular" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors">
            Start Shopping <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {step === 'cart' ? 'Your Cart' : 'Checkout'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items or Address Form */}
          <div className="lg:w-2/3">
            {step === 'cart' ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  {cartItems.map((item) => {
                    // Handle both local cart (flat) and API cart (nested productId)
                    const product = item.productId || item;
                    const itemId = item.productId?._id || item._id;

                    return (
                      <div key={itemId} className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={product.imgUrl || product.image || "https://via.placeholder.com/100"}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          <p className="text-gray-500">₹{product.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-gray-900 w-20 text-center sm:text-right">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemove(itemId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={address.firstName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={address.lastName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={address.postcode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                      type="text"
                      name="contact"
                      value={address.contact}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                    <textarea
                      name="orderNotes"
                      value={address.orderNotes}
                      onChange={handleAddressChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('address')}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay with Razorpay <CreditCard size={20} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

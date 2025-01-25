import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import JwtApi from '../../jwt/JwtApi';
import Loader from '../../utilities/Loader';
import OverLoader from '../../utilities/OverLoader';



export default function Cart() {
  const location = useSelector((state) => state.settings.locationData);
  const [useCartData, setCartData] = useState([])
  const [useLoader, setLoader] = useState(true)
  const [useOverLoader, setOverLoader] = useState(false)
  const [useAddress, setAddress] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: location?.location?.city, // Replace with the actual city if needed
    postcode: location?.location?.pincode, // Replace with the actual postcode if needed
    contact: "",
    orderNotes: "",
  })
  const [usePage, setPage] = useState("cart")
  const [usePriceInfo, setPriceInfo] = useState({
    items: 0,
    shipping: 50,
    total: 0

  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCartData = () => {
    setLoader(true)
    JwtApi.get('/cart')
      .then((res) => {
        setCartData(res?.items)
      }).catch((err) => console.log(err))
      .finally(() => setLoader(false))
  }
  useEffect(() => {
    let itemprice = 0
    useCartData?.forEach(ele => {
      itemprice += ele?.productId?.price
    });
    setPriceInfo((prev) => ({ ...prev, items: itemprice, total: prev?.shipping + itemprice }))
  }, [useCartData])

  const deleteCart = (productId) => {
    setOverLoader(true)
    JwtApi.delete('/cart/remove', { productId })
      .then(() => {
        setCartData((prev) => prev.filter((elm) => elm?._id !== productId))
        toast.success("Removed")
      })
      .catch((err) => toast.error("Something went wrong!"))
      .finally(() => setOverLoader(false))
  }
  const handleSubmit = () => {
    // Validate required fields
    if (!useAddress?.firstName || !useAddress?.lastName || !useAddress?.addressLine1 || !useAddress?.contact) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Prepare data for submission
    const payload = {
      firstName: useAddress?.firstName,
      lastName: useAddress?.lastName,
      address: {
        line1: useAddress?.addressLine1,
        line2: useAddress?.addressLine2 || "",
      },
      city: useAddress?.city,
      postcode: useAddress?.postcode,
      contact: useAddress?.contact,
      orderNotes: useAddress?.orderNotes || "",
    };

    // Mock submission (replace with actual API call)
    console.log("Submitting Billing Details:", payload);

    JwtApi.post('/order/create', payload)
      .then((res) => {
        console.log(res)
        toast.success(res?.message)
      })
      .catch((err) => toast.error(err?.response?.data.message ?? "Something went wrong"))
      .finally(() => setOverLoader(false))

  };
  const uptQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      toast.error("You can remove the item from the cart")
      return
    }
    setOverLoader(true)
    JwtApi.put('/cart/update', { productId, quantity })
      .then((res) => {
        toast.success(res?.message)
        setCartData((prev) => {
          const newData = prev.map((item) => (item._id === productId ? { ...item, quantity } : item))
          return newData
        })

      })
      .catch((err) => toast.error(err?.response?.data.message ?? "Something went wrong"))
      .finally(() => setOverLoader(false))
  }

  useEffect(() => {
    getCartData()
  }, [])
  return (
    <div>
      {
        useOverLoader && <OverLoader />
      }
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mt-110">
            <div className="page-banner-content text-center">
              <h2 className="page-title text-black">{
                usePage === "address" ? "Address" : "Cart"}</h2>

            </div>
          </div>
        </div>
      </div>

      <section className="cart-section pt-80 pb-100">
        <div className="container">
          <div className="row">
            {/* Cart Items */}
            {
              usePage === "cart" &&
              <div className="col-xl-8">
                <div className="cart-wrapper wow fadeInUp">
                  <div className="cart-table table-responsive" >
                    {
                      useLoader ? <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "300px" }}> <Loader /></div>
                        :
                        <table className="table">
                          <tbody>
                            {useCartData?.map((item, index) => (
                              <tr key={index}>
                                <td className="thumbnail-title">
                                  <img
                                    src={item?.productId?.imgUrl}
                                    alt={item.title}
                                    className="cart-image border"
                                  />
                                  <span className="title">
                                    <Link to="/menu-details">{item.productId?.title}</Link>
                                  </span>
                                </td>
                                <td className="price">{item.productId?.price}</td>
                                <td className="quantity">
                                  <div className="quantity-input">
                                    <button className="quantity-down" onClick={() => uptQuantity(item?._id, item?.quantity - 1)}>
                                      <i className="far fa-minus"></i>
                                    </button>
                                    <div className="quantity px-4">{item?.quantity}</div>

                                    <button className="quantity-up" onClick={() => uptQuantity(item?._id, item?.quantity + 1)}>
                                      <i className="far fa-plus"></i>
                                    </button>
                                  </div>
                                </td>
                                <td className="subtotal">${item.productId?.price * item?.quantity}</td>
                                <td className="remove">
                                  <button className="remove-button" onClick={() => deleteCart(item?._id)}>
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    }
                    {
                      !useLoader && useCartData.length === 0 && <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "300px" }}> <h3 className='text-center text-dark'>No items in cart</h3></div>
                    }
                  </div>
                </div>
              </div>}
            {
              usePage === "address" &&
              <div className="col-xl-8">
                <h4 className="title mb-15">Billing Details</h4>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>First Name*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="First Name"
                        name="firstName"
                        value={useAddress?.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>Last Name*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Last Name"
                        name="lastName"
                        value={useAddress?.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Address*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Street Address"
                        name="addressLine1"
                        value={useAddress?.addressLine1}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Apartment, suite, unit etc. (optional)"
                        name="addressLine2"
                        value={useAddress?.addressLine2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>City</label>
                      <input
                        type="text"
                        className="form_control no-drop"
                        placeholder="Town / City"
                        name="city"
                        value={useAddress?.city}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>Postcode</label>
                      <input
                        type="text"
                        className="form_control no-drop"
                        placeholder="Postcode / Zip"
                        name="postcode"
                        value={useAddress?.postcode}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Contact*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Your Phone"
                        name="contact"
                        value={useAddress?.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Order Notes (optional)</label>
                      <textarea
                        name="orderNotes"
                        className="form_control"
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        value={useAddress?.orderNotes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Cart Totals */}
            <div className="col-xl-4">
              <div className="shopping-cart-total mb-30 wow fadeInUp">
                <h4 className="title">Cart Totals</h4>
                <table className="table mb-25">
                  <tbody>
                    <tr>
                      <td>Cart Subtotal</td>
                      <td className="price">{usePriceInfo?.items}</td>
                    </tr>
                    <tr>
                      <td>Shipping Fee</td>
                      <td className="price">{usePriceInfo?.shipping}</td>
                    </tr>
                    <tr>
                      <td className="total">
                        <span>Order Total</span>
                      </td>
                      <td className="total price">
                        <span>{usePriceInfo?.total}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="coupon-box d-flex justify-content-between align-items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="form_control p-1 mb-0"
                    placeholder="Coupon Code"
                  />
                  <button className=" style-one p-1 px-3">
                    Apply
                  </button>
                </div>
                {
                  usePage === "cart" &&
                  <button className="theme-btn style-one" onClick={() => setPage("address")}>Proceed to Checkout</button>
                }
                {
                  usePage === "address" &&
                  <button className="theme-btn style-one" onClick={() => { handleSubmit() }}>Pay </button>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

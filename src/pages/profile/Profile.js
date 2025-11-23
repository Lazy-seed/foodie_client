import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './profile.css';
import bgImg from '../../assets/images/bg/page-bg.jpg'
import { logOut } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import JwtApi from '../../api/JwtApi';
import moment from 'moment'
export default function Profile() {
  const { section } = useParams(); // Get the section from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [activeSection, setActiveSection] = useState(section || 'profile'); // Default to 'profile'
  const [useOrderList, setOrderList] = useState([])
  // Ensure activeSection syncs with URL parameter
  useEffect(() => {
    setActiveSection(section || 'profile');
  }, [section]);

  const handleSectionChange = (section) => {
    navigate(`/profile/${section}`); // Update the URL
    setActiveSection(section);
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  // const renderSectionContent = () => {
  //   switch (activeSection) {
  //     case 'profile':
  //       return <ProfileContent />;
  //     case 'orders':
  //       return <OrdersContent />;
  //     case 'logout':
  //       return <LogoutContent />;
  //     default:
  //       return null;
  //   }
  // };

  const getOrders = () => {
    JwtApi.get('order/getorders')
      .then((res) => {
        setOrderList(res)
      }).catch((err) => console.log(err))
  };
  useEffect(() => {
    getOrders();

  }, [])

  return (
    <div className="profile-page">
      <div className="container">
        <div className="row mt-3">
          {/* Left-side Navigation Bar */}
          <div className="col-md-3">
            <div className="profile-sidebar">
              <h3 className="sidebar-title">My Account</h3>
              <ul className="profile-nav">
                <li
                  className={activeSection === 'profile' ? 'active' : ''}
                  onClick={() => handleSectionChange('profile')}
                >
                  <i className="fas fa-user-circle"></i> Profile
                </li>
                <li
                  className={activeSection === 'orders' ? 'active' : ''}
                  onClick={() => handleSectionChange('orders')}
                >
                  <i className="fas fa-box"></i> Orders
                </li>
                <li
                  className={activeSection === 'logout' ? 'active' : ''}
                  onClick={() => handleSectionChange('logout')}
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-md-9">
            <div className="profile-content">
              {activeSection === 'profile' && (
                <div className="profile-details">
                  <h3>Profile Details</h3>
                  <div className="profile-info">
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Email:</strong> john.doe@example.com</p>
                    <p><strong>Phone:</strong> +1 234 567 890</p>
                    <button className="theme-btn style-one">Edit Profile</button>
                  </div>
                </div>
              )}

              {activeSection === 'orders' && (
                <div className="order-details">
                  <h3>Order History</h3>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        useOrderList?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item?._id?.slice(-6)}</td>
                              <td>{moment(item?.createdAt)?.format('YYYY-MM-DD')}</td>
                              <td>{moment(item?.createdAt)?.format('hh : mm a')}</td>
                              <td>
                                <ul>
                                  {
                                    item?.items?.map((item, index) => {
                                      return (
                                        <li key={index}>{item?.quantity} x {item?.productId?.title} ({item?.price})</li>
                                      )
                                    })
                                  }
                                </ul>
                              </td>
                              <td>{item?.totalPrice}</td>
                              <td>{item?.status}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )}

              {activeSection === 'logout' && (
                <div className="logout-section">
                  <h3>Logout</h3>
                  <p>Are you sure you want to log out?</p>
                  <button className="theme-btn style-one" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

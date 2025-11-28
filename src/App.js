import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Page404 from "./pages/404/Page404";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import { useSelector } from "react-redux";
import { useRefreshMutation } from "./features/auth/authApiSlice";
import { selectCurrentUser } from "./features/auth/authSlice";

const App = () => {
  const { pathname } = useLocation();
  const [refresh] = useRefreshMutation();
  const user = useSelector(selectCurrentUser);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Auto-refresh token ONCE on app load if user exists in persisted state
  useEffect(() => {
    if (user && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refresh();
    }
  }, []); // Empty dependency array - only run once on mount

  // Global Socket Listener
  useEffect(() => {
    if (user?.id) {
      import("./socket").then(({ socket }) => {
        socket.emit('joinRoom', user.id);

        const handleStatusUpdate = (data) => {
          const { orderId, status } = data;
          import("react-hot-toast").then(({ toast }) => {
            toast.success(`Order #${orderId.slice(-8).toUpperCase()} is now ${status}`);
          });
        };

        socket.on('orderStatusUpdated', handleStatusUpdate);

        return () => {
          socket.off('orderStatusUpdated', handleStatusUpdate);
        };
      });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="menu/:catg" element={<ProductList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<LoginPage isLogin={true} />} />
        <Route path="signup" element={<LoginPage isLogin={false} />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:resetToken" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="profile/:section" element={<Profile />} />
        </Route>

        <Route path="*" element={<Page404 />} />
      </Route>

      {/* Admin Routes - Outside MainLayout */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default App;

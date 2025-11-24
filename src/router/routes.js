// D:\projects\foodie\foodie\src\routes.js
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import Cart from "../pages/cart/Cart";
import Profile from "../pages/profile/Profile";
import LoginPage from "../pages/LoginPage";
import Page404 from "../pages/404/Page404";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Admin imports
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import AdminRoute from "../components/AdminRoute";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/menu/:catg", element: <ProductList /> },
  { path: "/cart", element: <Cart /> },
  { path: "/profile/:section", element: <Profile />, isProtected: true },
  { path: "/login", element: <LoginPage isLogin={true} /> },
  { path: "/signup", element: <LoginPage isLogin={false} /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:resetToken", element: <ResetPassword /> },

  // Admin routes
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "orders", element: <Orders /> },
      { path: "users", element: <Users /> },
    ]
  },

  { path: "*", element: <Page404 /> },
];

export default routes;

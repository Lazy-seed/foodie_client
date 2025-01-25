// D:\projects\foodie\foodie\src\routes.js
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import Cart from "../pages/cart/Cart";
import Profile from "../pages/profile/Profile";
import LoginPage from "../pages/LoginPage";
import Page404 from "../pages/404/Page404";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/menu/:catg", element: <ProductList /> },
  { path: "/cart", element: <Cart /> },
  { path: "/profile/:section", element: <Profile />, isProtected: true },
  { path: "/login", element: <LoginPage isLogin={true} /> },
  { path: "/signup", element: <LoginPage isLogin={false} /> },
  { path: "*", element: <Page404 /> },
];

export default routes;

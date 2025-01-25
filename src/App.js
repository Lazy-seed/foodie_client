// D:\projects\foodie\foodie\src\App.js
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import routes from "./routes/routes"; // Import routes array
import Footer from "./utilities/Footer";
import Navbar from "./utilities/Navbar";
import ProtectedRoute from "./utilities/ProtectedRoute.js";

const App = () => {
  const { pathname } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Check user login status

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Navbar />
      <Routes>
        {routes.map(({ path, element, isProtected }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedRoute isProtected={isProtected} isLoggedIn={isLoggedIn}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

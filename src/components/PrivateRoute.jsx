import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

const PrivateRoute = () => {
    const user = useSelector(selectCurrentUser);

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

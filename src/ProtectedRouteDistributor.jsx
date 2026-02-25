import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRouteDistributor() {
  
    // const isAuth = useAuth();
    const [distributor, setDistributor] = useState(localStorage.getItem("role") == 1 ? true : null);
    //   const routeRetailer = <Navigate to="/retailer" />
    // console.log(distr);
    //   const isAuth = localStorage.getItem("role");
    return distributor ? <Outlet /> : <Navigate to="*" />;
}

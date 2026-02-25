import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
// const useAuth = () => {
//   const user = { loggedIn: localStorage.getItem("token") };
//   return user && user.loggedIn;
// };

function ProtectedRouteRetailer() {
  const navigate = useNavigate();
  // const isAuth = useAuth();
  const [retailer, setRetailer] = useState(localStorage.getItem("role") == 2 ? true : null);
  //   const routeRetailer = <Navigate to="/retailer" />
  console.log(retailer);
  //   const isAuth = localStorage.getItem("role");
  return retailer ? <Outlet /> : <Navigate to="*" />;
}

export default ProtectedRouteRetailer;

import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
// const useAuth = () => {
//   const user = { loggedIn: localStorage.getItem("token") };
//   return user && user.loggedIn;
// };

function ProtectedRoutes() {
  const navigate = useNavigate();
  // const isAuth = useAuth();
  const isAuth = localStorage.getItem("token");
  return isAuth ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default ProtectedRoutes;

import Layout from "./components/Distributor/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/auth/SignUpPage";
import ChooseRolePage from "./pages/auth/ChooseRolePage";
// import SignInPage from "./pages/auth/Simple";
import SignInPage from "./pages/auth/SignInPage";
import Landing from "./pages/auth/Landing";
import ProductDistributor from "./pages/distributor/ProductDistributor";
import HomeDistributor from "./pages/distributor/HomeDistributor";
import AddProductDistributor from "./pages/distributor/AddProductDistributor";
import ProtectedRoutes from "./ProtectedRoutes";
import Simple from "./pages/auth/Simple";
import UpdateProductDistributor from "./pages/distributor/UpdateProductDistributor";
import ReportDistributor from "./pages/distributor/ReportDistributor";
import Complete from "./components/Distributor/OrderPage/Complete";
import History from "./components/Distributor/History";
import OrderHistory from "./components/Distributor/OrderHistory";
import Home from "./pages/retailer/Home";
import HomeComponent from "./pages/retailer/homepage/HomeComponent";
import TestingImage from "./components/Distributor/TestingImage";
import Account from "./pages/distributor/Account";
import StorePage from "./pages/distributor/StorePage";
import NewImport from "./components/Distributor/NewImport";
import Product from "./components/Distributor/OrderPage/Product";

import ReportPageRetailer from "./pages/retailer/ReportPageRetailer";
import OrderPage from "./components/retailler/OrderPage";
import RetailProduct from "./components/retailler/RetailProduct";
import AccountRetailer from "./pages/retailer/AccountRetailer";
import DistributorStoreRetailer from "./pages/retailer/DistributorStoreRetailer";
import DistributorStoreProfile from "./pages/retailer/DistributorStoreRetailer";
import AllProducts from "./pages/retailer/AllProducts";
import Skincare from "./pages/retailer/Skincare";
import Favorite from "./pages/retailer/CategoryBeverages";
import CategoryBeverages from "./pages/retailer/CategoryBeverages";
import CategorySkincare from "./pages/retailer/CategorySkincare";
import CategorySnack from "./pages/retailer/CategorySnack";
import Order from "./components/Distributor/OrderPage/Order";
import DraftHistory from "./components/retailler/DraftHistory";
import OrderHistoryRetail from "./components/retailler/OrderHistoryRetail";
import FavoriteProduct from "./pages/retailer/FavoriteProduct";
import NotfoundRetialer from "./pages/retailer/NotfoundRetailer";
import NotfoundDistributor from "./pages/distributor/NotfoundDistributor";
import NotFoundRetailer from "./pages/retailer/NotfoundRetailer";
import ProtectedRouteRetailer from "./ProtectedRouteRetailer";
import ProtectedRouteDistributor from "./ProtectedRouteDistributor";
import TestUploadImageFirebase from "./TestUploadImageFirebase";
import { useEffect } from "react";
import ScrollToTop from "./ScrollToTop";
import SearchingRetailer from "./components/retailler/SearchingRetailer";
import { StoreSkeleton } from "./components/Skeletons/StoreSkeleton";
import ProfileSkeleton from "./components/Skeletons/profile/ProfileSkeleton";
import AddProductForm from "./pages/distributor/TestingDynamicForm";
import SkeletonSearchCard from "./components/retailler/skeletons/SkeletonSearchCard";
import OneSignal from 'react-onesignal';
import NewOrder from "./components/Distributor/OrderPage/NewOrder";
import { ToastContainer } from 'react-toastify';
import HomepageSkeleton from "./components/retailler/skeletons/HomepageSkeleton";

function App() {
  useEffect(() => {
    OneSignal.init({
      appId: "aaa38faa-9476-4e23-9c0c-037a9fac31ce"
    });
  }, []);
  return (
    <div className="font-Poppins ">
      {/* <ReportPageRetailer/> */}
      {/* <div>Hello</div> */}
      {/* <LoginPage></LoginPage> */}
      {/* <SignUpPage></SignUpPage> */}
      {/* <ChooseRolePage></ChooseRolePage> */}
      {/* <SignInPage></SignInPage> */}
      {/* <Landing></Landing> */}
      {/* <Simple></Simple> */}
      <ToastContainer />
      <BrowserRouter>
        <ScrollToTop />
          <Routes>
          <Route path="/" element={<Landing></Landing>} />
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>} />
          <Route path="/sign-in" element={<SignInPage></SignInPage>} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<ProtectedRouteDistributor />}>
              <Route path="/distributor" element={<Layout />}>
                <Route path="home" element={<HomeDistributor />} />
                <Route path="account" element={<Account />} />
                <Route path="store" element={<StorePage/>} />
                <Route path="category" element={<Simple></Simple>} />
                <Route path="product" element={<ProductDistributor />} />
                <Route path="add-product" element={<AddProductForm/>} />
                <Route
                  path="update-product"
                  element={<UpdateProductDistributor />}
                />
                <Route path="report" element={<ReportDistributor />} />
                <Route path="order" element={<Order />} />
                <Route path="order-history" element={<OrderHistory />} />
                <Route path="history" element={<History />} />
                <Route path="test" element={<Simple />} />
                <Route path="*" element={<NotfoundDistributor />} />
                <Route path="import-product" element={<NewImport />} />
              </Route>
            </Route>
            <Route path="/" element={<ProtectedRouteRetailer />}>
              <Route path="/retailer" element={<Home/>}>
                <Route path="home" element={<HomeComponent />} />
                <Route path="order" element={<OrderPage />} />
                <Route path="report" element={<ReportPageRetailer />} />
                <Route path="profile" element={<AccountRetailer/>} />
                <Route path="beverage" element={<CategoryBeverages />} />
                <Route path="draft" element={<DraftHistory />} />
                <Route path="favorite" element={<FavoriteProduct />} />
                <Route path="order-history" element={<OrderHistoryRetail />} />
                <Route
                  path="distributor-shop"
                  element={<DistributorStoreRetailer />}
                />
             
                <Route path="searching-shop" element={<SearchingRetailer/>}/>

                <Route path="*" element={<NotFoundRetailer />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotfoundDistributor />}></Route>
          </Routes>
        {/* </ScrollToTop> */}
      </BrowserRouter>
      
      {/* <TestUploadImageFirebase/>

      {/* <TestingImage/> */}

      {/* <HomeComponent/> */}

      {/* <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/home' element={}
                </Routes>
            </Layout>
        </BrowserRouter> */}
      {/* <Order/> */}
      {/* <Complete/> */}
      {/* <ImportHistory/> */}
      {/* <OrderHistory/> */}
      {/* <Order/> */}
      {/* <Order */}
      {/* <OrderPage/> */}
      {/* <OrderHistory/> */}
      {/* <NewOrder/> */}
      {/* <NewOrder/> */}
      {/* <History/> */}
      {/* <NewImport/> */}
      {/* <OrderPage/> */}
      {/* <Invoice/> */}
      {/* <AddProductDistributor/> */}
      {/* <NewImport/>   */}
      {/* <Order/> */}
      {/* <OrderPage/> */}
      {/* <RetailProduct/> */}
      {/* <SearchingRetailer/> */}
    </div>
  );
}
export default App;

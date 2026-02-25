import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { BsArrowLeftCircle } from "react-icons/bs";
import { BsFillBagPlusFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { FaBox } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { AiFillAppstore } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";

import { HiDocumentReport, HiOutlineExclamationCircle } from "react-icons/hi";
import { MdWorkHistory } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { GoChecklist } from "react-icons/go";

import Logo from "../../assets/images/logo.svg";
import HamburgerButton from "../HamburgerMenuButton/HamburgerButton";
import Navbar from "./Navbar";
import { Button, Modal, Pagination, TextInput } from "flowbite-react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  add_new_category,
  delete_category,
  get_all_category,
  update_category,
} from "../../redux/services/distributor/category.service";
import {
  addNewCategoryDistributor,
  deleteCategoryDistributor,
  getAllCategoryDistributor,
  updateCategoryDistributor,
} from "../../redux/slices/distributor/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { api } from "../../utils/api";
import { addNewImportProduct } from "../../redux/slices/distributor/importedPrice";
import { addNewProduct } from "../../redux/slices/distributor/addProductSlice";
import { current } from "@reduxjs/toolkit";
import NewImport from "./NewImport";
import { CategoryComponent } from "./CategoryComponent";
import { getAllProduct } from "../../redux/slices/distributor/productSlice";
import { getDataStore } from "../../redux/slices/distributor/storeSlice";
import { getAccountDistributer } from "../../redux/slices/distributor/AccountSlice";

const LoginSchema = Yup.object().shape({
  name: Yup.string().required("Please enter a category"),
});

// main class
const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const [cat, setCat] = useState("");

  const Menus = [
    { title: "Home", path: "/distributor/home" },
    { title: "Product", path: "/distributor/product" },
    { title: "Category"},
    { title: "Order", path: "/distributor/order" },
    { title: "Report", path: "/distributor/report" },
    { title: "Order history", path: "/distributor/order-history" },
    { title: "Account", path: "/distributor/account" },
    { title: "Sign out" },
  ];

  const [navHome, setNavHome] = useState(false);
  const dispatch = useDispatch();

  // ===================== sign out =================
  const [showSignOut, setShowSignOut] = useState(false);
  const handleSignOut = () => {
    localStorage.clear();
    // localStorage.removeItem("token");
    dispatch(getAllProduct([]));
    dispatch(getAllCategoryDistributor([]));
    dispatch(getDataStore([]));
    dispatch(getAccountDistributer([]));
    navigate("/");
  };

  const [isOpenNewImport, setIsOpenNewImport] = useState(false);
  const handleShowImport = () => {
    setIsOpenNewImport(!isOpenNewImport);
  };
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const handleShowCategory = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  return (
    <>
      <div className="sticky top-0 lg:h-screen">
        <ToastContainer />
        <div
          className={`
            w-full
            hidden lg:block relative h-screen duration-300 bg-white border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <div class="w-[70%] flex justify-center m-auto">
              <img
                src={require("../../assets/images/distributor/LOGO_final.png")}
                alt=""
                className=""
              />
            </div>
          </div>
          <hr className="p-[1px] bg-gray-2  00 my-5" />
          <div id="docs-sidebar">
            <nav class="hs-accordion-group" data-hs-accordion-always-open>
              <ul class="w-full">
                <li></li>
                {/* Home */}
                <li className="">
                  <NavLink
                    to="/distributor/home"
                    // onClick={OnNavHome}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primaryColor shadow-md flex  items-center gap-x-3 p-3 text-base xl:font-medium rounded-lg cursor-pointer dark:text-white  text-white dark:bg-gray-700  dark:hover:bg-gray-700"
                        : "text-black flex shadow-sm items-center gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                    }
                  >
                    <AiFillHome size={22} />
                    Home
                  </NavLink>
                </li>
                {/* Product */}
                <li>
                  <NavLink
                    to="/distributor/product"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primaryColor shadow-md flex  items-center gap-x-3 p-3 text-base xl:font-medium rounded-lg cursor-pointer dark:text-white  text-white dark:bg-gray-700  dark:hover:bg-gray-700"
                        : "text-black flex shadow-sm items-center gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                    }
                  >
                    <FaBox size={20} />
                    Product
                  </NavLink>
                </li>
                {/* Category */}
                <li>
                  <div
                    // to="/distributor/category"
                    onClick={() => setIsOpenCategory(!isOpenCategory)}
                    className={`flex items-center gap-x-3 p-3 shadow-sm text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                    text-gray-900 dark:bg-gray-700
                 `}
                  >
                    <img
                      src={require("../../assets/images/distributor/category.png")}
                      className={`w-[20px]`}
                    />
                    Category{" "}
                    {/* <CategoryComponent
                      isOpenCategory={isOpenCategory}
                      // handleShowCategory={handleShowCategory}
                    /> */}
                  </div>

                  {isOpenCategory ? (
                    <CategoryComponent
                      isOpenCategory={isOpenCategory}
                      handleShowCategory={handleShowCategory}
                    />
                  ) : (
                    <></>
                  )}
                </li>
                {/* Order */}
                <li>
                  <NavLink
                    to="/distributor/order"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primaryColor shadow-md flex  items-center gap-x-3 p-3 text-base xl:font-medium rounded-lg cursor-pointer dark:text-white  text-white dark:bg-gray-700  dark:hover:bg-gray-700"
                        : "text-black flex shadow-sm items-center gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                    }
                  >
                    {/* <img
                      src={require("../../assets/images/distributor/order.png")}
                    /> */}
                    <BsFillBagPlusFill size={20} />
                    Order
                  </NavLink>
                </li>
                {/* Report */}
                <li>
                  <NavLink
                    to="/distributor/report"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primaryColor shadow-md flex  items-center gap-x-3 p-3 text-base xl:font-medium rounded-lg cursor-pointer dark:text-white  text-white dark:bg-gray-700  dark:hover:bg-gray-700"
                        : "text-black flex shadow-sm items-center gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                    }
                  >
                    {/* <img
                      src={require("../../assets/images/distributor/report.png")}
                    />
                     */}
                    <span className="-ml-1">
                      {" "}
                      <HiDocumentReport size={26} />
                    </span>
                    Report
                  </NavLink>
                </li>
                {/* Order history */}
                <li>
                  <NavLink
                    to="/distributor/order-history"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primaryColor shadow-md flex  items-center gap-x-3 p-3 text-base xl:font-medium rounded-lg cursor-pointer dark:text-white  text-white dark:bg-gray-700  dark:hover:bg-gray-700"
                        : "text-black flex shadow-sm items-center gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                    }
                  >
                    <GoChecklist size={26} />
                    Order history
                  </NavLink>
                </li>
                {/* Import */}
                <li class="hs-accordion" id="account-accordion">
                  <div
                    class="hs-accordion-toggle shadow-sm  flex gap-x-3 p-3   hs-accordion-active:hover:bg-transparent  text-slate-700  dark:bg-gray-800  dark:hover:text-slate-300 dark:hs-accordion-active:text-white `flex items-center text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                     "
                  >
                    <img
                      src={require("../../assets/images/distributor/import.png")}
                    />
                    Import
                    <svg
                      class="hs-accordion-active:block ml-auto hidden w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                    <svg
                      class="hs-accordion-active:hidden ml-auto block w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                  </div>

                  <div
                    id="account-accordion"
                    class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                  >
                    <ul class="pt-2 pl-2">
                      <li>
                        <div
                          onClick={handleShowImport}
                          className="text-black flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                        >
                          <span className="ml-7">New import </span>
                        </div>
                      </li>
                      <NewImport
                        isOpenNewImport={isOpenNewImport}
                        handleShowImport={handleShowImport}
                        // data={123}
                      />
                      <li>
                        <NavLink
                          to="/distributor/history"
                          className={({ isActive }) =>
                            isActive
                              ? "bg-primaryColor text-white  flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                              : "text-black flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                          }
                        >
                          <span className="ml-7">History</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
                {/* Profile */}
                <li class="hs-accordion" id="account-accordion">
                  <a
                    class="hs-accordion-toggle shadow-sm  flex gap-x-3 p-3  hs-accordion-active:hover:bg-transparent  text-slate-700  dark:bg-gray-800  dark:hover:text-slate-300 dark:hs-accordion-active:text-white `flex items-center text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                     "
                    href="javascript:;"
                  >
                    <img
                      src={require("../../assets/images/distributor/user.png")}
                    />
                    Profile
                    <svg
                      class="hs-accordion-active:block ml-auto hidden w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                    <svg
                      class="hs-accordion-active:hidden ml-auto block w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></path>
                    </svg>
                  </a>

                  <div
                    id="account-accordion"
                    class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                  >
                    <ul class="pt-2 pl-2">
                      <li>
                        <NavLink
                          to="/distributor/account"
                          className={({ isActive }) =>
                            isActive
                              ? "bg-primaryColor text-white  flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                              : "text-black flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                          }
                        >
                          <span className="ml-7">Account</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/distributor/store"
                          className={({ isActive }) =>
                            isActive
                              ? "bg-primaryColor text-white  flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                              : "text-black flex text-sm items-center gap-x-1 p-3 rounded-lg cursor-pointer dark:text-white hover:bg-gray-200   dark:bg-gray-700  dark:hover:bg-gray-700 "
                          }
                        >
                          <span className="ml-7">Store</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
                {/* Sign out */}
                <li>
                  <div
                    onClick={() => setShowSignOut(true)}
                    className={`flex items-center shadow-sm gap-x-3 p-3 text-base font-medium rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                      text-gray-900 dark:bg-gray-700
                   `}
                  >
                    <img
                      src={require("../../assets/images/distributor/logout.png")}
                    />
                    Sign out
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="pt-3">
          <HamburgerButton
            setMobileMenu={setMobileMenu}
            mobileMenu={mobileMenu}
          />
        </div>
        <div className="lg:hidden ">
          <div
            className={`${
              mobileMenu ? "flex " : "hidden"
            } bg-white absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold w-44 left-2 dark:text-white   dark:bg-slate-800 drop-shadow md rounded-xl`}
          >
            {Menus.map((menu, index) => (
              <Link
              to={menu.path}
                key={index}
                onClick={() => {
                  
                  if ( index === 2){
                    setIsOpenCategory(!isOpenCategory)
                    console.log("first item selected")
                    return;
                  }
                  if (index === 7) {
                    handleSignOut(); // Call the handleSignOut function
                  }
                  setMobileMenu(false);
                }}
              >
                <span
                  className={` ${
                    location.pathname === menu.path &&
                    "bg-primaryColor dark:bg-gray-700 text-white"
                  } py-2 px-5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  {menu.title}
                  {/* {isOpenCategory ? (
                    <CategoryComponent
                      isOpenCategory={isOpenCategory}
                      handleShowCategory={handleShowCategory}
                    />
                  ) : (
                    <></>
                  )} */}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {/* Sign out */}
        <React.Fragment>
          <Modal show={showSignOut} size="md" popup={true}>
            <Modal.Body>
              <div className="relative flex -mx-6 -mt-6 items-center justify-center py-2 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
                <h1 className="text-white font-bold text-2xl text-center">
                  Sign Out
                </h1>
                <button
                  className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowSignOut(false)}
                >
                  <img
                    src={require("../../assets/images/closeWhite.png")}
                    className="w-[20px]"
                    alt=""
                  />
                </button>
              </div>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto my-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Do you want to sign out ?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleSignOut}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowSignOut(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>
      </div>
    </>
  );
};

export default Sidebar;

import { Avatar, Button, Dropdown, Modal } from "flowbite-react";
import React, { useState } from "react";
import Toggle from "./ThemeToggle";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { color } from "@mui/system";
import { AllNotification } from "./notification/AllNotification";
import { NewOrderNotification } from "./notification/NewOrderNotification";
import { OutofStockNotification } from "./notification/OutofStockNortification";
import { CancelNotification } from "./notification/CancelNofitication";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import noImage from "../../assets/images/distributor/account.png";
import { getAccountDistributer } from "../../redux/slices/distributor/AccountSlice";
import { get_account_distributor } from "../../redux/services/distributor/account.service";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getDataStore } from "../../redux/slices/distributor/storeSlice";
import { get_store_distributor_profile } from "../../redux/services/distributor/store.service";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getAllProduct } from "../../redux/slices/distributor/productSlice";
import { getAllCategoryDistributor } from "../../redux/slices/distributor/categorySlice";
import {
  getAllNotificationsDistributor,
  setLoadingNewOrder,
  setReadAllNotificationsDistributor,
} from "../../redux/slices/distributor/notification/notificationSlice";
import {
  get_all_notification,
  get_all_notification_withoutLoading,
  read_all_notification_distributor,
} from "../../redux/services/distributor/notification.service";
import { over } from "stompjs";
import SockJS from "sockjs-client";
const Navbar = () => {
  const dispatch = useDispatch();
  const [emptyAccount, setEmptyAccount] = useState(false);
  
  // console.log("Account: ", account);
  // if (account == "") {
  //   setEmptyAccount(true);
  // }

  // useEffect(() => {
  //   get_account_distributor().then((res) => {
  //     dispatch(getAccountDistributer(res.data.data));
  //   });
  // }, get_account_distributor());
  // useEffect(() => {
  //   get_account_distributor().then((res) => {
  //     // if (res.response.data.status == 404) {
  //     //   toast.warn("Please create your shop");
  //     // }
  //     dispatch(getAccountDistributer(res.data.data));
  //   });
  // }, [get_account_distributor]);





  useEffect(() => {
    get_account_distributor()
      .then((res) => {
        if (res.status === 404 || res.status === 409 || res.status === 401) {
          dispatch(
            getAccountDistributer({
              firstName: "",
              lastName: "",
              gender: "",
              address: "",
              primaryPhoneNumber: "",
              profileImage: "",
              additionalPhoneNumber: [],
            }))
            setEmptyAccount(true);
        }else{
          dispatch(getAccountDistributer(res.data.data));
          setEmptyAccount(false);
        }
        // dispatch(getAccountDistributer(res.data.data));
        // setEmptyAccount(false);
      })
      .catch((e) => {
        setEmptyAccount(true);
      });
  }, []);
  const account = useSelector((state) => state.account.data);
  const navigate = useNavigate();
  const countNotifications = (count) => {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  };
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const toggleTab1 = () => {
    toggleTab(1);
  };
  const toggleTab2 = () => {
    toggleTab(2);
  };
  const toggleTab3 = () => {
    toggleTab(3);
  };
  const toggleTab4 = () => {
    toggleTab(4);
  };
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -9,
      top: 5,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      background: "#00b7c9",
    },
  }));

  // ================= sign out =======================
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
  // ================== get store name =================
  const [noDataStore, setNoDataStore] = useState(false);
  useEffect(() => {
    get_store_distributor_profile().then((res) => {
      if (res.status === 404 || res.status === 409 || res.status === 401) {
        setNoDataStore(true);
        dispatch(
          getDataStore({
            name: "",
            bannerImage: "",
            address: "",
            primaryPhone: "",
            additionalPhone: [],
            description: "",
            isPublish: true,
          })
        );
      } else {
        setNoDataStore(false);
        dispatch(getDataStore(res.data.data));
      }
    });
  }, []);

  const storeList = useSelector((state) => state.shop.store);
  console.log(storeList);
  // ============================= All Notifications =============================
  const [noDataNotifications, setNoDataNotifications] = useState(false);
   // ===================== websocket =================
   var stompClient = null;
   const Sock = null;
   const connect = () => {
     const Sock = new SockJS("http://localhost:8888/ws");
     stompClient = over(Sock);
     stompClient.connect({}, onConnected, onError);
     console.log("WS connected");
   };
   const disconnectFromSocket = () => {
     if (Sock) {
       Sock.close();
     }
   };
   const onConnected = () => {
     console.log("/user/" + localStorage.getItem("userId") + "/private");
     stompClient.subscribe(
       "/user/" + localStorage.getItem("userId") + "/private",
       onPrivateMessage
     );
     userJoin();
   };
   const userJoin = () => {
     var chatMessage = {
       status: "JOIN",
     };
     stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
   };
   const onPrivateMessage = (payload) => {
     var payloadData = JSON.parse(payload.body);
     console.log(payloadData);
     switch (payloadData.status) {
       case "ORDER":
        get_all_notification_withoutLoading().then((res) => {
          if (res.status === 404) {
            // toast.error("Something went wrong");
            setNoDataNotifications(true);
          } else {
            dispatch(getAllNotificationsDistributor(res.data.data));
            setNoDataNotifications(false);
            // console.log("Hellloooooo");
          }
        });
         break;
     }
   };
   const onError = (err) => {
     console.log(err);
   };
   useEffect(() => {
     connect();
   }, []);
 

  useEffect(() => {
    get_all_notification(dispatch).then((res) => {
      if (res.status === 404) {
        // toast.error("Something went wrong");
        setNoDataNotifications(true);
        dispatch(setLoadingNewOrder(false));
      } else {
        dispatch(getAllNotificationsDistributor(res.data.data));
        setNoDataNotifications(false);
        dispatch(setLoadingNewOrder(false));
        // console.log("Hellloooooo");
      }
    });
  }, []);
  const allNotifications = useSelector(
    (state) => state.allDataNotification.dataNotification
  );
  // console.log("notifications", allNotifications);

  // ===================== get data only unseen notifications =================
  const dataCountUnseen = allNotifications.filter(
    (item) => item.seen === false
  ).length;
  // console.log("first notification",dataCountUnseen);

  // =================== counters new order =================
  const dataCountNewOrder = allNotifications.filter(
    (item) => item.notificationType === "NEW_ORDER" && item.seen === false
  ).length;
  const dataCountOrderComplete = allNotifications.filter(
    (item) => item.notificationType === "ORDER_COMPLETE" && item.seen === false
  ).length;
  const totalNotificationNewOrderComplete =
    dataCountNewOrder + dataCountOrderComplete;

  // ================= counters out of stocks =================

  const dataCountOutOfStock = allNotifications.filter(
    (item) =>
      item.notificationType === "OUT_OF_STOCK_NOTIFICATION" &&
      item.seen === false
  ).length;

  // ================= counters order cancelled =================

  const dataCountCanCelled = allNotifications.filter(
    (item) => item.notificationType === "ORDER_CANCELLED" && item.seen === false
  ).length;

  // ================== mark all as read =================
  const [
    showReadAllNotificationsDistributor,
    setShowReadAllNotificationsDistributor,
  ] = useState(false);
  const [loadingReadAll, setLoadingReadAll] = useState(false);
  const markAllRead = () => {
    setLoadingReadAll(true);
    read_all_notification_distributor().then((res) => {
      console.log(res);
      if (res.status === 200) {
        dispatch(setReadAllNotificationsDistributor());
        setLoadingReadAll(false);
        setShowReadAllNotificationsDistributor(false);
      } else if (res.status === 404) {
        setLoadingReadAll(false);
        toast.error("Notification to read");
        setShowReadAllNotificationsDistributor(false);
      } else {
        setLoadingReadAll(false);
        toast.error("Something went wrong");
        setShowReadAllNotificationsDistributor(false);
      }
    });
  };

  return (
    <nav className="border-gray-200 rounded ">
      {/* <ToastContainer /> */}
      <div className="lg:w-full sm:flex sm:justify-end items-center gap-3">
        {/* text bar */}
        <div className="lg:w-1/2 hidden lg:block">
          <div className="font-bold text-white">
            <h1 className="text-4xl ">
              Welcome back,
              <span>
                {" "}
                {storeList?.name == "" ? "Store Name" : storeList?.name}
                {console.log(storeList?.name == "")}
              </span>
            </h1>

            <p className="text-lg mt-5">
              Here's what happening with your store today.
            </p>
          </div>
        </div>
        <div className=" lg:w-1/2">
          <div className="flex  justify-end gap-3">
            {/* search bar */}
            {/* <div className="w-[60%] hidden lg:block ">
              <div class="h-full">
                <form>
                  <div class="flex">
                    <div class="relative w-full ">
                      <input
                        type="search"
                        id="search-dropdown"
                        class="rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="Search"
                        required
                      />
                      <button
                        type="submit"
                        class="rounded-tr-full rounded-br-full absolute top-0 right-0 p-2.5 text-sm font-medium text-gray-600 bg-white rounded-r-lg border border-white  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          aria-hidden="true"
                          class="rounded-tr-full rounded-br-full w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        <span class="sr-only">Search</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div> */}
            {/* right navbar */}
            {/* notification */}
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <IconButton aria-label={countNotifications(14)}>
                  <Badge
                    badgeContent={
                      dataCountUnseen == 0 || dataCountUnseen == ""
                        ? "0"
                        : dataCountUnseen
                    }
                    color="error"
                  >
                    <img
                      src={require("../../assets/images/distributor/notificationIcon.png")}
                      className="w-8"
                      alt=""
                    />
                  </Badge>
                </IconButton>
              }
            >
              <Dropdown.Header>
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl text-gray-500 font-bold">
                    Notification
                  </h2>
                  <p
                    className="text-primary cursor-pointer"
                    onClick={() => setShowReadAllNotificationsDistributor(true)}
                  >
                    Mark all as read
                  </p>
                </div>
                <ul class="flex flex-row text-md space-x-8 text-[16px]">
                  <li>
                    <StyledBadge
                      badgeContent={
                        dataCountUnseen == 0 ? "0" : dataCountUnseen
                      }
                      color="secondary"
                    >
                      <a
                        href="#"
                        onClick={toggleTab1}
                        class={
                          toggleState === 1
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        All
                      </a>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        totalNotificationNewOrderComplete == 0
                          ? "0"
                          : totalNotificationNewOrderComplete
                      }
                      color="secondary"
                    >
                      <a
                        href="#"
                        onClick={toggleTab2}
                        class={
                          toggleState === 2
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Order
                      </a>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        dataCountOutOfStock == 0 ? "0" : dataCountOutOfStock
                      }
                      color="secondary"
                    >
                      <a
                        href="#"
                        onClick={toggleTab3}
                        class={
                          toggleState === 3
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Out of stock
                      </a>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        dataCountCanCelled == 0 ? "0" : dataCountCanCelled
                      }
                      color="secondary"
                    >
                      <a
                        href="#"
                        onClick={toggleTab4}
                        class={
                          toggleState === 4
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Cancel
                      </a>
                    </StyledBadge>
                  </li>
                </ul>
                <div>
                  <div className="flex flex-wrap flex-col relative w-full ">
                    <div className="flex-grow-1 ">
                      <div
                        className={
                          toggleState === 1
                            ? " w-full h-full block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <AllNotification toggleTab2={toggleTab1} />
                      </div>
                      <div
                        className={
                          toggleState === 2
                            ? "bg-white w-full h-full block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <NewOrderNotification toggleTab3={toggleTab2} />
                      </div>
                      <div
                        className={
                          toggleState === 3
                            ? "bg-white w-full h-full   block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <OutofStockNotification toggleTab4={toggleTab3} />
                      </div>
                      <div
                        className={
                          toggleState === 4
                            ? "bg-white w-full h-full   block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <CancelNotification toggleTab4={toggleTab4} />
                      </div>
                    </div>
                  </div>
                </div>
              </Dropdown.Header>
            </Dropdown>
            {/* Avatar */}

            <div className="flex items-center gap-3 md:order-2">
              {/* <Dropdown
                  arrowIcon={false}
                  inline={true}
                  label={
                    <Avatar
                      alt="User settings"
                      img={
                        emptyAccount
                          ? noImage
                          : account.profileImage
                      }
                      // onLoad={()=>{

                      // }}
                      // onError
                      rounded={true}
                    />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">
                      {account == ""
                        ? "No Account"
                        : account.firstName + " " + account.lastName}
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {localStorage.getItem("email")}
                    </span>
                  </Dropdown.Header>

                  <Dropdown.Item>
                    <button onClick={handleSignOut}>Sign out</button>
                  </Dropdown.Item>
                </Dropdown> */}
              <button
                type="button"
                class="flex mr-3 text-sm  rounded-full md:mr-0  focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-10 h-10 rounded-full"
                  src={
                    emptyAccount
                      ? noImage
                      : account?.profileImage == "" ||
                        account?.profileImage == null
                      ? noImage
                      : account?.profileImage
                  }
                  alt="user photo"
                />
              </button>
              {/* <!-- Dropdown menu --> */}
              <div
                class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                <div class="px-4 py-3">
                  <span className="block text-lg text-primary">
                    {account == ""
                      ? "No Account"
                      : account?.firstName + " " + account?.lastName}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {localStorage.getItem("email")}
                  </span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                  <li
                    onClick={() => setShowSignOut(true)}
                    className="cursor-pointer"
                  >
                    <button
                      // href="#"

                      class="flex gap-3 px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      <img
                        src={require("../../assets/images/distributor/logoutColor.png")}
                        alt=""
                      />
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>

              <div className="text-lg text-white">
                {emptyAccount
                  ? "No account"
                  : account?.firstName + " " + account?.lastName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <React.Fragment>
        {/* Sign out */}
        <Modal show={showSignOut} size="md" popup={true}>
          <Modal.Body>
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-2 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-xl text-center">
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
              <h3 className="mb-5 font-normal text-gray-500 dark:text-gray-400">
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
        {/* modal read all notification */}
        <Modal
          show={showReadAllNotificationsDistributor}
          size="md"
          popup={true}
        >
          <Modal.Body>
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-2 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-xl text-center">
                Read All Notification
              </h1>
              <button
                className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowReadAllNotificationsDistributor(false)}
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
              <h3 className="mb-5 font-normal text-gray-500 dark:text-gray-400">
                Do you want to read all notification ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={markAllRead}>
                  {loadingReadAll ? (
                    <>
                      <span
                        class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span class="sr-only">Loading...</span>
                      </span>
                      &nbsp; Loading...
                    </>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </Button>
                <Button
                  color="gray"
                  onClick={() => setShowReadAllNotificationsDistributor(false)}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </nav>
  );
};

export default Navbar;

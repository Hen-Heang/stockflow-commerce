import { Avatar, Dropdown, Navbar } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AllNotification from "./notification/AllNotification";
import OrderNotification from "./notification/OrderNotification";
import RestockNotification from "./notification/RestockNotification";
import noImage from "../../assets/images/distributor/account.png";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import trolley from "../../assets/images/empty_trolley.png";
import draft from "../../assets/images/draft-button.png";
import {
  decrement,
  increment,
  set,
} from "../../redux/slices/retailer/itemsQuantitySlice";
import { Modal, Button } from "flowbite-react";
import {
  get_search,
  get_search_category,
} from "../../redux/services/retailer/search.service";
import {
  getSearchCategory,
  getSearchStore,
  setError,
  setLoading,
} from "../../redux/slices/retailer/searchSlice";
import SearchingRetailer from "./SearchingRetailer";
import { get_retailer_profile } from "../../redux/services/retailer/retailerProfile.service";
import { getRetailerInfo } from "../../redux/slices/retailer/retailerProfileSlice";
import {
  add_product_to_cart,
  cancel_order_from_cart,
  confirm_order_from_cart,
  delete_product_in_cart,
  get_all_cart,
  get_all_product_in_cart,
  save_to_draft,
  view_product_in_cart,
} from "../../redux/services/retailer/retailerHomepage.service";
import {
  AddProductToCart,
  cancelProductInCart,
  checkoutProduct,
  deleteProductInCart,
  draftStore2,
  getOrderInCart,
  getProductInCart,
  setStoreId,
} from "../../redux/slices/retailer/homepageSlice/allShopSlice";
import axios from "axios";
import {
  get_all_notification_retailer,
  mark_read_all_notification_retailer,
} from "../../redux/services/retailer/notificationRetailer.service";
import {
  getAllNotificationRetailers,
  setReadAllNotificationsRetailer,
} from "../../redux/slices/retailer/notification/notificationRetailerSlice";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import DeliveringNotification from "./notification/DeliveringNotificaiton";
import ConfirmingNotification from "./notification/ConfirmingNotification";
import RejectNotification from "./notification/RejectNotification";
import { over } from "stompjs";
import SockJS from "sockjs-client";
export default function NavBarRetailerComponent() {
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [success, setSuccess] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [confOrder, setConfOrder] = useState(false);
  // useEffect(()=>{
  //   get_report().then(r=>console.log(r.data.data))
  // },[]);
  const SearchList = useSelector((state) => state.search.item);
  const dispatch = useDispatch();
  //2. then we create state too store what user input
  const [onChangeSearch, setOnChangeSearch] = useState("");
  console.log(onChangeSearch);

  const searchProductByStore = () => {
    setLoadingSearch(true);
    console.log("onChangeSearch", onChangeSearch);
    if (onChangeSearch == "" || onChangeSearch == null) {
      toast.warn("Please input something in search bar");
    } else {
      console.log(111);
      get_search(onChangeSearch, dispatch)
        .then((e) => {
          // console.log("data : ",e.data)
          // console.log(e.response.status)
          if (e.status == 401) {
            console.log("error 401");
            dispatch(setError(true));
            dispatch(setLoading(false));
          }
          if (e.status == 200) {
            console.log("data : ", e.data.data);
            dispatch(getSearchStore(e.data.data));
            dispatch(setLoading(false));
            dispatch(setError(false));
          }
          if (e.status == 404) {
            dispatch(getSearchStore(""));
            dispatch(setLoading(false));
            dispatch(setError(false));
          }
        })
        .catch((err) => {
          dispatch(setLoading(false));
        });
      navigate("/retailer/searching-shop");
      // navigate("/retailer/skeleton-search")
    }
  };

  //1. onchange function use to catch user input
  const handleFormChange = (e) => {
    const data = e.target.value;
    // console.log(data)

    setOnChangeSearch(data);
  };
  const handleClearSearch = () => {
    setOnChangeSearch("");
  };

  const navigate = useNavigate();
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
  const toggleTab5 = () => {
    toggleTab(5);
  };

  const onSignOut = () => {
    navigate("/");
    localStorage.clear();
  };
  const itemsCounter = useSelector((state) => state.itemsCounter);
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("storeId");
  // console.log("id ahahahahahahah ", id)

  const { storeId } = useSelector((state) => state.getDataAllShop);

  const [draf, setDraft] = useState(false);

  const [cart, setCart] = useState([]); // Initialize cart state
  const [productCart, setPorductCart] = useState([]); // Initialize product cart state

  useEffect(() => {
    get_all_product_in_cart().then((e) =>
      dispatch(getProductInCart(e.data.data.products))
    );
    get_all_product_in_cart().then((e) =>
      dispatch(getOrderInCart(e.data.data.order))
    );
  }, []);

  // useEffect(()=> {
  //   get_all_product_in_cart().then((e) => dispatch(getOrderInCart(e.data.data.products)));

  // },[]);
  const { orderInCartData } = useSelector((state) => state.getDataAllShop);
  // console.log("orderInCartData : ",orderInCartData)

  // console.log("productInCartData", productInCartData);
  const counter = useSelector((state) => state.itemsCounter);
  // console.log("hahahahaa",counter)
  const productData = useSelector((state) => state.getDataAllShop.productData);

  useEffect(() => {
    const storedCounter = JSON.parse(localStorage.getItem("counter"));
    if (storedCounter) {
      setCounterLocalStorage(storedCounter);
    }
  }, [localStorage.getItem("counter")]);

  const [disabledButtons, setDisabledButtons] = useState(new Set());
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(new Set()); // Initialize the loading state for products
  const [loadingProducts2, setLoadingProducts2] = useState(new Set()); // for decrement button
  const [counterLocalStorage, setCounterLocalStorage] = useState(
    JSON.parse(localStorage.getItem("counter")) || {}
  );
  const localStoreId = localStorage.getItem("storeIdLocalStorage");
  const localStoreName = localStorage.getItem("storeNameLocalStorage");

  // handleDecrement button-
  const handleDecrement = async (productId) => {
    setDisabledButtons((prevDisabledButtons) => {
      setIsButtonDisabled(false);

      const updatedDisabledButtons = new Set(prevDisabledButtons);
      updatedDisabledButtons.add(productId);
      return updatedDisabledButtons;
    });

    setLoadingProducts2((prevLoadingProducts) =>
      new Set(prevLoadingProducts).add(productId)
    ); // Start loading indicator for the current product

    const currentValue = parseInt(counterLocalStorage[productId] || 0);
    // console.log("gagagag",currentValue);
    if (currentValue === 1) {
      delete_product_in_cart(productId).then(
        dispatch(deleteProductInCart(productId))
      );

      const updatedCounters = { ...counterLocalStorage };
      delete updatedCounters[productId];
      localStorage.setItem("counter", JSON.stringify(updatedCounters));

      // Dispatch the custom event to notify other components about the local storage update
      const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
        detail: updatedCounters,
      });
      window.dispatchEvent(localStorageUpdatedEvent);

      const productNull = productInCartData.length === 1;
      //  console.log("wtf",productNull)
      if (productNull) {
        cancel_order_from_cart();
        // console.log('niceeeeeeeeeee')
      }
    }
    if (currentValue > 0) {
      const product = productInCartData.find(
        (item) => item.productId === productId
      );
      const qty = currentValue - 1;

      if (product) {
        if (product.qty < qty) {
          toast.warn("This product is out of stock");
        } else {
          try {
            const startTime = performance.now(); // Track start time of API call
            const response = await add_product_to_cart(
              localStoreId,
              productId,
              qty
            );
            const endTime = performance.now(); // Track end time of API call
            dispatch(AddProductToCart(response.data.data));

            // decrement the counter
            dispatch(decrement({ productId }));
          } catch (error) {
            // catch (error) {
            //     console.error(error);
            //   // if(error.response.status==500 ){
            //   //   toast.error("hahahahaha .");
            //   // }
            //   // toast.error("You can only have one cart at a time.");
            // }
            if (error.response) {
              console.log(" error.response : ", error.response); // Log the error response object
              const { status, data } = error.response;

              //         if (status === 500) {
              // toast.error("An internal server error occurred.");}
            } else {
              // console.error("error ",error); // Log the error object
              // Handle other types of errors
              console.log("first");
            }
          }
        }
      } else {
        // decrement the counter
        dispatch(decrement({ productId }));
      }

      const updatedCounters = { ...counterLocalStorage, [productId]: qty };
      setCounterLocalStorage(updatedCounters);
      localStorage.setItem("counter", JSON.stringify(updatedCounters));
      const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
        detail: updatedCounters,
      });
      window.dispatchEvent(localStorageUpdatedEvent);
      // }
    }
    setLoadingProducts2((prevLoadingProducts) => {
      const updatedLoadingProducts = new Set(prevLoadingProducts);
      updatedLoadingProducts.delete(productId);
      return updatedLoadingProducts;
    }); // Stop loading indicator for the current product

    setDisabledButtons((prevDisabledButtons) => {
      const updatedDisabledButtons = new Set(prevDisabledButtons);
      updatedDisabledButtons.delete(productId);
      return updatedDisabledButtons;
    }); // Re-enable the button
  };

  // button handleInputChange
  const [isLoadingInputs, setIsLoadingInputs] = useState(new Set());
  const { productInCartData } = useSelector((state) => state.getDataAllShop);

  const timeoutRef = useRef(null);

  const handleInputChange = async (productId, e) => {
    const value = parseInt(e.target.value);
    const product = productInCartData.find(
      (item) => item.productId === productId
    );

    if (value === 0) {
      delete_product_in_cart(productId).then(
        dispatch(deleteProductInCart(productId))
      );
      const productNull = productInCartData.length === 1;
      if (productNull) {
        cancel_order_from_cart();
      }
    }

    if (isNaN(value)) {
      return null;
    }

    if (value > 0) {
      if (product) {
        if (product.inStock < value) {
          toast.warn("This product is out of stock");
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          setIsLoadingInputs((prevLoadingInputs) => {
            const updatedLoadingInputs = new Set(prevLoadingInputs);
            updatedLoadingInputs.add(productId);
            return updatedLoadingInputs;
          });

          const startTime = performance.now();
          const response = await add_product_to_cart(
            localStoreId,
            productId,
            value
          );
          const endTime = performance.now();

          if (response.status === 409) {
            toast.error("Oops, you can only have one cart at a time.");
            setIsLoadingInputs((prevLoadingInputs) => {
              const updatedLoadingInputs = new Set(prevLoadingInputs);
              updatedLoadingInputs.delete(productId);
              return updatedLoadingInputs;
            });
          }

          dispatch(AddProductToCart(response.data.data));
          dispatch(set({ productId, quantity: value }));

          setIsLoadingInputs((prevLoadingInputs) => {
            const updatedLoadingInputs = new Set(prevLoadingInputs);
            updatedLoadingInputs.delete(productId);
            return updatedLoadingInputs;
          });
        }, 1000);
      } else {
        dispatch(set({ productId, quantity: value }));
      }
    }

    const updatedCounters = { ...counterLocalStorage, [productId]: value };
    setCounterLocalStorage(updatedCounters);
    localStorage.setItem("counter", JSON.stringify(updatedCounters));
    const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
      detail: updatedCounters,
    });
    window.dispatchEvent(localStorageUpdatedEvent);
  };

  const handleIncrement = async (productId) => {
    const product = productInCartData.find(
      (item) => item.productId === productId
    );

    setDisabledButtons((prevDisabledButtons) => {
      const updatedDisabledButtons = new Set(prevDisabledButtons);
      updatedDisabledButtons.add(productId);
      return updatedDisabledButtons;
    });

    setLoadingProducts((prevLoadingProducts) =>
      new Set(prevLoadingProducts).add(productId)
    ); // Start loading indicator for the current product

    const currentValue = parseInt(counterLocalStorage[productId] || 0);
    const qty = currentValue + 1;

    if (product) {
      const startTime = performance.now(); // Track start time of API call
      const response = await add_product_to_cart(localStoreId, productId, qty);
      const endTime = performance.now(); // Track end time of API call
      // console.log("localStoreId", localStoreId, productId, qty);
      const apiTime = endTime - startTime;

      // check all error here
      // if()
      if (response.status === 401) {
        toast.error("Opps, something went wrong please try again.");
        setLoadingProducts((prevLoadingProducts) => {
          const updatedLoadingProducts = new Set(prevLoadingProducts);
          updatedLoadingProducts.delete(productId);
          return updatedLoadingProducts;
        });
      }
      if (apiTime > 10000) {
        toast.error("Opps, connection unstable please try again.");
      }
      if (
        response.data.detail == "Not enough product in stock. Fail on count: 1"
      ) {
        toast.warning("Opps, this product is running out of stock.");
        setLoadingProducts((prevLoadingProducts) => {
          const updatedLoadingProducts = new Set(prevLoadingProducts);
          updatedLoadingProducts.delete(productId);
          return updatedLoadingProducts;
        });
      }
      if (
        response.data.detail ==
        "One cart is processing. Can only order once at a time. Please kindly wait for this order to be accepted."
      ) {
        toast.error("Opps, you can only have one cart at a time.");
        setLoadingProducts((prevLoadingProducts) => {
          const updatedLoadingProducts = new Set(prevLoadingProducts);
          updatedLoadingProducts.delete(productId);
          return updatedLoadingProducts;
        });
      }
      if (
        response.data.detail ==
        "User have no profile. Please setup user profile to make order."
      ) {
        toast.error(
          "Opps, you have no profile. Please setup user profile to make order."
        );
        setLoadingProducts((prevLoadingProducts) => {
          const updatedLoadingProducts = new Set(prevLoadingProducts);
          updatedLoadingProducts.delete(productId);
          return updatedLoadingProducts;
        });
      }
      dispatch(AddProductToCart(response.data.data));

      // Increment the counter
      dispatch(increment({ productId }));
      setIsButtonDisabled(false);
    } else {
      // Increment the counter
      dispatch(increment({ productId }));
    }

    setLoadingProducts((prevLoadingProducts) => {
      const updatedLoadingProducts = new Set(prevLoadingProducts);
      updatedLoadingProducts.delete(productId);
      return updatedLoadingProducts;
    }); // Stop loading indicator for the current product

    setDisabledButtons((prevDisabledButtons) => {
      const updatedDisabledButtons = new Set(prevDisabledButtons);
      updatedDisabledButtons.delete(productId);
      return updatedDisabledButtons;
    }); // Re-enable the button

    const updatedCounters = { ...counterLocalStorage, [productId]: qty };
    // if(updatedCounters>=0){
    setCounterLocalStorage(updatedCounters);
    localStorage.setItem("counter", JSON.stringify(updatedCounters));
    const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
      detail: updatedCounters,
    });
    window.dispatchEvent(localStorageUpdatedEvent);
  };

  // onClickDeleteProductInCart
  const onClickDeleteProductInCart = (productId) => {
    delete_product_in_cart(productId).then(
      dispatch(deleteProductInCart(productId))
    );

    const updatedCounters = { ...counterLocalStorage };
    delete updatedCounters[productId];
    localStorage.setItem("counter", JSON.stringify(updatedCounters));

    // Dispatch the custom event to notify other components about the local storage update
    const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
      detail: updatedCounters,
    });
    window.dispatchEvent(localStorageUpdatedEvent);

    const productNull = productInCartData.length === 1;

    if (productNull) {
      localStorage.removeItem("storeIdLocalStorage");
      localStorage.removeItem("storeNameLocalStorage");

      cancel_order_from_cart();
    }
  };

  const handleClickCheckOut = (option) => {
    // confirm_order_from_cart().then((e)=> dispatch(checkoutProduct(e.data.data)))
    const message = "You have new order...!";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    if (option == "yes") {
      confirm_order_from_cart()
        .then(async (response) => {
          // console.log("message from add to cart:", response.data.data.userId);
          // =========== push notification ==============
          const notification = {
            app_id: appId,
            contents: { en: message },
            include_external_user_ids: [response.data.data.userId.toString()],
          };
          console.log("Await notification");
          try {
            const response = await axios.post(
              "https://onesignal.com/api/v1/notifications",
              notification,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ${apiKey}`,
                },
              }
            );

            console.log("Push notification sent successfully:", response.data);
          } catch (error) {
            console.error(
              "Error sending push notification:",
              error.response.data
            );
          }
          dispatch(checkoutProduct(response.data));
        })
        .catch((error) => {
          console.log(error);
          // Handle the error if needed
        });
      // remove data from local storage

      localStorage.removeItem("storeNameLocalStorage");

      const updatedCounters = { ...counterLocalStorage };
      localStorage.removeItem("storeIdLocalStorage");

      for (let key in updatedCounters) {
        delete updatedCounters[key];
      }
      // delete updatedCounters;
      localStorage.setItem("counter", JSON.stringify(updatedCounters));

      // Dispatch the custom event to notify other components about the local storage update
      const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
        detail: updatedCounters,
      });
      window.dispatchEvent(localStorageUpdatedEvent);
      setSuccess(!success);
    } else if (option == "no") {
      setSuccess(!success);
    }
  };

  const handleClickCancel = (option) => {
    if (option == "yes") {
      cancel_order_from_cart().then((e) =>
        dispatch(cancelProductInCart(e.data))
      );
      // remove data from local storage
      localStorage.removeItem("storeIdLocalStorage");
      localStorage.removeItem("storeNameLocalStorage");

      const updatedCounters = { ...counterLocalStorage };

      for (let key in updatedCounters) {
        delete updatedCounters[key];
      }
      // delete updatedCounters;
      localStorage.setItem("counter", JSON.stringify(updatedCounters));

      // Dispatch the custom event to notify other components about the local storage update
      const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
        detail: updatedCounters,
      });
      window.dispatchEvent(localStorageUpdatedEvent);
      setDraft(!draf);
    } else if (option == "no") {
      setDraft(!draf);
    }
  };

  const draftStore = (option) => {
    if (option == "yes") {
      save_to_draft().then((e) => dispatch(draftStore2(e.data)));
      // remove data from local storage

      localStorage.removeItem("storeNameLocalStorage");
      const updatedCounters = { ...counterLocalStorage };
      localStorage.removeItem("storeIdLocalStorage");

      for (let key in updatedCounters) {
        delete updatedCounters[key];
      }
      // delete updatedCounters;
      localStorage.setItem("counter", JSON.stringify(updatedCounters));

      // Dispatch the custom event to notify other components about the local storage update
      const localStorageUpdatedEvent = new CustomEvent("localStorageUpdated", {
        detail: updatedCounters,
      });
      window.dispatchEvent(localStorageUpdatedEvent);
      setSuccess2(!success2);
    } else if (option == "no") {
      setSuccess2(!success2);
    }
  };

  // ================== account =================
  useEffect(() => {
    get_retailer_profile().then((res) => {
      if (res.status == 404) {
        console.log("error", res.status);
        dispatch(
          getRetailerInfo({
            id: null,
            retailerAccountId: null,
            firstName: "unknown",
            lastName: "guest",
            gender: "unknown",
            address: "unknown",
            primaryPhoneNumber: "0XXXXXXXX",
            profileImage:
              "https://firebasestorage.googleapis.com/v0/b/wm-file-upload.appspot.com/o/download.png?alt=media&token=f3aa8608-77b4-4437-af13-993de6ac2e84",
            createdDate: null,
            updatedDate: null,
            additionalPhoneNumber: null,
          })
        );
      }
      if (res.status == 200) {
        dispatch(getRetailerInfo(res.data.data));
      }
    });
  }, []);
  const profile = useSelector((state) => state.retailerProfile.retailerInfo);

  const dropdownRef = useRef(null);

  const handleBackButtonClick = () => {
    const dropdownElement = dropdownRef.current;
    dropdownElement.classList.remove("open");
  };

  //=================================================== Handle all notifications ==========================================
  const [noDataNotifications, setDataNotifications] = useState(false);
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
        get_all_notification_retailer().then((res) => {
          if (res.status == 200) {
            console.log("Notifications : ", res);
            dispatch(getAllNotificationRetailers(res.data.data));
            setDataNotifications(false);
          } else {
            setDataNotifications(true);
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
    get_all_notification_retailer().then((res) => {
      if (res.status == 200) {
        console.log("Notifications : ", res);
        dispatch(getAllNotificationRetailers(res.data.data));
        setDataNotifications(false);
      } else {
        setDataNotifications(true);
      }
    });
  }, getAllNotificationRetailers());
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -9,
      top: 5,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: "0 1px",
      background: "#F15B22",
    },
  }));
  const allDataNotificationRetailer = useSelector(
    (state) => state.DataNotificationRetailer.dataNotificationRetailer
  );
  //                ====== count notifications ======

  const countAllNotificationUnseen = allDataNotificationRetailer.filter(
    (item) => item.seen === false
  ).length;
  // console.log("first notification", countAllNotificationUnseen);
  //                ====== count notifications ORDER_ACCEPTED======

  const countAllNotificationUnseenOrderAccepted =
    allDataNotificationRetailer.filter(
      (item) =>
        item.notificationType === "ORDER_ACCEPTED" && item.seen === false
    ).length;
  //                ====== count notifications ORDER_DELIVERING======

  const countAllNotificationUnseenOrderDelivering =
    allDataNotificationRetailer.filter(
      (item) =>
        item.notificationType === "ORDER_DELIVERING" && item.seen === false
    ).length;
  //                ====== count notifications ORDER_CONFIRMING======

  const countAllNotificationUnseenOrderConfirming =
    allDataNotificationRetailer.filter(
      (item) =>
        item.notificationType === "ORDER_CONFIRMING" && item.seen === false
    ).length;
  //                ====== count notifications ORDER_REJECTED======

  const countAllNotificationUnseenOrderRejected =
    allDataNotificationRetailer.filter(
      (item) =>
        item.notificationType === "ORDER_REJECTED" && item.seen === false
    ).length;

  //    ================== mark read all notifications =================
  const [showModalReadAllNotifications, setShowModalReadAllNotifications] =
    useState(false);
  const handleReadAllNotifications = () => {
    mark_read_all_notification_retailer().then((res) => {
      console.log("result received", res);
      if (res.status == 200) {
        dispatch(setReadAllNotificationsRetailer());
      }
      if (res.status === 401) {
        console.log("Something went wrong");
      }
    });
  };

  const onClickGetDataShop = (id, storeName) => {
    console.log("first", id, storeName);
    // get_store_by_id(id).then((e) => dispatch(getShopById(e.data.data)));

    // get_all_product_by_storeId(id).then((e) =>
    //   dispatch(getAllProductByStoreId(e.data.data))
    // );
    // get_all_category_by_storeId(id).then((e)=> dispatch(getAllCategoryByStoreId(e.data.data)));
    // // const storeId= id;
    dispatch(setStoreId(id));

    dispatch(setStoreId(id)); // Dispatch the setStoreId action
    navigate(
      `/retailer/distributor-shop?storeId=${id}&storeName=${encodeURIComponent(
        storeName
      )}`
    );

    // navigate(`/retailer/distributor-shop/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white sticky top-0 z-50">
      <ToastContainer />
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-4 dark:bg-gray-800 mx-auto ">
        <nav
          className="lg:max-w-[105rem] w-full mx-auto px-3 flex items-center justify-between"
          aria-label="Global"
        >
          <Link
            to="/retailer/home"
            onClick={handleClearSearch}
            className="flex flex-row lg:w-[70px] lg:h-[70px] sm:w-12 w-9 mt-1"
          >
            <img
              src={require("../../assets/images/retailer/retailerLogo01.png")}
              alt=""
              className="rounded-lg "
            />
            <div className=" lg:text-2xl sm:text-base mt-1 font-bold ml-4 hidden sm:block">
              StockFlow Commerce
            </div>
          </Link>

          {/* search filed */}

          <div className="relative flex  shadow-sm  lg:ml-[200px] sm:ml-[120px] justify-center items-center ">
            <button
              type="button"
              onClick={searchProductByStore}
              // onClick={()=>{searchProductByStore(); handlePageClick();}}
              // data-clear-search={handleClearSearch}
              className="absolute lg:w-16 w-7 lg:py-[27px] py-[15px] lg:px-2 sm:px-5 px-2 sm:py-5 right-0 inline-flex flex-shrink-0 justify-center items-center lg:rounded-r-2xl  rounded-r-xl  bg-[#F15B22] text-white hover:bg-orange-500 focus:z-10 focus:outline-none active:bg-orange-600 transition-all lg:text-lg  text-xs"
            >
              {/* Search */}
              <div className="absolute inset-y-0 lg:left-0 flex items-center pointer-events-none z-20 pl-4   lg:w-16 w-7 lg:ml-1  border-[#F15B22]  lg:rounded-r-2xl  rounded-r-xl ">
                <svg
                  className="lg:h-6  h-3 lg:ml-0 -ml-2.5 sm:h-4 sm:w-4 lg:w-6 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </div>
            </button>
            <input
              type="text"
              onChange={handleFormChange}
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  searchProductByStore();
                }
              }}
              value={onChangeSearch}
              id="hs-trailing-button-add-on-with-icon-and-button"
              name="hs-trailing-button-add-on-with-icon-and-button"
              className="lg:pe-[73px] pe-8 lg:w-[700px] sm:w-[350px] w-[184px]  mx-auto border-s-orange-100 lg:py-3 sm:py-2 py-1.5 lg:px-4  lg:pl-5 pl-3 block border-gray-200  lg:rounded-2xl rounded-xl lg:text-xl sm:text-base text-xs focus:z-5 focus:border-[#F15B22]  focus:ring-[#F15B22]"
              placeholder="Search..."
            />

            {/* <div className="absolute inset-y-0 lg:left-0 -left-1 flex items-center pointer-events-none z-20 pl-4">
              <svg
                className="lg:h-4 h-3 sm:h-4 sm:w-3 lg:w-4 w-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div> */}
          </div>

          {/* div 3 */}
          <div className="flex flex-row items-center lg:gap-1 sm:gap-4 gap-2 lg:mt-5 sm:justify-end sm:mt-0 sm:pl-5">
            {/* notification icon */}
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <div
                  onClick={handleClearSearch}
                  className="relative inline-flex flex-shrink-0 justify-center items-center lg:h-[40px]  h-[28px] lg:w-[40px] w-[28px]  font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F15B22] transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                >
                  <img
                    src={require("../../assets/images/retailer/bell.png")}
                    alt=""
                    className="rounded-lg lg:w-8 lg:h-8 w-6 sm:h-8 sm:w-8 h-6"
                  />
                  <span className="absolute lg:top-0.5 top-0 right-0 inline-flex items-center  lg:px-1.5 px-0.5 py-0 sm:px-1   rounded-full lg:text-sm sm:text-xs text-xs  font-light transform -translate-y-1/4 translate-x-1/4 sm:-translate-y-1/3 sm:translate-x-1/3 lg:-translate-y-1/4 lg:translate-x-1/4 bg-[#F15B22] text-white">
                    {countAllNotificationUnseen == 0
                      ? "0"
                      : countAllNotificationUnseen}
                  </span>
                </div>
              }
            >
              <Dropdown.Header>
                <div className="flex flex-row justify-between w-full">
                  <span className="block  text-xl text-gray-500 font-bold">
                    Notification
                  </span>
                  <button
                    className="block   text-[#F15B22] active:text-orange-600"
                    onClick={handleReadAllNotifications}
                  >
                    Mark all as read
                  </button>
                </div>
                <Dropdown.Divider />
                <ul className="flex flex-row text-md mt-3 mr-6 space-x-8 text-sm">
                  <li>
                    <StyledBadge
                      badgeContent={
                        countAllNotificationUnseen == 0
                          ? "0"
                          : countAllNotificationUnseen
                      }
                      color="secondary"
                    >
                      <div
                        onClick={toggleTab1}
                        className={`${
                          toggleState === 1
                            ? "text-newGray dark:text-white border-b-2 border-[#F15B22]"
                            : "outline-none cursor-pointer"
                        } `}
                      >
                        All Order
                      </div>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        countAllNotificationUnseenOrderAccepted == 0
                          ? "0"
                          : countAllNotificationUnseenOrderAccepted
                      }
                      color="secondary"
                    >
                      <a
                        href="#"
                        onClick={toggleTab2}
                        className={
                          toggleState === 2
                            ? "text-newGray dark:text-white border-b-2 border-[#F15B22]"
                            : "outline-none cursor-pointer"
                        }
                      >
                        Accepted
                      </a>
                    </StyledBadge>
                  </li>

                  <li>
                    <StyledBadge
                      badgeContent={
                        countAllNotificationUnseenOrderDelivering == 0
                          ? "0"
                          : countAllNotificationUnseenOrderDelivering
                      }
                      color="secondary"
                    >
                      <div
                        onClick={toggleTab3}
                        className={
                          toggleState === 3
                            ? "text-newGray dark:text-white border-b-2 border-[#F15B22]"
                            : "outline-none cursor-pointer"
                        }
                      >
                        Delivering
                      </div>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        countAllNotificationUnseenOrderConfirming == 0
                          ? "0"
                          : countAllNotificationUnseenOrderConfirming
                      }
                      color="secondary"
                    >
                      <div
                        onClick={toggleTab4}
                        className={`${
                          toggleState === 4
                            ? "text-newGray dark:text-white border-b-2 border-[#F15B22]"
                            : "outline-none cursor-pointer"
                        } `}
                      >
                        Confirming
                      </div>
                    </StyledBadge>
                  </li>
                  <li>
                    <StyledBadge
                      badgeContent={
                        countAllNotificationUnseenOrderRejected == 0
                          ? "0"
                          : countAllNotificationUnseenOrderRejected
                      }
                      color="secondary"
                    >
                      <div
                        onClick={toggleTab5}
                        className={`${
                          toggleState === 5
                            ? "text-newGray dark:text-white border-b-2 border-[#F15B22]"
                            : "outline-none cursor-pointer"
                        } `}
                      >
                        Reject
                      </div>
                    </StyledBadge>
                  </li>
                </ul>

                {/* notification detail */}
                <div className="flex  flex-col relative w-full h-96">
                  <div className="flex-grow-1">
                    <div
                      className={
                        toggleState === 1
                          ? " w-full h-full block"
                          : "bg-white w-full h-full hidden"
                      }
                    >
                      {/* notification one */}
                      <AllNotification />
                    </div>
                    <div
                      className={
                        toggleState === 2
                          ? "bg-white w-full h-full block"
                          : "bg-white w-full h-full hidden"
                      }
                    >
                      <OrderNotification />
                    </div>
                    <div
                      className={
                        toggleState === 3
                          ? "bg-white w-full h-full   block"
                          : "bg-white w-full h-full hidden"
                      }
                    >
                      <DeliveringNotification />
                    </div>
                    <div
                      className={
                        toggleState === 4
                          ? "bg-white w-full h-full   block"
                          : "bg-white w-full h-full hidden"
                      }
                    >
                      <ConfirmingNotification />
                    </div>
                    <div
                      className={
                        toggleState === 5
                          ? "bg-white w-full h-full   block"
                          : "bg-white w-full h-full hidden"
                      }
                    >
                      <RejectNotification />
                    </div>
                  </div>
                </div>
              </Dropdown.Header>
            </Dropdown>

            {/* shopping cart */}

            {productInCartData.length > 0 ? (
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={
                  <button
                    onClick={handleClearSearch}
                    // onClick={()=> productInCartData.length === 0?  :''}
                    className="flex flex-row items-center gap-1 lg:px-5"
                  >
                    <img
                      src={require("../../assets/images/retailer/bag.png")}
                      alt=""
                      className="rounded-lg lg:w-8 lg:h-8 w-6 sm:h-8 sm:w-8 h-6 "
                    />
                    <span className="absolute lg:-mt-3 sm:-mt-3 -mt-2 sm:ml-4 ml-3  inline-flex items-center  lg:py-0  lg:px-1.5 sm:px-1 px-[3px] rounded-full lg:text-sm sm:text-xs text-xs font-light transform -translate-y-1/3 translate-x-1/3 bg-[#F15B22] text-white">
                      {productInCartData.reduce(
                        (sum, item) => sum + item.qty,
                        0
                      )}
                    </span>
                    <p className="font-medium text-lg mt-1 hidden lg:block">
                      shopping
                    </p>
                  </button>
                }
              >
                {/* back button */}
                {/* <Dropdown.Header>
                  <button className="flex items-center px-4 hover:opacity-80 ">
                    <img
                      src={require("../../assets/images/retailer/Lefticon.png")}
                      alt=""
                    />
                    <p>Back</p>
                  </button>
       
                </Dropdown.Header> */}

                <button onClick={() => setSuccess2(!success2)}>
                  <img
                    className="w-16 absolute top-0 right-0 mr-2 mt-5 hover:opacity-80"
                    src={draft}
                  />
                </button>
                {/* for reder store name */}
                <div className="px-12">
                  <p className="">
                    Order from{"    "}
                    <button
                      onClick={() =>
                        onClickGetDataShop(localStoreId, localStoreName)
                      } 
                      className="text-retailerPrimary font-semibold hover:text-orange-600 "
                    >
                      {localStoreName}
                    </button>
                  </p>
                </div>

                <Dropdown.Divider />
                <div className="overflow-y-auto max-h-96">
                  {productInCartData?.map((item) => (
                    // console.log("item ",item),
                    <div className="flex flex-col px-10">
                      <hr />
                      {/* cards 1*/}

                      <div v className="flex flex-col p-4">
                        <div className="flex justify-around shadow-sm  h-16 items-center mt-2">
                          <div className="flex items-center w-1/4">
                            <img
                              className="w-14 h-14 rounded-sm"
                              src={
                                item.image == "" ||
                                item.image == "string" ||
                                item.image == null
                                  ? noImage
                                  : item.image
                              }
                              alt=""
                            />
                            <p className="ml-1">{item.productName}</p>
                          </div>
                          <div className="w-1/4 ml-14">
                            <p className="m-2">$ {item.unitPrice}</p>
                          </div>

                          <div className="flex items-center">
                            {/*button Decrement */}
                            <button
                              onClick={() => handleDecrement(item.productId)}
                              // disabled={disabledButtons.has(item.id) }
                              type="button"
                              className={`h-6 w-6 rounded-sm border border-orange-500 hover:border-orange-600 flex justify-center items-center ${
                                loadingProducts2.has(item.productId) &&
                                "bg-white hover:bg-white border border-white hover:border-white"
                              }`}
                            >
                              {/* loading indicator */}
                              <div role="status">
                                {loadingProducts2.has(item.productId) && (
                                  <div className="flex items-center ml-2">
                                    <svg
                                      aria-hidden="true"
                                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-500"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                    {/* <span className="sr-only">Loading...</span> */}
                                  </div>
                                )}
                              </div>
                              {!loadingProducts2.has(item.productId) && (
                                <svg
                                  className="w-4 h-4 fill-orange-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                </svg>
                              )}
                            </button>

                            {/* input field  */}
                            <input
                              type="text"
                              value={
                                counterLocalStorage[item.productId]
                                  ? counterLocalStorage[item.productId]
                                  : 0
                                // item.qty || 0
                              }
                              onChange={(e) =>
                                handleInputChange(item.productId, e)
                              }
                              className="w-10 text-center block p-2 text-gray-900 border border-[#F6F7F8] rounded-lg bg-[#F6F7F8] sm:text-xs ml-1"
                            />
                            {isLoadingInputs.has(item.productId) && (
                              <div
                                style={{
                                  position: "fixed",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  width: "100vw",
                                  height: "100vh",
                                  zIndex: 9999,
                                }}
                              >
                                <div
                                  className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-current border-r-transparent align-[0.125em] text-orange-500"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </div>
                            )}

                            {/* increment button */}
                            <button
                              onClick={() => handleIncrement(item.productId)}
                              disabled={disabledButtons.has(item.productId)}
                              type="button"
                              className={`h-6 w-6 rounded-sm border border-transparent bg-orange-500 hover:bg-orange-600 flex justify-center items-center ml-1 ${
                                loadingProducts.has(item.productId) &&
                                "bg-white hover:bg-white"
                              }`}
                            >
                              {/* loading indicator */}
                              <div role="status">
                                {loadingProducts.has(item.productId) && (
                                  <div className="flex items-center ml-2">
                                    <svg
                                      aria-hidden="true"
                                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-500"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                    {/* <span className="sr-only">Loading...</span> */}
                                  </div>
                                )}
                              </div>
                              {!loadingProducts.has(item.productId) && (
                                <svg
                                  className="w-4 h-4 fill-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                              )}
                            </button>
                          </div>

                          <div className="flex w-1/4 items-center justify-between">
                            <p className="ml-4 w-full font-semibold">
                              $ {item.subTotal}{" "}
                            </p>

                            <button
                              onClick={() =>
                                onClickDeleteProductInCart(item.productId)
                              }
                            >
                              {/* delete product in cart */}
                              <img
                                className="ml-5"
                                src={require("../../assets/images/retailer/trashcan-cart.png")}
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || ""}
                </div>

                {/* Calculate the total sum */}

                {/* Button */}
                <div className="flex justify-center -mb-5 border mt-4">
                  <div>
                    <button
                      onClick={() => setSuccess(!success)}
                      className="w-20 h-10 bg-retailerPrimary flex justify-center items-center rounded-md text-white mr-2"
                    >
                      Check Out
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => setDraft(!draf)}
                      className="w-20 h-10 bg-[#FD3939] flex justify-center items-center rounded-md text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {productInCartData.length > 0 && (
                  <div className="flex-col mt-8 border border-solid border-[#EBF0FF] rounded-md p-4">
                    {/* Render each item */}
                    {productInCartData.map((item) => (
                      <div key={item.productId}></div>
                    ))}

                    {/* Calculate the total sum */}
                    <div className="flex justify-between pl-8 pr-8">
                      <p className=" font-bold font-Poppins text-lg ">
                        Total Price :
                      </p>
                      <p className="text-retailerPrimary font-bold font-Poppins text-lg">
                        $
                        {productInCartData.reduce(
                          (sum, item) => sum + item.subTotal,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </Dropdown>
            ) : (
              <Dropdown
                className="p-5"
                arrowIcon={false}
                inline={true}
                label={
                  <button
                    onClick={handleClearSearch}
                    // onClick={()=> productInCartData.length === 0?  :''}
                    className="flex flex-row items-center gap-1 lg:px-5 "
                  >
                    <img
                      src={require("../../assets/images/retailer/bag.png")}
                      alt=""
                      className="rounded-lg lg:w-8 lg:h-8 w-5 sm:h-8 sm:w-8 h-5 "
                    />
                    <p className="font-medium text-lg mt-1 hidden lg:block">
                      shopping
                    </p>
                  </button>
                }
              >
                <img className="w-40 h-full ml-14" src={trolley} /> <br />
                {/* for reder store name */}
                <div className="px-12">
                  <p className="">
                    Your cart is currently empty.
                    <span className="text-retailerPrimary font-semibold"></span>
                  </p>
                </div>
              </Dropdown>
            )}

            {/* profileDropdown */}
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <img
                  src={profile.profileImage}
                  className="lg:w-11 lg:h-11 w-7 h-7 sm:w-9 sm:h-9 rounded-full "
                />
              }
            >
              <Dropdown.Item>
                <NavLink
                  to="/retailer/profile"
                  onClick={handleClearSearch}
                  className="flex flex-row items-center"
                >
                  <img
                    src={require("../../assets/images/retailer/editm.png")}
                    alt=""
                    className=" "
                  />
                  <div className="px-2">View Profile</div>
                </NavLink>
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item>
                <div
                  className="flex flex-row items-center justify-start cursor-pointer"
                  onClick={onSignOut}
                >
                  <img
                    src={require("../../assets/images/retailer/logoutm.png")}
                    alt=""
                    className=" "
                  />
                  <div className="px-2">Log out</div>
                </div>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </nav>
      </header>
      {/* mininavbar */}
      <header className="flex flex-wrap font-Poppins sm:justify-start sm:flex-nowrap z-50 w-full text-sm py-2 border-solid border-b border-t mx-auto">
        <nav
          className="max-w-[105rem] w-full px-4 mx-auto sm:flex sm:items-center sm:justify-evenly"
          aria-label="Global"
        >
          <div className="flex flex-row items-center justify-between">
            {/* <div className="flex flex-row items-center"> */}
            {/* <div className="mr-2">
                <svg
                  className="lg:w-5 sm:w-4 w-3 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </div> */}

            {/* categories dropdown */}
            {/* <div onClick={handleClearSearch}>ddadad
                <Dropdown
                  label={
                    <span className="font-bold text-[16px]  text-gray-500">
                      Categoriesasdads
                    </span>
                  }
                  inline
                  className="bg-white font-bold"
                >
                  <Dropdown.Item className="hover:text-[#F15B22] font-medium text-[16px]">
                    <NavLink to="/retailer/beverage">Beverages</NavLink>
                  </Dropdown.Item>
                  {/* <Dropdown.Divider /> */}
            {/* </Dropdown>
              </div> */}
            {/* </div> */}

            {/* <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle  focus:ring-orange-500 p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                data-hs-collapse="#navbar-alignment"
                aria-controls="navbar-alignment"
                aria-label="Toggle navigation"
              >
                <svg
                  className="hs-collapse-open:hidden w-4 h-4"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden w-4 h-4"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div> */}
          </div>

          <div
            // id="navbar-alignment"
            className="hs-collapse font-medium text-[16px] border-collapse overflow-hidden  mx-auto transition-all duration-300 basis-full grow "
          >
            <div className="flex lg:gap-10 gap-2 justify-center flex-row sm:items-center sm:mt-0 ">
              <NavLink
                to="/retailer/home"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px]  dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
                // className={``}
                // href="#"
              >
                Home
              </NavLink>
              <NavLink
                to="/retailer/order"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px]  dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
              >
                Order
              </NavLink>
              <NavLink
                to="/retailer/favorite"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px] dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
              >
                Favorite
              </NavLink>
              <NavLink
                to="/retailer/report"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px] dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
              >
                Report
              </NavLink>

              <NavLink
                to="/retailer/draft"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px] dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
              >
                Draft
              </NavLink>

              <NavLink
                to="/retailer/order-history"
                onClick={handleClearSearch}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold lg:text-[16px] sm:text-[15px] text-[11px] dark:text-gray-400 dark:hover:text-gray-500 p-1 text-[#f15b22] underline decoration-[#F15B22] underline-offset-4"
                    : "font-bold lg:text-[16px] sm:text-[15px] text-[11px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-1"
                }
              >
                Order History
              </NavLink>

              {/* history dropdown */}
              {/* <Dropdown
                  label={
                    <p className=" font-bold lg:text-[16px] sm:text-[14px] text-[12px] text-gray-500 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 p-2 ">
                      History
                    </p>
                  }
                  inline
                  className=" font-bold bg-red-400"
                >
                  <Dropdown.Item  className="hover:text-[#F15B22]">
                    <NavLink to="/retailer/draft" onClick={handleClearSearch}>Draft</NavLink>
                  </Dropdown.Item>
                  <Dropdown.Divider className="" />
                  <Dropdown.Item className="hover:text-[#F15B22]">
                    <NavLink to="/retailer/draft">Draft</NavLink>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="hover:text-[#F15B22]">
                    <NavLink to="/retailer/order-history">
                      Order History
                    </NavLink>
                  </Dropdown.Item>
                </Dropdown> */}
            </div>
          </div>
        </nav>
      </header>
      <React.Fragment>
        <Modal
          show={draf}
          size="md"
          popup={true}
          onClose={() => setDraft(!draf)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Cancel Order?</h3>
              <p className="text-xs text-newGray mt-1">
                Please click "Yes" to confirm your cancel
              </p>
              <p className="text-xs text-newGray mt-1">
                {" "}
                or click "No" if you want to go back.
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => handleClickCancel("yes")}
                  className="bg-newGreen w-28 py-0.5 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleClickCancel("no")}
                  className="bg-newRed w-28 py-0.5 rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      {/* Draftment */}

      <React.Fragment>
        <Modal
          show={success}
          size="md"
          popup={true}
          onClose={() => setSuccess(!success)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-20 w-20 -mt-5 fill-newGreen"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <h3 className="text-lg font-semibold">Confirmation</h3>
              <p className="text-xs text-newGray mt-1">
                Please click "Yes" to confirm your order
              </p>
              <p className="text-xs text-newGray mt-1">
                {" "}
                or click "No" to cancel.
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => handleClickCheckOut("yes")}
                  className="bg-newGreen w-36 py-0.5 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleClickCheckOut("no")}
                  className="bg-retailerPrimary w-36 py-0.5 rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      {/* draft button */}

      <React.Fragment>
        <Modal
          show={success2}
          size="md"
          popup={true}
          onClose={() => setSuccess2(!success2)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-20 w-20 -mt-5 fill-newGreen"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <h3 className="text-lg font-semibold">Confirmation</h3>
              <p className="text-xs text-newGray mt-1">
                Please click "Yes" to save this cart.
              </p>
              <p className="text-xs text-newGray mt-1">
                {" "}
                or click "No" to cancel.
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => draftStore("yes")}
                  className="bg-newGreen w-36 py-0.5 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => draftStore("no")}
                  className="bg-retailerPrimary w-36 py-0.5 rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      {/* Draft*/}
      <React.Fragment>
        <Modal
          show={confOrder}
          size="md"
          popup={true}
          onClose={() => setConfOrder(!confOrder)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Please Checkout previous order
              </h3>
              <p className="text-xs text-newGray mt-1">
                Please make sure you have already checkout
              </p>
              <p className="text-xs text-newGray mt-1">
                the previous order before Start new order{" "}
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => setConfOrder(!confOrder)}
                  className="bg-newGreen w-28 py-0.5 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfOrder(!confOrder)}
                  className="bg-newRed w-28 py-0.5 rounded-lg"
                >
                  No
                </button>
              </div>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => setConfOrder(!confOrder)}
                  className="bg-retailerPrimary w-32 py-0.5 rounded-lg"
                >
                  Draft
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      {/* Draft */}
      <React.Fragment>
        <Modal
          show={success2}
          size="md"
          popup={true}
          onClose={() => setSuccess2(!success2)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-20 w-20 -mt-5 fill-newGreen"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              <h3 className="text-lg font-semibold">Confirmation</h3>
              <p className="text-xs text-newGray mt-1">
                Please click "Yes" to save this cart.
              </p>
              <p className="text-xs text-newGray mt-1">
                {" "}
                or click "No" to cancel.
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button
                  onClick={() => draftStore("yes")}
                  className="bg-newGreen w-36 py-0.5 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => draftStore("no")}
                  className="bg-retailerPrimary w-36 py-0.5 rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </div>
  );
}


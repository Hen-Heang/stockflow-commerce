import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import RetailProduct from "./RetailProduct";
import Product from "../Distributor/OrderPage/Product";
import ReactPaginate from "react-paginate";
import { rating_star } from "../../redux/services/retailer/rating.service";
import {
  confirm_order,
  confirm_transaction,
  delete_request,
  get_orderById,
  get_order_detail,
  update_dispatch,
} from "../../redux/services/retailer/orderDetail.service";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmTransaction,
  deleteRequest,
  getOrderDetail,
  setChangeOrderStatus,
  setChangeOrderStatusDeclind,
  setLoadingOrder,
  updateDispatch,
} from "../../redux/slices/retailer/orderSlice";
import {
  getOrderById,
  getOrderProduct,
} from "../../redux/slices/retailer/orderDetailSlice";
import ProductDetail from "./ProductDetail";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { FaStar } from "react-icons/fa";
import { ratingStar } from "../../redux/slices/retailer/RatingSlice";
import { PropagateLoader } from "react-spinners";
import axios from "axios";

import { useScrollTrigger } from "@mui/material";
import CompleteOrder from "./CompleteOrder";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { styled } from "@mui/material";
export default function OrderPage() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Order";
    connect();
  }, []);
  const [confirm, setConfirm] = useState(false);
  const [complete, setComplete] = useState(false);
  const [reject, setReject] = useState(false);
  const [confirmData, setConfrimData] = useState({});
  const orderList = useSelector((state) => state.order.data);
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [itemOffset, setItemOffset] = useState(0);
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  const [errorPro, setErrorPro] = useState(false);
  const [noPro, setNoPro] = useState(false);
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);
  const [rated, setRated] = useState(false);
  const [loadingPro, setLoadingPro] = useState(false);
  const [ratingDone, setRatingDone] = useState(false);

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
    console.log(payload);
    switch (payloadData.status) {
      case "ORDER":
        dispatch(setChangeOrderStatus(payloadData.message));
        console.log("connected");
        // window.location.reload();
        break;
        case  "DECLINE": {
          dispatch(setChangeOrderStatusDeclind(payloadData.message));
        }
        break;
    }
  };
  const onError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    get_order_detail(dispatch)
      .then((r) => {
        if (r.status == 401) {
          toast.error("Something went wrong...!");
        }
        if (r && r.data && r.data.status === 200) {
          setNoData(false);
          dispatch(getOrderDetail(r.data.data));
          setItem(r.data.data);
          setTotalPage(r.data.totalPage);
        } else {
          if (r && r.response && r.response.data && r.response.data.detail) {
            setError(r.respone.data.detail);
          }
        }
      })
      .catch((e) => {
        dispatch(setLoadingOrder(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingOrder(false));
      });
  }, getOrderDetail());
  const loading = useSelector((state) => state.order.loading);
  const endOffset = itemOffset + 6;
  const currentOrderList = orderList.slice(itemOffset, endOffset);
  const handleProductById = (id) => {
    setLoadingPro(true);
    get_orderById(id).then((r) => dispatch(getOrderById(r.data.data.products)));
    get_orderById(id)
      .then((r) => dispatch(getOrderProduct(r.data.data.order)))
      .then(() => setLoadingPro(false));
  };
  const orderDetail = useSelector((state) => state.orderDetail.data);
  const orderProduct = useSelector((state) => state.orderDetail.dataOrder);
  // console.log("orderDetail", orderDetail);
  function openConfrim(item) {
    // console.log(item);
    // console.log(item);
    setConfrimData(item);
  }
  // const [loadingConfirm,setLoadingConfirm]=useState(false);
  // ============================= handle confirm =============================
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [status, setStatus] = useState("Complete");
  const handleConfrim = (id) => {
    const message = "My order has been delivered";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    setDispatchLoading(true);
    confirm_transaction(confirmData?.id)
      .then(async (res) => {
        if (res.status == 409) {
          setDispatchLoading(false);
          toast.error(res.data.detail);
        }
        console.log("Response from server : ", res);
        const notification = {
          app_id: appId,
          contents: { en: message },
          include_external_user_ids: [res.data.data.userId.toString()],
        };
        // console.log("Await notification");
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

          // console.log("Push notification sent successfully:", response.data);
          
        } catch (error) {
          console.error(
            "Error sending push notification:",
            error.response.data
          );
        }
      })
      .then((res) => {
        setDispatchLoading(false);
        dispatch(confirmTransaction(confirmData.id));
      });
    // dispatch(confirmTransaction(confirmData.id))
    // handleStatus(confirmData?.id)
  };
  const handleStatus = (id) => {
    setStatus("Confirmed");
  };
  const pageCount = Math.ceil(orderList.length / 6);
  const onPageChange = (event) => {
    const newOffset = (event.selected * 6) % orderList.length;
    setItemOffset(newOffset);
  };
  const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9",
  };
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);
  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };
  const [rating, setRating] = useState(false);
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };
  const handleClick = (value) => {
    console.log(value);
    setCurrentValue(value);
    console.log("storeID1", storeId);
  };
  const handleValueConfirm=()=>{
    rating_star(storeId, currentValue)
      .then((r) =>{
        // setCurrentValue(0);
        console.log("rrrrrrrr",r.data.status)
        if(r.data.status===409){
          setRatingDone(!ratingDone);
        }
        setCurrentValue(0)
      })
  }
  // ==================== handle Rating =================
  const handleRating = (storeId) => {
    console.log("storeID2", storeId);
    setStoreId(storeId);
  };

  // ============== handle request =================
  const [request1, setRequest1] = useState(false);
  const [dataRequest, setDataRequest] = useState();
  function getRequest(item) {
    setDataRequest(item);
    console.log(item);
  }

  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDeleteRequest = () => {
    setLoadingDelete(true);
    delete_request(dataRequest?.id)
      .then((r) => dispatch(deleteRequest(dataRequest?.id)))
      .then(() => setLoadingDelete(false));
    setRequest1(!request1);
  };
  const StyledLoader = styled(LoadingOverlay)`
    position: fixed;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `;
  return (
    <div className="dark:text-white text-[16px]">
      {loadingDelete ? (
        <StyledLoader
          active={loadingDelete}
          spinner={true}
          text="reseting..."
        ></StyledLoader>
      ) : null}
      <div className="lg:w-[80%] m-auto bg-white lg:p-8 p-4 w-full">
        <div className=" flex flex-wrap flex-col gap-3 justify-center">
          <h1 className="text-retailerPrimary font-bold lg:text-3xl text-2xl">
            Order activity
          </h1>
          <p className="text-newGray text-[18px] lg:mt-1">
            Check your order status here !
          </p>
          <div class="sm:rounded-lg lg:h-[580px] h-[520px] w-[100%]">
            <div className="lg:h-[560px] h-[520px] relative overflow-x-auto w-[100%] ">
              <table class="w-full  text-left border-tools-table-outline  border-separate border-spacing-y-2">
                <thead class=" text-newGray bg-newWhite uppercase border-spacint">
                  <tr className="lg:text-[16px] text-[14px]">
                    <th scope="col" class="px-6 py-3">
                      No
                    </th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                      Shop name
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Address
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Product
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-newGray">
                  {loading ? (
                    <div className="w-full mx-auto absolute mt-24 text-center ">
                      <PropagateLoader color="#F15B22" />
                    </div>
                  ) : currentOrderList.length === 0 ? (
                    noData ? (
                      <div className="w-full mx-auto absolute ">
                        <p className="text-center text-2xl font-semibold mt-2">
                          {error}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full mx-auto absolute ">
                        <p className="text-center text-2xl font-semibold mt-24">
                          No data available
                        </p>
                      </div>
                    )
                  ) : (
                    currentOrderList.map((item, index) => (
                      <tr
                        key={index}
                        class=" mt-1 border shadow-sm border-newGray lg:text-[16px] text-[14px]"
                      >
                        <td class="px-6 lg:py-4 py-2">
                          <p>{index + 1 + itemOffset}</p>
                        </td>
                        <td class="flex items-center px-6 lg:py-4 py-2 whitespace-nowrap">
                          {item.storeImage ? (
                            <img
                              class="w-10 h-10 rounded-full"
                              src={item.storeImage}
                              alt="image"
                            />
                          ) : (
                            <img
                              class="w-10 h-10 rounded-full"
                              src={require("../../assets/images/shop.jpg")}
                              alt="Jese image"
                            />
                          )}

                          <div class="pl-3">
                            <div class="font-normal text-gray-500 text-[16px]">
                              {item.storeName}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 lg:py-4 py-2 whitespace-nowrap">
                          {item.storeAddress}
                        </td>
                        <td class="px-6 lg:py-4 py-2 whitespace-nowrap ">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td class="px-6 lg:py-4 py-2">
                          <p>
                            $
                            {item.total === null ? (
                              <span>0.00</span>
                            ) : (
                              item.total.toFixed(2)
                            )}
                          </p>
                        </td>
                        <td class="px-6 lg:py-4 py-2 text-center">
                          <button
                            onClick={() => {
                              setOpen(!isOpen);
                              handleProductById(item.id);
                            }}
                          >
                            <svg
                              class="w-6 h-6 text-center"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                          </button>
                        </td>
                        <td class="px-6 lg:py-4 py-2 text-center">
                          <div>
                            {item.status == "Pending" ||
                            item.status == "Draft" ? (
                              <button
                                onClick={() => {
                                  setRequest1(!request1);
                                  getRequest(item);
                                }}
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-requesting cursor-pointer `}
                              >
                                Requesting
                              </button>
                            ) : item.status == "Preparing" ? (
                              <button
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-preparing cursor-default `}
                              >
                                Preparing
                              </button>
                            ) : item.status == "Declined" ? (
                              <button
                                onClick={() => setReject(!reject)}
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-rejected cursor-pointer`}
                              >
                                Rejected
                              </button>
                            ) : item.status == "Complete" ? (
                              <button
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-complete cursor-default`}
                              >
                                Confirmed
                              </button>
                            ) : item.status == "Confirming" ? (
                              <button
                                onClick={() => {
                                  openConfrim(item);
                                  setComplete(!complete);
                                  handleProductById(item.id);
                                  handleRating(item.storeId);
                                }}
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-confirm cursor-pointer`}
                              >
                                Complete
                              </button>
                            ) : (
                              <button
                                className={`text-md text-white rounded-md w-28 py-[6px] bg-delivering cursor-default`}
                              >
                                Delivering
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            {error || noData || loading || pageCount < 2 ? null : (
              <div class="flex  items-center justify-end">
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                  previousLabel="< Prev"
                  className="flex"
                  breakLabel="..."
                  nextLabel="Next >"
                  pageRangeDisplayed={5}
                  containerClassName="pagination"
                  activeClassName="text-retailerPrimary active"
                  pageClassName="px-2 page-item"
                  nextLinkClassName="page-item"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* confirm */}
      <React.Fragment>
        <Modal
          show={confirm}
          size="md"
          popup={true}
          onClose={() => setConfirm(!confirm)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Confirm product</h3>
              <p className="text-xs text-newGray mt-1">
                Only Confirm if your product has been Delivered.
              </p>
              <div className="flex justify-center gap-4 text-white mt-5">
                <button className="bg-newRed w-28 py-0.5 rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleConfrim();
                    setConfirm(!confirm);
                  }}
                  className="bg-newGreen w-28 py-0.5 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
      {/* Completed */}
      {/* <CompleteOrder setComplete={() => setComplete(!complete)} complete={complete} loadingPro={loadingPro}/> */}
      <React.Fragment>
        <Modal
          show={complete}
          size="xl"
          popup={true}
          onClose={() => setComplete(!complete)}
        >
          <Modal />
          <Modal.Header className="text-center bg-retailerPrimary w-full">
            <h1 className="text-center text-white font-semiblod ml-56 text-xl">
              Products
            </h1>
            <p
              className="text-white float-right absolute right-2 top-0 bg-retailerPrimary w-18 p-4 h-12"
              onClick={() => setComplete(!complete)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 font-bold text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </p>
          </Modal.Header>
          <Modal.Body>
            <div>
              {!loadingPro ? (
                <div className="w-full rounded-lg border border-gray-400 mt-3">
                  <div className="flex flex-wrap p-4">
                    <div className="w-3/5">
                      <h1 className="text-black font-semibold">
                        Order ID: #{orderProduct.id}
                      </h1>
                      <p className="text-sm">
                        Order date :
                        {new Date(orderProduct.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="w-2/5 justify-end">
                      <p
                        onClick={() => {
                          setOpen(!isOpen);
                          handleProductById(orderProduct.id);
                        }}
                        className="text-retailerPrimary font-semibold text-end"
                      >
                        Order Detail
                      </p>
                    </div>
                  </div>
                  <hr className="bg-gray-500" />
                  <div className="h-[96px] overflow-hidden">
                    {orderDetail.map((item) => (
                      <div className="flex flex-wrap p-4 overflow-hidden">
                        <div className="w-4/5 flex">
                          <img
                            class="w-14 h-14 "
                            src={item.image}
                            alt="product image"
                          />
                          <div class="pl-3">
                            <div class="text-base font-semibold text-black mt-4">
                              {item.productName}
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 justify-end text-end">
                          <h1 className="text-black font-semibold">
                            ${" "}
                            {item.subTotal == null ? (
                              <span>0.00</span>
                            ) : (
                              item.subTotal.toFixed(2)
                            )}
                          </h1>
                          <p className="text-newGray text-sm">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  role="status"
                  class="max-w-md p-4 w-full space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 ml-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                      <div class="w-64 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-24"></div>
                  </div>
                  <div class="flex items-center justify-between pt-4">
                    <div>
                      <div class="flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700">
                        <svg
                          class="w-24 h-24 text-gray-200 dark:text-gray-600"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 640 512"
                        >
                          <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"></div>
                      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-24 mt-2"></div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between pt-4">
                    <div class="w-64 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    <div class="flex items-center justify-center mt-4">
                      <svg
                        class="w-10 h-10 mr-2 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
                      <svg
                        class="w-10 h-10 mr-2 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
                      <svg
                        class="w-10 h-10 mr-2 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center justify-between pt-4">
                    <div class="flex items-center mt-4 space-x-3">
                      <svg
                        class="text-gray-200 w-14 h-14 dark:text-gray-700"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <div>
                        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-24 mt-2"></div>
                      </div>
                      <div class="h-8 bg-gray-300 rounded-lg dark:bg-gray-700 w-24"></div>
                    </div>
                  </div>
                  <span class="sr-only">Loading...</span>
                </div>
              )}
              {!loadingPro ? (
                <div>
                  <div className="w-full rounded-lg border border-gray-400 mt-3">
                    <div className="flex flex-wrap p-4">
                      <h1 className="text-xl text-black font-semibold">
                        Track your order
                      </h1>
                    </div>
                    <div className="w-96 flex justify-center mx-auto relative -mt-6">
                      <hr className="border-dashed rounded-full w-64 border-2 absolute border-retailerPrimary top-9" />
                      <div className="flex flex-col p-4 w-32 items-center">
                        <div className="w-12 h-12 border-4 border-orange-200  rounded-full bg-retailerPrimary mr-5">
                          <svg
                            className="fill-white absolute w-6 ml-2 mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z" />
                          </svg>
                        </div>
                        <p className="text-xs mt-3">Preparing</p>
                      </div>
                      <div className="flex flex-col p-4 w-32 items-center">
                        <div className="w-12 h-12 border-4 border-orange-200 rounded-full bg-retailerPrimary mr-5">
                          <svg
                            className="fill-white w-7 mt-2 ml-1.5 absolute"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                          >
                            <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                          </svg>
                        </div>
                        <p className="text-xs mt-3">Shipping</p>
                      </div>
                      <div className="flex flex-col p-4 w-32 items-center">
                        <div className="w-12 h-12 border-4 border-orange-200  text-center rounded-full bg-retailerPrimary mr-5">
                          <svg
                            className="fill-white w-6 mt-2 ml-2 absolute bg-retailerPrimary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                          </svg>
                        </div>
                        <p className="text-xs mt-3">Delivered</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full rounded-lg border border-gray-400 mt-3">
                    <div className="flex flex-wrap w-full">
                      <div className="w-2/12  p-4">
                        <img
                          className="w-16"
                          src={require("../../assets/images/rating 1.png")}
                          alt=""
                        />
                      </div>
                      <div className="w-7/12 p-4">
                        <div className="">
                          <h1 className="text-black font-semibold">
                            Don’t forget to rate{" "}
                          </h1>
                          <p className="text-xs">
                            Keep rating us for providing good service
                          </p>
                        </div>
                        <div className="flex flex-wrap mt-1">
                          <div style={styles.stars}>
                            {stars.map((_, index) => {
                              return (
                                <FaStar
                                  key={index}
                                  size={24}
                                  onClick={() => handleClick(index + 1)}
                                  onMouseOver={() => handleMouseOver(index + 1)}
                                  onMouseLeave={handleMouseLeave}
                                  color={
                                    (hoverValue || currentValue) > index
                                      ? colors.orange
                                      : colors.grey
                                  }
                                  style={{
                                    marginRight: 10,
                                    cursor: "pointer",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="w-3/12 p-4 mt-2.5">
                        <button
                          onClick={() => {
                            setConfirm(!confirm);
                            setComplete(!complete);
                            handleValueConfirm();
                          }}
                          className="bg-retailerPrimary text-white w-full rounded-lg py-2"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
      {/* reject */}
      <React.Fragment>
        <Modal
          show={reject}
          size="md"
          popup={true}
          onClose={() => setReject(!reject)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-20 w-20 -mt-5 fill-red-600 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <h3 className="text-xl font-semibold">Rejected</h3>
              <p className=" mt-3 font-normal text-sm text-gray-500 dark:text-gray-400">
                This order has been rejected by the distributor
              </p>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
      <ProductDetail
        handleOpen={() => setOpen(!isOpen)}
        isOpen={isOpen}
        loadingPro={loadingPro}
      />
      <React.Fragment>
        <Modal
          show={rating}
          size="md"
          popup={true}
          onClose={() => setRating(!rating)}
        >
          <Modal.Header />
          <Modal.Body>
            <h2> React Ratings </h2>
            <div style={styles.stars}>
              {stars.map((_, index) => {
                return (
                  <FaStar
                    key={index}
                    size={24}
                    onClick={() => handleClick(index + 1)}
                    onMouseOver={() => handleMouseOver(index + 1)}
                    onMouseLeave={handleMouseLeave}
                    color={
                      (hoverValue || currentValue) > index
                        ? colors.orange
                        : colors.grey
                    }
                    style={{
                      marginRight: 10,
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </div>
            <button style={styles.button}>Submit</button>
            {/* </div> */}
          </Modal.Body>
        </Modal>
      </React.Fragment>
      {/* rating already */}
      <React.Fragment>
        <Modal
          show={ratingDone}
          size="md"
          popup={true}
          onClose={() => setRatingDone(!ratingDone)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <svg
                className="mx-auto  h-20 w-20 -mt-5 fill-[#ff1919]"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
              </svg>
              <h3 className="text-lg font-semibold">
                Can't rate{" "}
                <p className="text-sm text-gray-400">
                  This store has been already rated
                </p>
              </h3>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
      {/* requesting */}
      <React.Fragment>
        <Modal
          show={request1}
          size="md"
          popup={true}
          onClose={() => setRequest1(!request1)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-16  -mt-5 text-red-500 mx-auto"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p className=" mt-3 text-lg text-black">
                  Do you want to delete requesting order from{" "}
                  <span className="text-retailerPrimary">
                    " {dataRequest?.storeName} "
                  </span>{" "}
                  or not ? <br />
                </p>
                <p className="text-md mt-3 text-gray-700">
                  If you click <span className="text-red-700">Yes</span> this
                  order will set to draft.
                </p>
                <div className=" flex justify-center pt-6">
                  <button
                    onClick={handleDeleteRequest}
                    className="bg-[#0018f9] mr-2 py-1 text-sm whitespace-nowrap flex pr-4 rounded-md text-white"
                  >
                    <svg
                      className="fill-white w-8 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                    Yes
                  </button>
                  <button
                    onClick={() => setRequest1(!request1)}
                    className="bg-newRed py-1 text-sm flex pr-4 rounded text-white"
                  >
                    <svg
                      className="fill-white w-8 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                    No
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  textarea: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    padding: 10,
    margin: "20px 0",
    minHeight: 100,
    width: 300,
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    // width: 300,
    // padding: 10,
  },
};


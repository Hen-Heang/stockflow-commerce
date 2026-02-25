import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
// import { getAlldispatch, getDelivered, removeDisItem } from "../../../redux/slices/distributor/DispatchSlice";
import Product from "./Product";
import {
  get_all_dispatch,
  get_delivered,
} from "../../../redux/services/distributor/Dispatch.service";
import { getProductDetail } from "../../../redux/slices/distributor/productSlice";
import { get_detail_product } from "../../../redux/services/distributor/product.service";
import ReactPaginate from "react-paginate";
import { setLoadingOrder } from "../../../redux/slices/retailer/orderSlice";
import { PropagateLoader } from "react-spinners";
import {
  getAlldispatch,
  getDelivered,
} from "../../../redux/slices/distributor/DispatchSlice";
import {
  getAlldispatch1,
  getDelivered1,
} from "../../../redux/slices/distributor/PreparingSlice";
import {
  addDataToConfirm,
  deliverdOrder,
  getDispatch,
  setLoadingTheOrder,
} from "../../../redux/slices/distributor/orderPageSlice";
import { data } from "autoprefixer";
import LoadingOverlay from "react-loading-overlay";
import { styled } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { over } from "stompjs";
import SockJS from "sockjs-client";
export default function Dispatch2(props) {
  const dispatchList = useSelector((state) => state.distributorOrder.disData);
  const dispatch = useDispatch();
  const [itemOffset, setItemOffset] = useState(0);
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);

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
        console.log("connected");
        // window.location.reload();
        break;
    }
  };
  const onError = (err) => {
    console.log(err);
  };
  useEffect(() => {
    connect();
  }, []);

  // ======================= get data dispatch =================
  useEffect(() => {
    get_all_dispatch(dispatch)
      .then((r) => {
        if (r && r.data && r.data.status == 200) {
          setNoData(false);
          dispatch(getDispatch(r.data.data));
          setItem(r.data.data);
        } else {
          if (r && r.response && r.response.data && r.response.data.detail) {
            setError(r.respone.data.detail);
          }
          dispatch(setLoadingTheOrder(false));
        }
      })
      .catch((e) => {
        dispatch(setLoadingTheOrder(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingTheOrder(false));
      });
  }, getDispatch());
  const loading = useSelector((state) => state.distributorOrder.loading);
  const endOffset = itemOffset + 6;
  const currentdispatchList = dispatchList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(dispatchList.length / 6);
  const [dispatchLoading, setDispatchLoading] = useState(false);

  const delivered = (id, data) => {
    // console.log(id);
    const message =
      "Your order has been delivered, please check your order details.";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    setDispatchLoading(true);
    get_delivered(id)
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

          console.log("Push notification sent successfully:", response.data);
        } catch (error) {
          console.error(
            "Error sending push notification:",
            error.response.data
          );
        }
      })
      .then(() => {
        dispatch(deliverdOrder(id));
        dispatch(addDataToConfirm(data));
        setDispatchLoading(false);
      });
    // get_delivered(id).then((r)=>dispatch(pushData(r.data.data)));
  };
  const productList = useSelector((state) => state.product.product);
  const [loadingPro, setLoadingPro] = useState(false);
  const detailProduct = (id) => {
    console.log(id);
    setLoadingPro(true);
    get_detail_product(id)
      .then((r) => {
        dispatch(getProductDetail(r.data.data.products));
      })
      .then(() => setLoadingPro(false));
  };
  const [decline, setDecline] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const handlePro = () => {
    setOpen(!isOpen);
  };
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);
  const onPageChange = (event) => {
    const newOffset = (event.selected * 6) % dispatchList.length;
    setItemOffset(newOffset);
  };
  const StyledLoader = styled(LoadingOverlay)`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `;

  return (
    <div>
      {dispatchLoading ? (
        <StyledLoader
          active={dispatchLoading}
          spinner={true}
          text="Loading..."
        ></StyledLoader>
      ) : null}
      <div class="sm:rounded-lg mt-1 h-[600px]">
        <div className="h-[500px]">
          <table class="w-full text-sm text-left border-tools-table-outline  border-separate border-spacing-y-2 ">
            <thead class="text-xs text-newGray bg-newWhite uppercase border-spacint text-center">
              <tr className="text-[16px]">
                <th scope="col" class="p-4">
                  <div class="flex items-center">
                    <label for="number">No</label>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Address
                </th>
                <th scope="col" class="px-6 py-3">
                  Date
                </th>
                <th scope="col" class="px-6 py-3">
                  Total
                </th>
                <th scope="col" class="px-6 py-3">
                  Product
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-newGray text-center ">
              {loading ? (
                <div className="w-full mx-auto absolute mt-24 ">
                  <PropagateLoader color="#0F766E" />
                </div>
              ) : currentdispatchList.length === 0 ? (
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
                currentdispatchList.map((item, index) => (
                  <tr
                    key={item.id}
                    class="rounded-full mt-1 border text-[16px] shadow-sm border-newGray"
                  >
                    <td class="w-4 p-4 items-center">
                      <p>{index + 1 + itemOffset}</p>
                    </td>
                    <td
                      scope="row"
                      class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.retailerImage ? (
                        <img
                          class="w-10 h-10 rounded-full"
                          src={item.retailerImage}
                          alt="retailer image"
                        />
                      ) : (
                        <img
                          class="w-10 h-10 rounded-full"
                          src={require("../../../assets/images/distributor/photo.png")}
                          alt="retailer image"
                        />
                      )}
                      <div class="pl-3">
                        <div class="font-normal text-gray-500">{item.name}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <p>{item.address}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <p>
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td class="px-6 py-4">
                      $
                      {item.total == null ? (
                        <span>0.00</span>
                      ) : (
                        item.total.toFixed(2)
                      )}
                    </td>
                    <td class="px-6 py-4">
                      <button
                        onClick={() => {
                          setOpen(!isOpen);
                          detailProduct(item.id);
                        }}
                      >
                        <svg
                          class="w-6 h-6"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                      </button>
                    </td>
                    <td class="px-6 py-4">
                      <div>
                        <button
                          onClick={() => {
                            delivered(item.id, item);
                          }}
                          className="bg-primary text-md text-white rounded-md w-24 py-[6px]"
                        >
                          {" "}
                          Delivered
                        </button>
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
          <div class="flex  items-center justify-end pt-12">
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={onPageChange}
              previousLabel="< Prev"
              className="flex"
              breakLabel="..."
              nextLabel="Next >"
              pageRangeDisplayed={5}
              containerClassName="pagination"
              activeClassName="text-primary active"
              pageClassName="px-2 page-item"
              nextLinkClassName="page-item"
            />
          </div>
        )}
      </div>
      <Product handlePro={handlePro} isOpen={isOpen} loadingPro={loadingPro} />
    </div>
  );
}


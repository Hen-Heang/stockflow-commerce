import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
// import { declineOrder, getAcceptOrder, getAllNewOrder } from "../../../redux/slices/distributor/SliceNeworder";
import Product from "./Product";
import { useEffect } from "react";
import {
  decline_order,
  get_accept_newOrder,
  get_newOrder,
  get_newOrder_withoutLoading,
} from "../../../redux/services/distributor/NewOrder.service";
import {
  getProductDetail,
  setLoading,
} from "../../../redux/slices/distributor/productSlice";
import { get_detail_product } from "../../../redux/services/distributor/product.service";
import ReactPaginate from "react-paginate";
import ConfirmBox from "./ConfirmBox";
import { setLoadingOrder } from "../../../redux/slices/retailer/orderSlice";
import { PropagateLoader } from "react-spinners";
import {
  addDataToPreparing,
  getAcceptOrder,
  getAllNewOrder,
} from "../../../redux/slices/distributor/SliceNeworder";
import {
  acceptOrder,
  addDataToPrepar,
  declineNewOrder,
  getNewOrder,
  setLoadingTheOrder,
} from "../../../redux/slices/distributor/orderPageSlice";
import { LocalActivity } from "@mui/icons-material";
import Button from "./Button";
import ProdunctNewOrder from "./ProdunctNewOrder";
import LoadingOverlay from "react-loading-overlay";
import { styled } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { over } from "stompjs";
import SockJS from "sockjs-client";
export default function NewOrder(props) {
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);
  const [decline, setDecline] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [item, setItem] = useState();
  const newOrderList = useSelector((state) => state.distributorOrder.orderData);
  const dispatch = useDispatch();
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
        get_newOrder_withoutLoading()
          .then((r) => {
            if (r.data.status === 200) {
              setNoData(false);
              dispatch(getNewOrder(r.data.data));
              setItem(r.data.data);
              setTotalPage(r.data.totalPage);
            } else {
              setError(r.respone.data.detail);
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
        break;
    }
  };
  const onError = (err) => {
    console.log(err);
  };
  useEffect(() => {
    connect();
  }, []);

  // ============ get data =========================
  const productList = useSelector((state) => state.product.product);
  useEffect(() => {
    get_newOrder(dispatch)
      .then((r) => {
        if (r && r.data && r.data.status === 200) {
          setNoData(false);
          dispatch(getNewOrder(r.data.data));
          setItem(r.data.data);
          setTotalPage(r.data.totalPage);
        } else {
          if (r && r.respone && r.respone.data && r.respone.data.detail) {
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
  }, getNewOrder());

  const loading = useSelector((state) => state.distributorOrder.loading);
  const endOffset = itemOffset + 6;
  const currentnewOrder = newOrderList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(newOrderList.length / 6);
  const onPageChange = (event) => {
    const newOffset = (event.selected * 6) % newOrderList.length;
    setItemOffset(newOffset);
  };
  const [loadingAccept, setLoadingAccept] = useState(false);
  // =========================== accept order on page change =========================
  const acceptNewOrder = (id, data) => {
    // console.log(id);
    const message =
      "Your order was accepted and is being prepared. Please keep in contact and monitor the order progress.";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    setLoadingAccept(true);
    get_accept_newOrder(id, data)
      .then(async (res) => {
        console.log("add",res);
        if (res.status == 409) {
          setLoadingAccept(false);
          toast.error(res.data.detail);
        }
        // if (res.status == 401) {
        //   setLoadingAccept(false);
        //   toast.warn("Product out of stock");
        //   dispatch(acceptOrder(id));
        //   dispatch(addDataToPrepar(data));
        // }
        console.log("Response from server : ", res.data.data[0].userId);
        const notification = {
          app_id: appId,
          contents: { en: message },
          include_external_user_ids: [res.data.data[0].userId.toString()],
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
        dispatch(acceptOrder(id));
        dispatch(addDataToPrepar(data));
        setLoadingAccept(false);
      });
  };
  console.log("newOrder", newOrderList.address);
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
  // ============================= handle declined products on page=============================
  const handleDecline = (id) => {
    const message =
      "Your order was declined. Please try to order from other store or contact the store.";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    setLoadingAccept(true);
    decline_order(deleteData?.id)
      .then(async (res) => {
        if (res.status == 409) {
          setLoadingAccept(false);
          toast.error(res.data.detail);
        }
        console.log("Response from server : ", res.data.data.userId);
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
        dispatch(declineNewOrder(deleteData?.id));
        // setLoadingAccept(false);
      })
      .then(() => setLoadingAccept(false));
    setDecline(!decline);
  };
  const handlePro = () => {
    setOpen(!isOpen);
  };
  function openDelete(item) {
    console.log("item", item);
    setDecline(true);
    setDeleteData(item);
  }
  const [itemA, setItemA] = useState([]);
  function getAccept(item) {
    console.log("get accept");
    setItemA(item);
  }
  // =============================== handle accept product pop up =============================
  const handleAccept = (id) => {
    // console.log("Helllo  ooooooooooooooooo");
    const message =
      "Your order was accepted and is being prepared. Please keep in contact and monitor the order progress.";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";

    setLoadingAccept(true);
    get_accept_newOrder(itemA?.id)
      .then(async (res) => {
        if (res.status == 409) {
          setLoadingAccept(false);
          toast.error(res.data.detail);
        }

        console.log("Response from server : ", res.data.data[0].userId);
        const notification = {
          app_id: appId,
          contents: { en: message },
          include_external_user_ids: [res.data.data[0].userId.toString()],
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
        dispatch(acceptOrder(itemA?.id));
        dispatch(addDataToPrepar(itemA));
      })
      .then(() => setLoadingAccept(false));
    setOpen(!isOpen);
  };
  const [itemD, setItemD] = useState([]);
  const [isDelete, setDelete] = useState(false);
  function getDelete2(item) {
    setItemD(item);
  }

  // ======================= handle decline pop up =======================
  const handleDelete = (id) => {
    const message =
      "Your order was accepted and is being prepared. Please keep in contact and monitor the order progress.";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    setLoadingAccept(true);
    decline_order(itemD?.id)
      .then(async (res) => {
        if (res.status == 409) {
          setLoadingAccept(false);
          toast.error(res.data.detail);
        }
        console.log("Response from server : ", res.data.data.userId);
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
        dispatch(declineNewOrder(itemD?.id));
      })
      .then(() => setLoadingAccept(false));
    setDelete(!isDelete);
    setOpen(!isOpen);
  };
  return (
    <div>
      {loadingAccept ? (
        <StyledLoader
          active={loadingAccept}
          spinner={true}
          text="Loading..."
        ></StyledLoader>
      ) : null}
      <div class=" sm:rounded-lg w-full h-[600px] mt-1 ">
        <div className="h-[500px]">
          <table class="w-full text-sm text-left border-tools-table-outline  border-separate border-spacing-y-2">
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
              ) : currentnewOrder.length === 0 ? (
                <div className="w-full mx-auto absolute ">
                  <p className="text-center text-2xl font-semibold mt-24">
                    No data available
                  </p>
                </div>
              ) : (
                currentnewOrder.map((item, index) => (
                  <tr
                    key={item.id}
                    class="rounded-full mt-1 border shadow-sm border-newGray"
                  >
                    <td class="px-6 py-4 items-center">
                      <p>{index + 1 + itemOffset}</p>
                    </td>
                    <td
                      scope="row"
                      class="flex items-center px-6 py-4 text-[16px] whitespace-nowrap"
                    >
                      {item.retailerImage !== "String" && item.retailerImage ? (
                        <img
                          class="w-10 h-10 rounded-full"
                          src={item.retailerImage}
                          alt="retailer image"
                        />
                      ) : (
                        <img
                          class="w-10 h-10 rounded-full bg-red-500"
                          src={require("../../../assets/images/distributor/photo.png")}
                          alt="retailer image"
                        />
                      )}
                      <div class="pl-3">
                        <div class="font-normal text-gray-500">{item.name}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-[16px] whitespace-nowrap">
                      <p>{item.address}</p>
                    </td>
                    <td class="px-6 py-4 text-[16px] whitespace-nowrap">
                      <p>
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-[16px]">
                      <p>
                        $
                        {item.total == null ? (
                          <span>0.00</span>
                        ) : (
                          item.total.toFixed(2)
                        )}
                      </p>
                    </td>
                    <td class="px-6 py-4 ">
                      <button
                        onClick={() => {
                          setOpen(!isOpen);
                          detailProduct(item.id);
                          getAccept(item);
                          getDelete2(item);
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
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <button
                          onClick={() => {
                            openDelete(item);
                          }}
                          className="text-white text-md mr-2 bg-newRed rounded-md w-20 py-[6px]"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            acceptNewOrder(item.id, item);
                          }}
                          disabled={loadingAccept}
                          className="bg-newGreen text-md text-white rounded-md w-20 py-[6px]"
                        >
                          {" "}
                          Accept
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
              previousLabel="< Pre"
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
      <ProdunctNewOrder
        handlePro={handlePro}
        isOpen={isOpen}
        loadingPro={loadingPro}
        acceptOrder={acceptNewOrder}
        handleAccept={handleAccept}
        handleDelete={handleDelete}
        isDelete={isDelete}
        delete={() => setDelete(!isDelete)}
      />
      <ConfirmBox
        open={decline}
        closeDialog={() => setDecline(false)}
        title={deleteData?.id}
        deleteFunction={handleDecline}
      />
    </div>
  );
}
// const Container = styled.div`
//   height: 60px;
//   background-color: black;
// `;
const StyledLoader = styled(LoadingOverlay)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;


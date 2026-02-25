import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "./Product";
import Invoice from "./Invoice";
import { useEffect } from "react";
import { get_all_complete, get_all_complete_withoutLoading } from "../../../redux/services/distributor/complete.service";

import { getProductDetail } from "../../../redux/slices/distributor/productSlice";
import { get_invoice_by_id } from "../../../redux/services/distributor/invoice.service";
import { get_detail_product } from "../../../redux/services/distributor/product.service";
import ReactPaginate from "react-paginate";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  getInvoiceById,
  getInvoiceOrder,
} from "../../../redux/slices/distributor/invoiceDistributorSlice";
import { setLoadingOrder } from "../../../redux/slices/retailer/orderSlice";
import { PropagateLoader } from "react-spinners";
import {
  getAllComplete,
  setLoadingCompleted,
  setLoadingTheOrder,
} from "../../../redux/slices/distributor/orderPageSlice";
import { over } from "stompjs";
import SockJS from "sockjs-client";
export default function Complete({ toggleTab }) {
  const confirmList = useSelector((state) => state.distributorOrder.dataComplete);
  const dispatch = useDispatch();
  const [itemOffset, setItemOffset] = useState(0);
  const [itemOffset1, setItemOffset1] = useState(0);
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  // console.log(confirmList);
  const [invoice, setInvoice] = useState(false);
  const handleInvoice = () => {
    setInvoice(!invoice);
  };
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
      get_all_complete_withoutLoading()
      .then((r) => {
        if (r && r.data && r.data.status == 200) {
          setNoData(false);
          dispatch(getAllComplete(r.data.data));
          setItem(r.data.data);
        } else {
          if (r && r.response && r.response.data && r.response.data.detail) {
            setError(r.respone.data.detail);
          }
          dispatch(setLoadingCompleted(false));
        }
      })
      .catch((e) => {
        dispatch(setLoadingCompleted(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingCompleted(false));
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




  // ====================== get data complete =====================
  const productList = useSelector((state) => state.product.product);
  useEffect(() => {
    get_all_complete(dispatch)
      .then((r) => {
        if (r && r.data && r.data.status == 200) {
          setNoData(false);
          dispatch(getAllComplete(r.data.data));
          setItem(r.data.data);
        } else {
          if (r && r.response && r.response.data && r.response.data.detail) {
            setError(r.respone.data.detail);
          }
          dispatch(setLoadingCompleted(false));
        }
      })
      .catch((e) => {
        dispatch(setLoadingCompleted(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingCompleted(false));
      });
  }, getAllComplete());
  const [loadingPro, setLoadingPro] = useState(false);
  const detailProduct = (id) => {
    console.log(id);
    setLoadingPro(true);
    get_detail_product(id)
      .then((r) => dispatch(getProductDetail(r.data.data.products)))
      .then(() => setLoadingPro(false));
  };
  const invoiceRef = useRef();
  const hanldePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: "invoice",
    // onAfterPrint: () => alert("Get invoie successfully"),
  });
  const loading = useSelector((state) => state.complete.loading);
  const endOffset = itemOffset + 6;
  const currentComplete = confirmList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(confirmList.length / 6);
  const [isOpen, setOpen] = useState(false);
  const handlePro = () => {
    setOpen(!isOpen);
  };
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const invoiceList = useSelector((state) => state.invoiceDis.data);
  const GetInvoice = (id) => {
    console.log(id);
    setLoadingInvoice(true);
    get_invoice_by_id(id).then((r) =>
      dispatch(getInvoiceById(r.data.data.products))
    );
    get_invoice_by_id(id)
      .then((r) => dispatch(getInvoiceOrder(r.data.data.order)))
      .then(() => setLoadingInvoice(false));
    const endOffset1 = itemOffset1 + 6;
    const currentPage = invoiceList.slice(itemOffset1, endOffset1);
    const pageCount1 = Math.ceil(invoiceList.length / 6);
  };
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);
  const onPageChange = (event) => {
    const newOffset = (event.selected * 6) % confirmList.length;
    setItemOffset(newOffset);
  };
  const onPageInvoice = (event) => {
    const newOffset1 = (event.selected * 6) % invoiceList.length;
    setItemOffset(newOffset1);
  };
  return (
    <div>
      <div class="relative sm:rounded-lg mt-1 h-[600px]">
        <div className="h-[500px]">
          <table class="w-full text-sm text-center border-tools-table-outline  border-separate border-spacing-y-2 ">
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
                <th scope="col" class="py-3 w-24">
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
              ) : currentComplete.length === 0 ? (
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
                currentComplete.map((item, index) => (
                  <tr
                    key={index}
                    class="rounded-full mt-1 border text-[16px] shadow-sm border-newGray"
                  >
                    <td class="w-4 p-4 items-center">
                      <p>{index + 1 + itemOffset}</p>
                    </td>
                    <td class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                      <button
                        onClick={() => {
                          setInvoice(!invoice);
                          GetInvoice(item.id);
                        }}
                        className="bg-newGreen text-md text-white rounded-md w-28 py-[6px]"
                      >
                        See invoice
                      </button>
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
      <Invoice
        handleInvoice={handleInvoice}
        invoice={invoice}
        invoiceRef={invoiceRef}
        hanldePrint={hanldePrint}
        loadingInvoice={loadingInvoice}
        onPageInvoice={onPageInvoice}
      />
    </div>
  );
}


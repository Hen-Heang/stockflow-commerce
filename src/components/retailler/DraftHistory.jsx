import React, { useEffect, useState } from "react";
import RetailerInvoice from "./RetailerInvoice";
import {
  delete_draft,
  draft_to_request,
  get_draft_history,
} from "../../redux/services/retailer/draftHistory.service";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDraft,
  deleteDraftHistory,
  draftToRequest,
  getDraftHistory,
  getProduct,
  setLoadingDraft,
} from "../../redux/slices/retailer/draftHistorySlice";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "flowbite-react";
import {
  deleteTheDraft,
  draftToRequest1,
  getDraftHis,
  pushToOrder,
  setLoadingOrder,
} from "../../redux/slices/retailer/orderSlice";
import { PropagateLoader } from "react-spinners";
import ProductDetail from "./ProductDetail";
import DraftProduct from "./DraftProduct";
import { get_orderById } from "../../redux/services/retailer/orderDetail.service";
import {
  getOrderById,
  getOrderProduct,
} from "../../redux/slices/retailer/orderDetailSlice";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { styled } from "@mui/material";
export default function DraftHistory() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Draft";
  }, []);
  const draftHistoryList = useSelector((state) => state.order.dataDraft);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  const dispatch = useDispatch();
  const [itemOffset, setItemOffset] = useState(0);
  const [item1, setItem1] = useState();
  const getAllDraftHistory = () => {
    get_draft_history(dispatch)
      .then((r) => {
        if (r.status == 401) {
          toast.error("Something went wrong...!");
        }
        if (r && r.data && r.data.status == 200) {
          setNoData(false);
          dispatch(getDraftHis(r.data.data));
          setTotalPage(r.data.totalPage);
          setItem1(r.data.data);
        } else {
          if (r && r.data.data && r.data.respone.data.detail) {
            setError(r.respone.data.detail);
          }
          dispatch(setLoadingDraft(false));
        }
      })
      .catch((e) => {
        dispatch(setLoadingDraft(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingDraft(false));
      });
  };
  useEffect(() => {
    getAllDraftHistory();
  }, getDraftHistory());
  const endOffset = itemOffset + 6;
  const currentDrafHistory = draftHistoryList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(draftHistoryList.length / 6);
  const loading = useSelector((state) => state.draft.loading);
  const onPageChange = (event) => {
    const newOffset = (event.selected * 6) % draftHistoryList.length;
    setItemOffset(newOffset);
  };
  const [deleteDraft, setDeleteDraft] = useState(false);
  const [product, setProduct] = useState([]);
  const [draftId, setDraftId] = useState();
  function getItem(item) {
    console.log("getFrom", item);
    setProduct(item);
  }
  function getDraft(itemD) {
    // console.log("id of delete", id);
    setDraftId(itemD);
  }

  // =========================== handle draft changes =========================
  const [loadingTheDraft, setLoadingTheDraft] = useState(false);
  const handleDraft = () => {
    const message =
      "You have new order";
    const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
    const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
    // setLoadingAccept(true)
    setLoadingTheDraft(true);
    draft_to_request(draftId)
      .then(async (res) => {
        if (res.status == 409) {
          // setLoadingAccept(false);
          setLoadingTheDraft(false);
          toast.error(res.data.detail);
        }
        console.log("Response from server : ", res.data.totalPage);
        const notification = {
          app_id: appId,
          contents: { en: message },
          include_external_user_ids: [res.data.totalPage.toString()],
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
          // setLoadingTheDraft(false);
          console.error(
            "Error sending push notification:",
            error.response.data
          );
        }
        dispatch(draftToRequest1(draftId?.id));
        dispatch(pushToOrder(draftId));
      })
      .then(() => {
        setLoadingTheDraft(false);
      });
    setOpen(!isOpen);
    // const [loadingTheDraft,setLoadingTheDraft]=useState(false);
    // const handleDraft = (id) => {
    //   setLoadingTheDraft(true);
    //   draft_to_request(draftId?.id)
    //   .then((r) => {dispatch(draftToRequest1(draftId?.id)); dispatch(pushToOrder(draftId))})
    //   .then(()=>setLoadingTheDraft(false))
    //   setOpen(!isOpen);
  };
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDelete = (id) => {
    setLoadingDelete(true);
    delete_draft(id)
      .then((r) => dispatch(deleteTheDraft(id)))
      .then(() => setLoadingDelete(false));
  };
  const [isOpen, setOpen] = useState(false);
  const StyledLoader = styled(LoadingOverlay)`
    position: fixed;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `;
  return (
    <div>
      {loadingDelete ? (
        <StyledLoader
          active={loadingDelete}
          spinner={true}
          text="Deleting..."
        ></StyledLoader>
      ) : null}
      {loadingTheDraft ? (
        <StyledLoader
          active={loadingTheDraft}
          spinner={true}
          text="Loading..."
        ></StyledLoader>
      ) : null}
      <div className="dark:text-white">
        {/* <div className="bg-white min-h-screen rounded-lg w-[80%] shadow-md mx-auto"> */}
        <div className="lg:w-[80%] w-100% min-h-screen m-auto p-8 bg-white">
          {/* <div className="flex flex-wrap flex-col gap-3 justify-between m-auto"> */}
          <div className="flex flex-wrap flex-col gap-2 justify-center">
            <h1 className="text-3xl font-semibold text-retailerPrimary">
              Draft history
            </h1>
            <p className="text-newGray mt-1 text-md">
              This is the product you have drafted.
            </p>
            <p className="text-md text-newGray">
              Click on check out button to order your drafted cart!
            </p>
            <div class="sm:rounded-lg h-[625px] bg-gray-50 w-[100%] ">
              <div className="lg:h-[560px] h-[640px] bg-gray-50 relative  overflow-x-auto w-[100%] ">
                <table class="w-full lg:text-[16px] text-[14px] text-left text-gray-500 border-spacing-y-2 border-tools-table-outline  border-separate">
                  <thead class="text-[16px] lg:text-[14px] text-newGray bg-newWhite uppercase">
                    <tr className="lg:text-[16px] text-[14px]">
                      <th scope="col" class="px-6 py-3">
                        No
                      </th>
                      <th scope="col" class="px-6 py-3">
                        ShopName
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" class="px-6 py-3">
                        <p className="ml-12"> Action</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-newGray">
                    {loading ? (
                      <div className="w-full mx-auto absolute mt-24 text-center ">
                        <PropagateLoader color="#F15B22" />
                      </div>
                    ) : currentDrafHistory.length === 0 ? (
                      // noData ? (
                      //   <div className="w-full mx-auto absolute ">
                      //     <p className="text-center text-2xl font-semibold mt-2">
                      //       {error}
                      //     </p>
                      //   </div>
                      // ) : 
                      (
                        <div className="w-full  mx-auto absolute ">
                          <p className="text-center text-2xl font-semibold mt-24">
                            No data available
                          </p>
                        </div>
                      )
                    ) : (
                      currentDrafHistory.map((item, index) => (
                        <tr
                          key={item}
                          class="rounded-lg mt-4 shadow-sm bg-gray-50 lg:text-[16px] text-14px"
                        >
                          <td class="px-6 py-4 ">{index + 1 + itemOffset}</td>
                          <td class="px-6 py-4 flex items-center whitespace-nowrap">
                            <img
                              class="w-10 h-10 rounded-full"
                              src={item.order.image}
                              alt="image"
                            />
                            <div class="pl-3">
                              <div class="font-normal text-gray-500">
                                {item.order.name}
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap ">
                            {new Date(item.order.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td class="px-6 py-4 ">
                            ${item.order.total.toFixed(2)}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                handleDelete(item.order.id);
                              }}
                              className="bg-red-500 text-md text-white rounded-md w-24 ml-2  py-[6px]"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                getItem(item.products);
                                setOpen(!isOpen);
                                getDraft(item.order);
                              }}
                              className="bg-retailerPrimary text-md text-white rounded-md w-24 ml-2  py-[6px]"
                            >
                              Check Out
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
                <div class="flex  items-center justify-end">
                  <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                    previousLabel="< Pre"
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
          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
      <React.Fragment>
        <Modal
          show={isOpen}
          size="2xl"
          popup={true}
          onClose={() => setOpen(!isOpen)}
        >
          <div className="mt-60 lg:mt-0">
            <Modal />
            <Modal.Header className="text-center bg-retailerPrimary w-full">
              <h1 className="text-center text-white font-semiblod lg:ml-72 ml-52 text-lg">
                Products
              </h1>
              <p
                className="text-white float-right absolute right-2 top-2 bg-retailerPrimary w-8 h-8"
                onClick={() => setOpen(!isOpen)}
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
            <Modal.Body className="">
              <div class="sm:rounded-lg mt-4 relative overflow-x-auto w-full">
                <div className="h-[400px] overflow-y-auto w-full">
                  <table class="w-full text-sm text-left text-newGray">
                    <thead class="text-xs text-black bg-newWhite  border-spacint">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          No
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Products
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Qty
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Stock
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Unitprice
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-black">
                      {product.map((item, index) => (
                        <tr class="bg-white border-b text-black dark:bg-gray-800 text-sm">
                          <td
                            scope="row"
                            class="px-6 py-3 0 whitespace-nowrap dark:text-white"
                          >
                            {" "}
                            {index + 1}
                          </td>
                          <td
                            scope="row"
                            class="flex items-center px-6 py-3 whitespace-nowrap"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt="upload image"
                                class="w-10 h-10 rounded-full p-1"
                              />
                            ) : (
                              <img
                                class="w-10 h-10 rounded-full"
                                src={require("../../assets/images/retailer/No_image_available.png")}
                              />
                            )}
                            <div class="pl-3">
                              <div class="text-sm">{item.productName}</div>
                              <div class="font-normal text-xs text-newGray">
                                {/* {item.category.name} */}
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-3">{item.qty}</td>
                          <td class="px-6 py-3">{item.inStock}</td>
                          <td class="px-6 py-3">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td class="px-6 py-3">${item.subTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <button
                    onClick={handleDraft}
                    className="bg-retailerPrimary text-sm text-white font-semibold rounded-md w-20 py-[6px] float-right mt-6 ml-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setOpen(!isOpen)}
                    className="border-retailerPrimary border text-sm text-retailerPrimary font-semibold rounded-md w-20 py-[6px] float-right mt-6"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </React.Fragment>
    </div>
  );
}


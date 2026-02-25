import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_detail_product } from "../../redux/services/distributor/product.service";
import { getImportHistory, setLoadingHistory } from "../../redux/slices/distributor/importHistorySlice";
import { get_import_history } from "../../redux/services/distributor/ImportHistory.service";
import ReactPaginate from "react-paginate";
import { setLoadingOrder } from "../../redux/slices/retailer/orderSlice";
import { PropagateLoader } from "react-spinners";
import { toast } from "react-toastify";
export default function History() {
  useEffect(() => {
    document.title = "StockFlow Commerce | History";
  }, []);
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);
  const historyList = useSelector((state) => state.importHistory.data);
  console.log(historyList)
  const dispatch = useDispatch();
  const [itemOffset, setItemOffset] = useState(0);
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  useEffect(() => {
    get_import_history(dispatch).then((r) => {
      if(r.status == 401){
        toast.error("Something went wrong...!")
      }
      if (r && r.data && r.data.status === 200) {
        setNoData(false);
        console.log("All data",r.data.data)
        dispatch(getImportHistory(r.data.data));
        setItem(r.data.data);
        setTotalPage(r.data.totalPage);
      }
      else {
        if (r && r.response && r.response.data && r.response.data.detail) {
          setError(r.respone.data.detail)
        }
        dispatch(setLoadingHistory(false))
      }
    })
      .catch((e) => {
        dispatch(setLoadingHistory(false));
        setNoData(true);
      })
      .finally(() => {
        dispatch(setLoadingHistory(false))
      })
  }, getImportHistory());
  const onPageChange = (event) => {
    const newOffset = (event.selected * 8) % historyList.length;
    setItemOffset(newOffset);
    // get_import_history(selected + 1).then((r) => { dispatch(getImportHistory(r.data.data)); setTotalPage(r.data.totalPage) })
  };
  const endOffset = itemOffset + 8;
  const currentHistory = historyList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(historyList.length / 8);
  const loading = useSelector((state) => state.importHistory.loading);

  const [isOpenR, setIsOpenR] = useState(false);
  useEffect(() => {
    setIsOpenR(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpenR(true);
    }, 1000); // Delay of 500 milliseconds
  
    return () => clearTimeout(timer);
  }, []);
    return (
      <div
      className={`dark:text-white transition ${
        isOpenR
          ? " transition-all ease-in-out delay-300 duration-1000 "
          : "opacity-0 scale-95 translate-y-1/2 "
      }`}
    >
      {/* <div className="bg-white min-h-screen rounded-lg w-full shadow-md"> */}
      <div className="w-[100%] p-8 bg-white rounded-lg min-h-screen m-auto">
        {/* <div className="flex flex-wrap flex-col gap-3 justify-between m-auto"> */}
        <div className="flex flex-wrap flex-col gap-5 justify-center">
          <h1 className="text-3xl font-semibold text-primary">
            Import history
          </h1>
          <p className="text-md text-newGray">
            Manage your recent imported product.
          </p>
          {/* <div> */}
          <div class="relative shadow-md sm:rounded-lg h-[600px] w-[100%]">
            <div className="h-[600px] w-[100%] relative overflow-x-auto">
              <table class="w-full text-[16px] text-left text-gray-500 dark:text-gray-400 border-tools-table-outline  border-separate border-spacing-y-2">
                <thead class="text-[16px] text-newGray bg-newWhite  border-spacint">
                  <tr className="text-[16px]">
                    <th scope="col" class="px-10 py-3 text-[16px]">
                      Date
                    </th>
                    <th scope="col" class="px-6 py-3 capitalize">
                      Category
                    </th>
                    <th scope="col" class="px-8 py-3 capitalize">
                      Name
                    </th>
                    <th scope="col" class="px-4 py-3">
                      Qty
                    </th>
                    <th scope="col" class="px-2 py-3 whitespace-nowrap">
                      Imported price
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Total price
                    </th>
                  </tr>
                </thead>
                <tbody className="text-newGray">
                  {loading
                    ? (
                      <div className='w-full mx-auto absolute mt-24 text-center '>
                        <PropagateLoader color="#0F766E" />
                      </div>
                    ) : currentHistory.length === 0
                      ? noData ? (
                        <div className='w-full mx-auto absolute '>
                          <p className='text-center text-2xl font-semibold mt-2'>{error}</p>
                        </div>
                      ) : (
                        <div className='w-full mx-auto absolute '>
                          <p className='text-center text-2xl font-semibold mt-24'>No data available</p>
                        </div>
                      )
                      : (
                        currentHistory.map((item) => (
                          <tr class="rounded-lg whitespace-nowrap  shadow-sm bg-gray-50 hover:bg-gray-50 dark:hover:bg-gray-600 lg:text-[16px] text-[14px]">
                            <td scope="row" class="px-6 py-4 whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                              })}
                            </td>
                            <td class="px-6 lg:py-4 py-2">
                              {item.category == null 
                              ? <p>No category</p>
                              : item.category
                              }</td>
                            <td class="px-6 lg:py-4 py-2">
                            {item.name == null 
                              ? <p>No name</p>
                              : item.name
                              }
                            </td>
                            <td class="px-6 lg:py-4 py-2">{item.qty}</td>
                            <td class="px-12 lg:py-4 py-2">
                            ${item.price == null
                              ? <span>0.00</span>
                              : (item.price).toFixed(2)
                            }
                            </td>
                            <td class="px-6 lg:py-4 py-2">${item.total == null
                              ? <span>0.00</span>
                              : (item.total).toFixed(2)
                            }</td>
                          </tr>
                        )))
                  }
                </tbody>
              </table>
            </div>
            {error || noData || loading || pageCount < 2 ? null : (
              <div className="flex  items-center justify-end pt-4" >
                <ReactPaginate pageCount={pageCount} onPageChange={onPageChange} previousLabel="< Pre" className="flex" breakLabel="..." nextLabel="Next >" pageRangeDisplayed={5} containerClassName="pagination" activeClassName="text-primary active" pageClassName="px-2 page-item" nextLinkClassName="page-item" />
              </div>
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}



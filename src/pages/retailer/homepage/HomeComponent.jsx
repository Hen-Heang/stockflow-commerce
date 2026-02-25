import { Button, Carousel, Dropdown } from "flowbite-react";
import React, { useEffect } from "react";
import CategoryCarousel from "./CategoryCarousel";
import { BiStar, BiCalendar, BiSortZA } from "react-icons/bi";
import NewShopCarousel from "./NewShopCarousel";
import AllShopCarousel from "./AllShopCarousel";
import AllShopCarouselNewest from "./AllShopCarouselNewest";
import AllShopCarouselHighestRate from "./AllShopCarouselHighestRate";
import {
  get_all_store,
  get_all_new_store,
  get_store_by_id,
  get_all_product_by_storeId,
  get_all_category_by_storeId,
} from "../../../redux/services/retailer/retailerHomepage.service";
import {
  getAllCategoryByStoreId,
  getAllDataNewShop,
  getAllProductByStoreId,
  getDataAllShopShow,
  getShopById,
  setStoreId,
} from "../../../redux/slices/retailer/homepageSlice/allShopSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReactPaginate from "react-paginate";
export default function HomeComponent() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Home";
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    get_all_store().then((e) => dispatch(getDataAllShopShow(e.data.data)));
  }, []);

  useEffect(() => {
    get_all_new_store().then((e) => dispatch(getAllDataNewShop(e.data.data)));
  }, []);

  // useEffect(() => {
  //   get_all_category().then((e)=> dispatch(getAllDataNewShop(e.data.data))) ;
  // },[])
  // const pageCount = Math.ceil(orderList.length / 6);
  // const onPageChange = (event) => {
  //   const newOffset = (event.selected * 6) % orderList.length;
  //   setItemOffset(newOffset);
  // }

  const dataShop = useSelector((state) => state.getDataAllShop.dataShop);
  // console.log("gaga :", dataShop);

  const { dataNewShop } = useSelector((state) => state.getDataAllShop);
  // console.log("dataNewShop : ",dataNewShop);

  const navigate = useNavigate();

  const onClickGetDataShop = (id) => {
    get_store_by_id(id).then((e) => dispatch(getShopById(e.data.data)));

    get_all_product_by_storeId(id).then((e) =>
      dispatch(getAllProductByStoreId(e.data.data))
    );
    get_all_category_by_storeId(id).then((e) =>
      dispatch(getAllCategoryByStoreId(e.data.data))
    );
    // const storeId= id;
    setStoreId(id);

    dispatch(setStoreId(id)); // Dispatch the setStoreId action

    navigate("/retailer/distributor-shop");
    window.scrollTo(0, 0);
  };

  const [selectedOption, setSelectedOption] = useState("all");

  const handleDropdownChange = (event) => {
    setSelectedOption(event);
  };

  return (
    <div className="mb-5 lg:h-[220vh]  sm:h-[150vh]  ">
      <div className="h-56 sm:h-64 xl:h-96 2xl:h-96">
        <Carousel
          slide={true}
          // leftControl={
          //   <div>
          //     <img
          //       src={require("../../../assets/images/retailer/back.png")}
          //       alt=""
          //     />
          //   </div>
          // }
          // rightControl={
          //   <div>
          //     <img
          //       src={require("../../../assets/images/retailer/next.png")}
          //       alt=""
          //     />
          //   </div>
          // }
        >
          <img
            src={require("../../../assets/images/forCarousel4.webp")}
            // src={item.bannerImage}
            alt="..."
          />
          <img
            src={require("../../../assets/images/retailer/forCarousel.jpg")}
            // src={item.bannerImage}
            alt="..."
          />
          <img
            src={require("../../../assets/images/retailer/woman-checking-her-delivery-groceries.jpg")}
            // src={item.bannerImage}
            alt="..."
          />
          <img
            src={require("../../../assets/images/retailer/forCarousel2.webp")}
            // src={item.bannerImage}
            alt="..."
          />
        </Carousel>
      </div>

      {/* item */}
      <div>
        <div className="w-[90%] sm:w-[80%] mx-auto flex flex-col sm:gap-5 sm:mt-8  ">
          <div className="w-full sm:w-[90%] mx-auto flex flex-col ">
            {/* <h3 className="text-xl font-bold text-gray-500">
              Find things you'll love. Support independent distributors.
            </h3> */}
            {/* <p className="text-[16px] text-[#777]">Only on Warehouse master</p> */}
            <div className="w-full mb-5 sm:mb-0">
              {/* <h2 className="text-xl font-bold text-orange-500">Top 10 highest Rate Shops</h2> <br /> */}
              <CategoryCarousel />
            </div>
          </div>

          {/* new shop */}
          <div className="w-[90%] mx-auto  flex flex-col">
            {/* <div className="flex ">
              <h2 className="text-xl justify-start font-bold text-orange-500 -mb-5 mt-2">10 Most Recent Shop</h2>
            </div> */}
            <div className="w-full mb-5 sm:mb-0">
              <NewShopCarousel />
            </div>
          </div>

          {/*all shop */}
          <div className="flex justify-between px-10 w-full py-2 bg-white shadow-lg rounded-xl mb-10 sm:mb-0">
            <h2 className="flex items-center">All Shop</h2>
            <Dropdown
              inline={true}
              arrowIcon={false}
              label={
                // sort by
                <button className="flex items-center px-3 py-2 border border-[#f15b22] rounded-xl gap-10">
                  <span className="">Sort by</span>
                  <svg
                    class="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600"
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
                    />
                  </svg>
                </button>
              }

              // for tracking dropdown selection
            >
              <Dropdown.Item
                icon={BiSortZA}
                onClick={() => handleDropdownChange("all")}
              >
                {/* {console.log(selectedOption,"fafafafa")} */}
                <div className="flex w-auto">
                  <span>All</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={BiCalendar}
                onClick={() => handleDropdownChange("newest")}
              >
                <div className="flex w-auto">
                  <span>Newest</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={BiStar}
                onClick={() => handleDropdownChange("rate")}
              >
                <div className="flex w-auto">
                  <span>Highest Rate</span>
                </div>
              </Dropdown.Item>
            </Dropdown>

            {/* <p>Selected option: {selectedOption}</p> */}
          </div>

          {/* All shop */}
          {/* <div className="w-[90%] mx-auto flex flex-col gap-5">
            <div className="w-full">
                <AllShopCarousel/>
            </div>
          </div> */}

          {/* Render div based on selected option */}
          {selectedOption === "all" && (
            <div className="w-[90%] mx-auto flex flex-col gap-5">
              <div className="w-full">
                {/* {console.log('fafafafa')} */}
                <AllShopCarousel />
              </div>
            </div>
          )}

          {selectedOption === "newest" && (
            <div className="w-[90%] mx-auto flex flex-col gap-5">
              <div className="w-full">
                {/* {console.log('fafafafa')} */}
                <AllShopCarouselNewest />
              </div>
            </div>
          )}

          {selectedOption === "rate" && (
            <div className="w-[90%] mx-auto flex flex-col gap-5">
              <div className="w-full">
                {/* {console.log('fafafafa')} */}
                <AllShopCarouselHighestRate />
              </div>
            </div>
          )}
          {/* <div class="flex  items-center justify-end" >
                <ReactPaginate pageCount={pageCount} onPageChange={onPageChange} previousLabel="< Prev" className="flex" breakLabel="..." nextLabel="Next >" pageRangeDisplayed={5} containerClassName="pagination" activeClassName="text-retailerPrimary active" pageClassName="px-2 page-item" nextLinkClassName="page-item" />
              </div> */}
        </div>
      </div>
    </div>
  );
}


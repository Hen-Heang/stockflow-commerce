import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import AllProducts from "./AllProducts";
import AllProductSortByPrice from "./AllProductSortByPrice";
import Beverage from "./Beverage";
import Snack from "./Snack";
import Skincare from "./Skincare";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation, useNavigate, useRoutes } from "react-router-dom";
import noImage from "../../assets/images/no_image.jpg";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  bookmark_store,
  get_all_category_by_storeId,
  get_all_product_by_category,
  get_all_product_by_storeId,
  get_all_product_sort_by_created_date,
  get_all_product_sort_by_price,
  get_store_by_id,
  remove_bookmark_store,
} from "../../redux/services/retailer/retailerHomepage.service";
import {
  getAllCategoryByStoreId,
  getAllProductByCategory,
  getAllProductByStoreId,
  getProductByDate,
  getProductByPrice,
  getShopById,
  setLoadingAdd,
  setLoadingCard,
  setLoadingPrice,
  setLoadingStore,
  setUpdateBookmarkOneStore,
  setUpdateBookmarkStore,
} from "../../redux/slices/retailer/homepageSlice/allShopSlice";
import AllProductSortByDate from "./AllProductSortByDate";
import SkeletonSearchCard from "../../components/retailler/skeletons/SkeletonSearchCard";
import SkeletonCard from "../../components/retailler/skeletons/SkeletonCard";
import { setLoadingCategory } from "../../redux/slices/distributor/categorySlice";
import { Rating, Stack } from "@mui/material";

export default function DistributorStoreRetailer() {
  function handleGoBack() {
    window.history.back();
  }

  const location = useLocation();
  console.log("Location : ", location);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = `StockFlow Commerce | Shop`;
    // toggleTab0()
  }, []);
  //navbar tap
  const [toggleState, setToggleState] = useState(0);
  // console.log("data",toggleState);

  // const { storeId } = useSelector((state) => state.getDataAllShop);

  const [selectedOption, setSelectedOption] = useState("all");

  const handleDropdownChange = (e) => {
    setSelectedOption(e);
    // console.log("fafafaf  " ,e)
  };

  const toggleTab = (index) => {
    setToggleState(index);

    if (index == 0 && selectedOption == "all") {
      get_all_product_by_storeId(id).then(
        (e) => dispatch(getAllProductByStoreId(e.data.data))
        // console.log("hahahahah",e)
      );
    }

    else {
      get_all_product_by_category(id, index).then(
        (e) => dispatch(getAllProductByCategory(e.data.data))
        
      );
    }
  };

  const toggleTab0 = () => {
    toggleTab(0);
  };
  const toggleTab2 = () => {
    toggleTab(2);
  };
  const [numberToggle, setNumberToggle] = useState();
  const toggleTabCategory = (id) => {
    toggleTab(id);
    // console.log(id);
  };
  // get data for shop
  const { oneShopData } = useSelector((state) => state.getDataAllShop);
  // console.log("one shop data : ", oneShopData);

  const { categoryData } = useSelector((state) => state.getDataAllShop);

  // const { id } = useParams();

  const id = new URLSearchParams(location.search).get("storeId");
  console.log("storeId from route :", id);
  // console.log("local Store ID ", id);

  // const [loadingStore, setLoadingStore] =(false);

  const loadingStore = useSelector(
    (state) => state.getDataAllShop.loadingStore
  );
  const loadingCard = useSelector((state) => state.getDataAllShop.loadingCard);
  const loadingCategory = useSelector(
    (state) => state.getDataAllShop.loadingCategory
  );
  const loadingPrice = useSelector(
    (state) => state.getDataAllShop.loadingPrice
  );
  const loadingAdded = useSelector(
    (state) => state.getDataAllShop.loadingAdded
  );

  // console.log("loading : ",loadingCard)

  useEffect(() => {
    // setLoadingStore(true);
    get_store_by_id(id, dispatch)
      .then((e) => dispatch(getShopById(e.data.data)))
      .then(() => dispatch(setLoadingStore(false)));

    get_all_product_by_storeId(id, dispatch)
      .then((e) => dispatch(getAllProductByStoreId(e.data.data)))
      .then(() => dispatch(setLoadingCard(false)));

    get_all_product_sort_by_created_date(id, dispatch)
      .then((e) => dispatch(getProductByDate(e.data.data)))
      .then(() => dispatch(setLoadingAdd(false)));

    get_all_product_sort_by_price(id, dispatch)
      .then((e) => dispatch(getProductByPrice(e.data.data)))
      .then(() => dispatch(setLoadingPrice(false)));

    get_all_category_by_storeId(id, dispatch)
      .then((e) => dispatch(getAllCategoryByStoreId(e.data.data)))
      .then(() => dispatch(setLoadingCategory(false)));

    // console.log("hahahahaha")
  }, [location.search]);
  const [isBookmarked, setIsBookmarked] = useState(false); // Add a state to track bookmarking

  const handleBookmarkClick = (oneShopData) => {
    if (oneShopData.isBookmarked) {
      // If already bookmarked, remove the bookmark
      remove_bookmark_store(oneShopData.id)
        .then(() => {
          // toast.error("Bookmark removed");
          setIsBookmarked(false);
        })
        .then(() => dispatch(setUpdateBookmarkOneStore(oneShopData)));
    } else {
      // If not bookmarked, add the bookmark
      bookmark_store(oneShopData.id)
        .then(() => {
          // toast.success("Bookmarked successfully");
          setIsBookmarked(true);
        })
        .then(() => dispatch(setUpdateBookmarkOneStore(oneShopData)));
    }
  };

  return (
    <div>
      <div className="mx-auto w-[80%]">
        <Link onClick={handleGoBack} className="flex flex-wrap my-5">
          <svg
            className="w-3 sm:h-6 h-4 sm:mr-3 mr-1 fill-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          <div>
            <p className="font-bold sm:text-base text-xs ">Back</p>
          </div>
        </Link>

        {loadingStore ? (
          <SkeletonSearchCard />
        ) : (
          <>
            <img
              className="w-full lg:h-[400px] h-[180px]"
              src={
                oneShopData.bannerImage == "" || oneShopData.bannerImage == null
                  ? noImage
                  : oneShopData.bannerImage
              }
            />
            <div className=" bg-white shadow-xl w-full relative ">
              {/* heart button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up

                  handleBookmarkClick(oneShopData);
                }}
                className="w-8 h-8 rounded-full absolute right-0 bottom-0 mb-2 mr-2 bg-white hover:opacity-80 border border-orange-500 hover:hs-tooltip-shown:gag"
              >
                {oneShopData.isBookmarked ? (
                  <svg
                    className="fill-orange-500 w-6 h-6 ml-[0.21rem] mt-[0.1rem]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                  </svg>
                ) : (
                  <>
                    <svg
                      className="fill-orange-500 w-6 h-6 ml-[0.21rem] mt-[0.1rem]"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex justify-between sm:p-7 p-4">
                <div className=" w-11/12 ">
                  <h1 className="font-extrabold sm:text-2xl text-xl">
                    {oneShopData.name}'s storage{" "}
                  </h1>
                  <div className="flex flex-wrap mt-6">
                    <div className="mr-12">
                      <p className=" font-semibold ">Rating: </p>
                    </div>
                    <div className="flex flex-wrap">
                      {/* <svg
                        className="w-5 mr-2 fill-orange-500 -mt-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg> */}

                      <div>
                        <p className="text-gray-600 font-medium text-lg">
                          <Stack spacing={1}>
                            <Rating
                              name="half-rating"
                              defaultValue={
                                parseFloat(oneShopData.rating).toFixed(2) === '0.00'
                                  ? 0.01
                                  : parseFloat(oneShopData.rating).toFixed(2)
                              }
                              precision={
                                parseFloat(oneShopData.rating).toFixed(2) === '0.00'
                                  ? 0.01
                                  : parseFloat(oneShopData.rating).toFixed(2)
                              }
                            />
                          </Stack>
                          {/* {console.log(parseFloat(oneShopData.rating).toFixed(2))}
                          {parseFloat(oneShopData.rating).toFixed(2)} */}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-1">
                    <div className="mr-10">
                      <p className=" font-semibold ">location: </p>
                    </div>
                    <div className="flex flex-wrap mr-1">
                      <svg
                        className="w-4 mr-2  fill-gray-200 -mt-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                      >
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                      </svg>

                      <div>
                        <p className="text-gray-500 font-medium text-lg">
                          {oneShopData.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-1">
                    <div className="mr-10">
                      <p className=" font-semibold ">Contact: </p>
                    </div>
                    <div className="flex flex-wrap">
                      <svg
                        className="w-4 mr-2 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                      </svg>

                      <div>
                        <p className="text-gray-500 font-medium text-lg">
                          {/* {oneShopData.primaryPhone} / { oneShopData.additionalPhone} */}
                          {oneShopData.additionalPhone == "" ||
                          oneShopData.additionalPhone == null
                            ? oneShopData.primaryPhone
                            : `${oneShopData.primaryPhone} / ${oneShopData.additionalPhone}`}

                          {/* {oneShopData.additionalPhone && `${oneShopData.primaryPhone} / ${oneShopData.additionalPhone}`} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" font-bold text-base text-orange-500 w-1/12 justify-end">
                  {/* Review & info */}
                </div>
              </div>
            </div>{" "}
          </>
        )}

        {/* sort by button */}

        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <div className="mt-10 ">
              <div
                class="
               mx-1 sm:mt-1 hs-dropdown relative sm:inline-flex [--auto-close:false]"
              >
                <button
                  id="hs-dropdown-auto-close-false"
                  type="button"
                  class="hs-dropdown-toggle py-2 px-4 sm:inline-flex justify-center hidden  items-center gap-[1.1rem] rounded-md font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 border-2 border-orange-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8 text-orange-500 fill-orange-500 mr-2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  <p className="font-semibold text-lg text-orange-500 mr-2 ">
                    Sort All Product By
                  </p>
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
              </div>
            </div>
          }
        >
          <Dropdown.Item onClick={() => handleDropdownChange("all")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7 text-orange-500 fill-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            <p className="text-gray-500 text-base font-normal ml-3 hover:text-orange-500 focus-visible:text-orange-500">
              All
            </p>
          </Dropdown.Item>

          <Dropdown.Divider />
          <Dropdown.Item onClick={() => handleDropdownChange("price")}>
            <div className="flex w-32 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-7 h-7  text-orange-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                />
              </svg>
              <p className="text-gray-500 text-base font-normal ml-3 hover:text-orange-500">
                Price
              </p>
            </div>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => handleDropdownChange("recent")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7 text-orange-500 fill-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            <p className="text-gray-500 text-base font-normal ml-3 hover:text-orange-500">
              Recently Added
            </p>
          </Dropdown.Item>
        </Dropdown>

        {/* nav click */}

        <div className="border-2 mt-7 mb-8 rounded-xl w-[100%]">
          <div className="space-x-6 =ml-7">
            <div className="flex items-center">
              <ul className="flex flex-row text-md p-4 mr-6 space-x-8 text-[16px] overflow-x-auto">
                <li className="cursor-pointer">
                  <button
                    onClick={toggleTab0}
                    className={
                      toggleState === 0
                        ? "text-newGray whitespace-nowrap dark:text-white border-b-2 border-orange-500"
                        : "outline-none whitespace-nowrap"
                    }
                  >
                    All Products
                  </button>
                </li>

                {categoryData?.map((item) => (
                  <li className="cursor-pointer">
                    <button
                      onClick={() => toggleTab(item.id)} // Pass the item.id to toggleTab function
                      className={
                        toggleState === item.id
                          ? "text-newGray dark:text-white border-b-2 border-orange-500"
                          : "outline-none"
                      }
                    >
                      {item.name}
                    </button>
                  </li>
                )) || <p></p>}
              </ul>
            </div>

            {/* data of each tab  */}
          </div>
        </div>
        <div>
          <div className=" w-full">
            <div className="flex-grow-1">
              <div
                className={
                  toggleState === 0
                    ? " w-full h-full block"
                    : "bg-white w-full h-full hidden"
                }
              >
                {/* <AllProducts toggleTab0={toggleTab0} /> */}
              </div>
              <div
                className={
                  toggleState === toggleState
                    ? " w-full h-full block"
                    : " w-full h-full hidden"
                }
              >
                {/* <Beverage toggleTabCategory={toggleTab} /> */}
              </div>
              {/* <div
                className={
                  toggleState === 3
                    ? "bg-white w-full h-full   block"
                    : "bg-white w-full h-full hidden"
                }
              >
                <Snack toggleTab4={toggleTab4} />
              </div>
              <div
                className={
                  toggleState === 4
                    ? "bg-white w-full h-full   block"
                    : "bg-white w-full h-full hidden"
                }
              >
                <Skincare toggleTab5={toggleTab5} />
              </div> */}
              {/* <div
                className={
                  toggleState === 5
                    ? "bg-white w-full h-full   block"
                    : "bg-white w-full h-full hidden"
                }
              >
                <Complete />
              </div> */}
            </div>

            <div>
              <div className="w-full">
                <div className="flex-grow-1">
                  <div
                    className={
                      toggleState === 0
                        ? "w-full h-full block"
                        : "bg-white w-full h-full hidden"
                    }
                  >
                    {/* Display AllProducts component when toggleState is 0 */}

                    {/* {toggleState === 0 && selectedOption === 'all' && <SkeletonCard toggleTab0={toggleTab0} />} */}
                    {toggleState === 0 &&
                      selectedOption === "all" &&
                      (loadingCard ? (
                        <SkeletonCard toggleTab0={toggleTab0} />
                      ) : (
                        <AllProducts toggleTab0={toggleTab0} />
                      ))}
                    {toggleState === 0 &&
                      selectedOption === "price" &&
                      (loadingPrice ? (
                        <SkeletonCard toggleTab0={toggleTab0} />
                      ) : (
                        <AllProductSortByPrice toggleTab0={toggleTab0} />
                      ))}
                    {toggleState === 0 &&
                      selectedOption === "recent" &&
                      (loadingAdded ? (
                        <SkeletonCard toggleTab0={toggleTab0} />
                      ) : (
                        <AllProductSortByDate toggleTab0={toggleTab0} />
                      ))}

                    {/* {toggleState === 0 && <SkeletonCard toggleTab0={toggleTab0} />} */}

                    {/* {categoryData?.map((item) => (

                   toggleState === item.id && <Beverage toggleTab0={toggleTab0} />

                ))} */}

                    {/* {toggleState === item.id && <AllProducts toggleTab0={toggleTab0} />} */}
                  </div>

                  <div
                    className={
                      toggleState !== 0
                        ? "w-full h-full block"
                        : "w-full h-full hidden"
                    }
                  >
                    {/* Default value */}

                    {/* <Beverage toggleTabCategory={toggleTab} /> */}

                    {/* {toggleState !== 0 && <Beverage toggleTab={toggleTab} />} */}

                    {toggleState !== 0 && <Beverage toggleTab={toggleTab} />}

                    {/* {toggleState !== 0 && <Beverage toggleTab={toggleTab} />} */}
                    {/* {toggleState === 0 && <AllProducts toggleTab0={toggleTab0} />} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <AllProducts /> */}
        </div>
      </div>
    </div>
  );
}


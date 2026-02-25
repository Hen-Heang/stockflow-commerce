import Carousel from "react-grid-carousel";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import noImage from "../../../assets/images/no_image.jpg";
import {
  getAllCategoryByStoreId,
  getAllProductByStoreId,
  getBookmarkStore,
  getShopById,
  setStoreId,
  setUpdateBookmarkStoreNewest,
} from "../../../redux/slices/retailer/homepageSlice/allShopSlice";
import {
  bookmark_store,
  get_all_bookmark_store,
  get_all_category_by_storeId,
  get_all_highest_rate,
  get_all_product_by_storeId,
  get_store_by_id,
  remove_bookmark_store,
} from "../../../redux/services/retailer/retailerHomepage.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Top10RecenceShop from "../../../components/retailler/skeletons/Top10RecenceShop";

const NewShopCarousel = () => {
  const dataNewShop = useSelector((state) => state.getDataAllShop.dataNewShop);
  // console.log(dataNewShop);
  const isNull = true;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const onClickGetDataShop = (id,storeName) => {

    // get_store_by_id(id).then((e) => dispatch(getShopById(e.data.data)));

    // get_all_product_by_storeId(id).then((e) =>
    //   dispatch(getAllProductByStoreId(e.data.data))
    // );
    // get_all_category_by_storeId(id).then((e)=> dispatch(getAllCategoryByStoreId(e.data.data)));
    // // const storeId= id;
    dispatch(setStoreId(id));

    dispatch(setStoreId(id)); // Dispatch the setStoreId action
    // navigate(`/retailer/distributor-shop?storeId=${id}?storeName=${storeName}`)
    navigate(`/retailer/distributor-shop?storeId=${id}&storeName=${encodeURIComponent(storeName)}`);


    // navigate(`/retailer/distributor-shop/${id}`);
    window.scrollTo(0, 0);
  };

  const [isBookmarked, setIsBookmarked] = useState(false); // Add a state to track bookmarking

  // useEffect(() => {
  //   get_all_bookmark_store().then((e) => dispatch(getBookmarkStore(e)));
  // }, []);
  const [newShopLoading, setNewShopLoading] = useState(false);

  useEffect(() => {
    setNewShopLoading(true);
    get_all_bookmark_store()
      .then((e) => {
        dispatch(getBookmarkStore(e.data.data));
        setNewShopLoading(false);
      })
      .catch((error) => {
        // Handle error here
        setNewShopLoading(false);
      });
  }, []);

  const { bookmarkStoreData } = useSelector((state) => state.getDataAllShop);
  // console.log("fafafaf", bookmarkStoreData);

  const handleBookmarkClick = (item) => {
    if (item.isBookmarked) {
      // If already bookmarked, remove the bookmark
      remove_bookmark_store(item.id).then(() => {
        // toast.error("Bookmark removed");
        setIsBookmarked(false);
      }).then(() =>dispatch(setUpdateBookmarkStoreNewest(item)));
    } else {
      // If not bookmarked, add the bookmark
      bookmark_store(item.id).then(() => {
        // toast.success("Bookmarked successfully");
        setIsBookmarked(true);
      }).then(() =>dispatch(setUpdateBookmarkStoreNewest(item)));
    }
  };
  return (
    <div>
      {newShopLoading ? (
        <Top10RecenceShop />
      ) : (
        <div className="relative ">
          <div className="flex ">
            <h2 className="-ml-5 sm:-ml-0 text-xl justify-start font-bold text-orange-500 lg:-mb-5 sm:mb-0 mt-2">
              Most Recent Shops
            </h2>
          </div>

          <div className="-ml-2 sm:-ml-0 flex flex-row lg:h-96 sm:h-64 h-36 justify-between -mt-5 sm:-mt-0">
            {dataNewShop.slice(0, 3).map((item) => (
              // const isNotNull = item.bannerImage !== null && item.bannerImage !== '';
              // border of the card
              <button
                onClick={() => onClickGetDataShop(item.id,item.name)}
                className="border-2 w-28 sm:w-[180px] sm:h-48 h-28 justify-between lg:w-[420px] lg:h-72 rounded-lg flex item-center  mt-10  "
              >
                <div className="w-full h-full flex justify-center ">
                <div
            class="overflow-hidden aspect-video cursor-pointer rounded-xl relative group"
        >

  <div
    class="rounded-xl z-40 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out 
    cursor-pointer absolute from-black/90 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex items-end"
  >
                <div>
                    <div
                        class="  p-1 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out"
                    >
                           <div className="text-left -mb-4 lg:w-36">
                    <span className="text-left  text-white lg:mt-5 lg:text-lg sm:text-[10px] text-[8px] font-bold line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                            <div className="text-left w-36">
                    <span className="text-left  lg:text-[16px] sm:text-[12px] text-[8px] font-semibold line-clamp-1">
                      {item.address}
                    </span>
                  </div>
                  <div className="text-left w-36">
                    <span className="text-left lg:-mt-3 lg:text-[13px] sm:text-[10px] text-[8px] font-medium line-clamp-1">
                      {item.primaryPhone}
                    </span>
                  </div>
                  

                    
                    </div>
                </div>
            </div>

   


           <div className="z-30">
           <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling up
                        handleBookmarkClick(item);
                      }}
                      className="w-8 h-8 rounded-full absolute top-0 right-0 mr-2 mt-2 bg-white hover:opacity-80 z-30"
                    >
                      {item.isBookmarked ? (
                        <svg
                          className="fill-orange-500 w-5 ml-1.5 mt-[1px]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                      ) : (
                        <>
                          <svg
                            className="fill-orange-500 w-6 h-6 ml-1 "
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                          >
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* <div className="p-1 absolute z-30 lg:mt-20 lg:w-36 lg:h-20">
  <div className="   lg:w-36 h-7 flex items-left line-clamp-1">                         
                          <p className="text-white font-bold lg:text-lg  ">
                            {item.name}
                          </p>
                        </div>
                   
            </div>    */}
           </div>


            <div className="overflow-hidden rounded-xl w-full">
                        <img
                          src={
                            item.bannerImage === "" || item.bannerImage === null
                              ? noImage
                              : item.bannerImage
                          }
                          className=" rounded-lg lg:w-[420px] lg:h-72 w-28  sm:w-[180px] sm:h-48 h-28  transition duration-300 ease-in-out hover:scale-110 "
                        />
                      </div>
                      {item.bannerImage === "" ||
                    item.bannerImage === null ||
                    item.bannerImage === "string" ? null : (
                      <div className="absolute bottom-2 left-0 z-30 invisible sm:visible">
                        ​{/*rate  */}
                        <div className="rounded-r-lg mt-4 bg-white  w-28 h-7 flex items-center border border-orange-500">
                          <p className="text-sm px-1">Rating:</p>
                          <p className="text-white text-sm text-cent">
                            <svg
                              className="w-4 ml-1 fill-orange-500 "
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 576 512"
                            >
                              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                          </p>
                          <p className="text-gray-500 font-normal text-sm ml-1 ">
                          {parseFloat(item.rating).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
        </div>
        
                </div>
                
              </button>
            ))}
            
          </div>

          {/* ... */}
        </div>
      )}
    </div>
  );
};

export default NewShopCarousel;




import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-grid-carousel';
import { decrement, increment, set, selectQuantityById } from '../../redux/slices/retailer/itemsQuantitySlice';
import noImage from '../../assets/images/no_image.jpg';
import { store } from '../../redux/store';
import { add_product_to_cart, bookmark_store, cancel_order_from_cart, delete_product_in_cart, get_all_bookmark_store, remove_bookmark_store } from '../../redux/services/retailer/retailerHomepage.service';
import { AddProductToCart, deleteProductInCart, getBookmarkStore, setUpdateBookmarkStore } from '../../redux/slices/retailer/homepageSlice/allShopSlice';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';

export default function AllProductSortByPrice() {
  const dispatch = useDispatch();
  const {productByPriceData} = useSelector((state) => state.getDataAllShop);
  // console.log("fawfafwa",productByPriceData)
  const counter = useSelector((state) => state.itemsCounter);
  const location = useLocation();

  // const {id} = useParams();


  const storeName = new URLSearchParams(location.search).get("storeName");

  const [disabledButtons, setDisabledButtons] = useState(new Set());
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(new Set()); // Initialize the loading state for products

  const [loadingProducts2, setLoadingProducts2] = useState(new Set()); // for decrement button
  const [counterLocalStorage, setCounterLocalStorage] = useState(JSON.parse(localStorage.getItem('counter')) || {});

  const id = new URLSearchParams(location.search).get("storeId");

// handleIncrement button
useEffect(() => {
  const storedCounter = JSON.parse(localStorage.getItem('counter'));

  if (storedCounter) {
    setCounterLocalStorage(storedCounter);
  }
},  [localStorage.getItem("counter")]);

// handleIncrement button

 // handleIncrement button
 const handleIncrement = async (productId) => {
  // Check if the storeId already exists in local storage
 // Check if the storeId already exists in local storage
 if (!localStorage.getItem("storeIdLocalStorage")) {
  // If it doesn't exist, set it in local storage
  localStorage.setItem("storeIdLocalStorage", id);
}

if (localStorage.getItem("storeNameLocalStorage") == null) {
 
  localStorage.setItem("storeNameLocalStorage", storeName);

}

  const product = productByPriceData.find((item) => item.id === productId);

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
    const response = await add_product_to_cart(id, productId, qty);
    const endTime = performance.now(); // Track end time of API call

     const apiTime = endTime - startTime;


     if (
      response.status === 401
    ) {
      toast.error("Opps, something went wrong please try again.");
      setLoadingProducts((prevLoadingProducts) => {
        const updatedLoadingProducts = new Set(prevLoadingProducts);
        updatedLoadingProducts.delete(productId);
        return updatedLoadingProducts;
      });
    }
      if (apiTime > 10000) {
        toast.error('Opps, connection unstable please try again.');
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
        "User have no profile. Please setup user profile to make order."
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

// handleDecrement button
const handleDecrement = async (productId) => {
     // Check if the storeId already exists in local storage
if (!localStorage.getItem('storeIdLocalStorage')) {
  // If it doesn't exist, set it in local storage
  localStorage.setItem('storeIdLocalStorage', id);
}
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
    const productNull = productInCartData.length === 1;
    //  console.log("wtf",productNull)
    if (productNull) {
      cancel_order_from_cart();
      // console.log('niceeeeeeeeeee')
    }
  }
  if (currentValue > 0) {
    const product = productByPriceData.find((item) => item.id === productId);
    const qty = currentValue - 1;

    if (product) {
      if (product.qty < qty) {
        toast.warn("This product is out of stock");
      } else {
        try {
          const startTime = performance.now(); // Track start time of API call
          const response = await add_product_to_cart(id, productId, qty);
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

const [isLoadingInputs, setIsLoadingInputs] = useState(new Set());
const { productInCartData } = useSelector((state) => state.getDataAllShop);
const timeoutRef = useRef();

const handleInputChange = async (productId, e) => {
  // Check if the storeId already exists in local storage
  if (!localStorage.getItem("storeIdLocalStorage")) {
    // If it doesn't exist, set it in local storage
    localStorage.setItem("storeIdLocalStorage", id);
  }

  if (localStorage.getItem("storeNameLocalStorage") == null) {
   
    localStorage.setItem("storeNameLocalStorage", storeName);
  
  }

  const value = parseInt(e.target.value);
  const product = productByPriceData.find((item) => item.id === productId);
  if (isNaN(value)) {
    // console.log("niceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    return null;
  }
  if (value === 0) {
    delete_product_in_cart(productId).then(
      dispatch(deleteProductInCart(productId))
    );
    const productNull = productInCartData.length === 1;
    //  console.log("wtf",productNull)
    if (productNull) {
      cancel_order_from_cart();
      // console.log('niceeeeeeeeeee')
    }
  }

  if (value > 0) {
    if (product) {
      if (product.qty < value) {
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
        }); // Start loading indicator for the current input

        const startTime = performance.now(); // Track start time of API call
        const response = await add_product_to_cart(id, productId, value);
        const endTime = performance.now(); // Track end time of API call

        if (response.status === 409) {
          toast.error("Opps, you can only have one cart at a time.");
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
        }); // Stop loading indicator for the current input
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

  // setIsButtonDisabled(false);
};




  return (
    <div>
      <ToastContainer/>
      <div className="w-full grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 lg:gap-11 gap-4">
        {/* <Carousel
          cols={3}
          rows={3}
          loop
          
          arrowLeft={() =>
            productByPriceData && productByPriceData.length > 9 ? (
              <img
                src={require("../../assets/images/retailer/back.png")}
                alt=""
                className="absolute z-5 top-80 -left-9 cursor-pointer"
              />
            ) : null
          }
          arrowRight={() =>
            productByPriceData && productByPriceData.length > 9 ? (
              <img
                src={require("../../assets/images/retailer/next.png")}
                alt=""
                className="absolute z-5 top-80 right-2 cursor-pointer"
              />
            ) : null
          }
        > */}
          {productByPriceData?.map((item) => (
            // <Carousel.Item>
            <div
            key={item.id}
            className={` w-5/6  h-72 rounded-lg flex shadow-md 
              ${
                item.isPublish === true
                  ? item.qty === 0
                    ? "border border-red-500 bg-slate-200 hover:cursor-not-allowed"
                    : ""
                  : "border border-red-500 bg-slate-200 hover:cursor-not-allowed"
              }   `}
          >                <div className="w-full flex flex-col justify-center items-center ">
                <div className="lg:w-1/2 sm:w-full flex justify-center items-center">
                  <img
                    src={item.image === null || item.image === undefined || item.image === '' ? noImage : item.image}
                    className="h-32 "
                  />
                </div>
                  <div className="w-full mt-1 text-center">
                    <p className="lg:text-xl text-sm font-semibold line-clamp-1">{item.name}</p>
                    <p className="text-orange-500 lg:font-semibold font-medium lg:text-lg text-sm mt-2">${item.price}/pack</p>
             {/* qty  */}
             <p className={`text-gray-500 lg:font-medium font-normal lg:text-base text-sm mt-1 ${item.qty === 0 ? ' text-red-500  ' : ''}`}>
  {item.qty === 0 ? 'Out of stock' : `${item.qty} left in stock`}
</p>
                    <div className="flex lg:mt-3 mt-2 justify-center">
                      <div className="flex items-center">

                     {/*button Decrement */}
                     <button
                      onClick={() => handleDecrement(item.id)}
                      // disabled={disabledButtons.has(item.id)}
                      type="button"
                      className={`h-6 w-6 rounded-sm border border-orange-500 hover:border-orange-600 flex justify-center items-center ${loadingProducts2.has(item.id) && 'bg-white hover:bg-white border border-white hover:border-white' }` }
                    >
                      {/* loading indicator */}
                      <div role="status">
                        {loadingProducts2.has(item.id) && (
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
                      {!loadingProducts2.has(item.id) && (
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
                          value={counterLocalStorage[item.id] || 0}
                          onChange={(e) =>
                            {if(item.qty>0 && item.isPublish!= false){
                              handleInputChange(item.id,e);
                            }}                          }
                          className="w-10 text-center block p-2 text-gray-900 border border-[#F6F7F8] rounded-lg bg-[#F6F7F8] sm:text-xs ml-1"
                        />
                        {isLoadingInputs.has(item.id) && (
                          <div
                            style={{
                              position: 'fixed',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              width: '100vw',
                              height: '100vh',
                              zIndex: 9999,
                            }}
                          >
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-current border-r-transparent align-[0.125em] text-orange-500" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}

                              {/* increment button */}
                              <button
                      onClick={() => handleIncrement(item.id)}
                      disabled={disabledButtons.has(item.id)}
                      type="button"
                      className={`h-6 w-6 rounded-sm border border-transparent bg-orange-500 hover:bg-orange-600 flex justify-center items-center ml-1 ${loadingProducts.has(item.id) && 'bg-white hover:bg-white' }` }
                    >
                      {/* loading indicator */}
                      <div role="status">
                        {loadingProducts.has(item.id) && (
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
                      {!loadingProducts.has(item.id) && (
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
                    </div>
                  </div>
                </div>
              </div>
            // </Carousel.Item>
          ))}
        {/* </Carousel> */}
      </div>
    </div>
  );
}



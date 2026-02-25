import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Switch from "react-switch";
const UpdateProductDistributor = () => {

  const [storeDataUpdate, setStoreDataUpdate] = useState([]);
  const [modalUpdateProduct, setModalUpdateProduct] = useState(false);
  const [checked, setChecked] = useState(false);
  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
  };
  const handleUpdateProduct = (data) => {
    setModalUpdateProduct(true);
    setStoreDataUpdate(data);
  };

  // get data update
  const { DataUpdateProduct } = useSelector((state) => state.DataUpdateProduct);

  return (
    <div>
      <div className="border-0  rounded-lg relative  flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}
        {/*body*/}
        <div className="relative flex-auto">
          <div className="">
            <h1 className="text-primaryColor text-3xl text-center font-medium py-5">
              Add New Product
            </h1>
          </div>
          <hr className="border border-gray-200" />
          <div className="justify-center items-center m-auto ">
            <form class="w-full m-auto mt-10 ">
              <div class="grid grid-cols-6 gap-5 border border-1 rounded-lg  p-10 ">
                {/* Field input */}
                <div class="col-span-4">
                  {/* Product */}
                  <div>
                    <label
                      class="block uppercase tracking-wide text-gray-700 text-sm  font-bold mb-2"
                      for="grid-password"
                    >
                      Product Name
                    </label>
                    <input
                      class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      name="productName"
                      type="text"
                      // value={DataUpdateProduct.product_name}
                      placeholder="Product Name"
                    />
                  </div>
                  {/* qty & price */}
                  <div class="flex flex-wrap -mx-3 ">
                    {/* qty */}
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        class="block uppercase tracking-wide text-gray-700 text-sm  font-bold mb-2"
                        for="grid-first-name"
                      >
                        Quantity
                      </label>
                      <input
                        class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        name="qty"
                        // value={DataUpdateProduct.qty}
                        placeholder="Quantity"
                      />
                    </div>
                    {/* Price */}
                    <div class="w-full md:w-1/2 px-3 relative">
                      <img
                        src={require("../../assets/images/distributor/dollar.png")}
                        className="absolute top-10 left-6 "
                        alt=""
                      />
                      <label
                        class="block uppercase tracking-wide text-gray-700 text-sm  font-bold mb-2"
                        for="grid-last-name"
                      >
                        Price
                      </label>
                      <input
                        class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 pl-10 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        name="price"
                        // value={DataUpdateProduct.unit_price}
                        placeholder="00.00"
                      />
                    </div>
                  </div>
                  {/* category */}
                  <div class="flex flex-wrap -mx-3">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        class="block uppercase tracking-wide text-gray-700 text-sm  font-bold mb-2"
                        for="grid-state"
                      >
                        Category
                      </label>
                      <div class="relative">
                        <select
                          class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-state"
                          name="category"
                        >
                          <option
                            selected
                            // value={DataUpdateProduct.category}
                          >
                            {/* {DataUpdateProduct.category} */}
                          </option>
                          <option value="Beverage">Beverage</option>
                          <option value="Water">Water</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-gray-700">
                          <img
                            src={require("../../assets/images/distributor/down_arrow.png")}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* button add new category */}
                    <div class="w-full md:w-1/2 px-3 mt-1 md:mb-0">
                      <button
                        type="button"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="inline-block rounded bg-primary mt-6 px-9 py-[8px]  font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                      >
                        Add new
                      </button>
                    </div>
                  </div>
                  {/* description */}
                  <div className="relative">
                    <label
                      class="block uppercase tracking-wide text-gray-700 text-sm  font-bold mb-2"
                      for="grid-password"
                    >
                      description
                    </label>
                    <textarea
                      value={DataUpdateProduct.description}
                      class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      name="description"
                      rows="10"
                      placeholder="Description..."
                    />
                  </div>
                </div>
                {/* image */}
                <div class=" col-span-2">
                  <div class="flex items-center justify-center w-full">
                    <img
                      src={require("../../assets/images/distributor/test_product.png")}
                      class="flex flex-col items-center justify-center w-full h-64  rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    />
                  </div>
                  <input
                    class="mt-10 block w-full text-sm text-[#777] border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                  />

                  {/* visibility */}
                  <div className="relative mt-[78px]">
                    <label
                      class="block text-3xl  tracking-wide text-primaryColor font-bold mb-2"
                      for="grid-password"
                    >
                      Visibility
                    </label>
                    <div class="hs-tooltip flex items-center">
                      <Switch
                        // onChange={(event) => handleFormChange(index, event)}
                        onChange={handleChange}
                        checked={checked}
                        className="react-switch"
                      />

                      <label
                        for="hs-tooltip-example"
                        class="text-sm text-gray-500 ml-3 dark:text-gray-400"
                      >
                        {/* Allow push notifications {checked ? "on" : "off"} */}
                      </label>
                    </div>{" "}
                  </div>
                </div>
              </div>
              {/* button save and cancel */}
              <div className="mt-3 w-full flex justify-end gap-3 mb-3">
                <button
                  type="submit"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  class="col-span-2 flex text-lg items-center gap-3 rounded-lg bg-primary px-3 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                  <img
                    src={require("../../assets/images/distributor/save.png")}
                    alt=""
                  />{" "}
                  Save
                </button>
                <Link
                  to="/distributor/product"
                  type="button"
                  class="col-span-2 flex text-lg items-center gap-3 rounded-lg bg-[#FF7272] px-3 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                  <img
                    src={require("../../assets/images/distributor/close_white.png")}
                    alt=""
                  />{" "}
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductDistributor;

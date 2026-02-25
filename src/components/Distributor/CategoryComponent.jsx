import { Button, Modal } from "flowbite-react";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  add_new_category,
  delete_category,
  get_all_category,
  update_category,
} from "../../redux/services/distributor/category.service";
import { PropagateLoader } from "react-spinners";
import {
  addNewCategoryDistributor,
  deleteCategoryDistributor,
  getAllCategoryDistributor,
  setLoadingCategory,
  updateCategoryDistributor,
} from "../../redux/slices/distributor/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// const SignupSchema = Yup.object().shape({
//   // CategoryName:Yup.string().required("Category cannot be blank"),
//   name: Yup.string().required("category cannot be blank")
// });
const schema = yup.object().shape({
  name: yup.string().required("category cannot be blank"),
});
export const CategoryComponent = (prop) => {
  // console.log("Get prop from category popup : ", prop);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showAddNewCategory, setShowAddCategory] = useState(false);
  const [showUpdateCategory, SetShowUpdateCategory] = useState(false);
  const [getDataUpdate, setGetDataUpdate] = useState({});
  const [onChangeDataUpdate, setOnChangeDataUpdate] = useState("");
  const [totalPagesCategory, setTotalPagesCategory] = useState();
  const categoryData = useSelector(
    (state) => state.categoryDistributor.categories
  );
  // console.log(categoryData);
  
  // on conditions change
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // ================================== handle pagination =============================
  const [searchProduct, setSearchProduct] = useState("");
  console.log(searchProduct)
  const [dataPagination, setDataPagination] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 5;
  const filteredProduct = categoryData.filter((data) =>
    data.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // console.log(filteredProduct);

  const pageCount = Math.ceil(categoryData.length / 5);

  // Calculate the correct itemOffset based on the current page and filtered results
  const newOffset = (dataPagination - 1) * 5;
  const currentCategories = filteredProduct.slice(newOffset, endOffset);

  // Update handlePagination function to change dataPagination state
  const handlePagination = (event) => {
    const newPage = event.selected + 1;
    const newOffset = (newPage - 1) * 5;
    setItemOffset(newOffset);
    setDataPagination(newPage);
  };
  // const handlePagination = (event) => {
  //   const newOffset = (event.selected * 5) % categoryData.length;
  //   setItemOffset(newOffset);
  // };
  // const [itemOffset, setItemOffset] = useState(0);

  // const endOffset = itemOffset + 5;

  // const currentCategories = categoryData.slice(itemOffset, endOffset);
  // console.log(itemOffset + 5)
  // const pageCount = Math.ceil(categoryData.length / 5);
  // console.log(categoryData.slice(itemOffset, endOffset))
 
  // ======================================= End of Pagination section =================================

  // get category data
  const [item, setItem] = useState([]);
  // console.log("item ", item);
  const [errorGetCategory, setErrorGetCategory] = useState(false);
  const [noData, setNoData] = useState(false);
  const [test,setTEast] =useState(false)
  // console.log("first" , test)
  // ====================== get all categories =================
  useEffect(() => {
    get_all_category(dispatch)
      .then((r) => {
      
        if (r.status == 400){
            // console.log("seconrd" , noData)
            dispatch(setLoadingCategory(false))
            setErrorGetCategory(true)
        } 
        console.log(r.status)
        if(r.status == 404) {
          // console.log("Hello .......")
            // setErrorGetCategory(r.data.detail);
          dispatch(setLoadingCategory(false));
          setErrorGetCategory(true)
          setNoData(true);
            console.log(noData)

        }
        if (r.status == 200) {
          // setNoData(false);
          setErrorGetCategory(false)
          console.log(errorGetCategory)
          dispatch(getAllCategoryDistributor(r.data.data));
          setItem(r.data.data);
          setTotalPagesCategory(r.data.totalPage);
          dispatch(setLoadingCategory(false))
          setNoData(false)
          
        } 
      })
      .catch((error) => {
        // console.log("Error occurred:", error);
        // Handle the error as needed
        dispatch(setLoadingCategory(false));
        setNoData(true);
      })
      .finally(() => {
        // console.log("finally finished");
        dispatch(setLoadingCategory(false));
      });
    
  }, getAllCategoryDistributor());

  const loading = useSelector((state) => state.categoryDistributor.loading);
  //   console.log("categoryData : ",categoryData)
  // onclick get data update
  // =============================== update ===============================

  const handleGetDataUpdate = (data) => {
    console.log(data);
    SetShowUpdateCategory(true);
    setGetDataUpdate(data);
    console.log("id: " + data.id);
  };
  const handleChangeDataUpdate = (e) => {
    setOnChangeDataUpdate(e.target.value);
  };
  const [mokData,setMokData] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false);
  const onUpdateCategory = (data) => {
    console.log(data);
    setUpdateLoading(true);
    const id = getDataUpdate.id;
    console.log("id: " + id);
    const fullData = { ...mokData, name: onChangeDataUpdate, id: id };
    if (onChangeDataUpdate !== "") {
      update_category(onChangeDataUpdate, id)
        .then((res) => {
          if (res.status === 409) {
            toast.error("Category name already taken");
          } else if (res.status === 200) {
            console.log(res.data.data);
            dispatch(updateCategoryDistributor(fullData));
          }
        })
        .catch((error) => {
          // Handle any error during the update operation
          console.error(error);
        })
        .finally(() => {
          SetShowUpdateCategory(false);
          setUpdateLoading(false);
        });
    } else {
      SetShowUpdateCategory(false);
      setUpdateLoading(false);
    }
  };
  

  // =========================== add category ===========================

  // const [onChangeData,setOnChangeData] = useState('')
  // const onChangeName = (e)=>{
  //   console.log(e.target.value);
  //   setOnChangeData(e.target.value);
  // }
  // 
  const [loadingInsert, setLoadingInsert] = useState(false);
  const onAddCategory = async (data) => {
    console.log("category : ", data);
    setLoadingInsert(true);
    add_new_category(data)
      .then((res) =>
        res.data.status == 201
          ? (dispatch(addNewCategoryDistributor(res.data.data)),
            reset(),
            setShowAddCategory(false))
          : (toast.error("Category name already token", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              size: 100,
            }),
            setLoadingInsert(false))
      )
      .then(() => setLoadingInsert(false));
    // console.log(data);
  };

  // ========================= delete category data=========================
  const [idCategory, setIdCategory] = useState();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const onDeleteCategory = (id) => {
    setShowDeleteCategory(true);
    setIdCategory(id);
  };


  const onSubmitDeleteCategory = () => {
    setLoadingDelete(true);
    console.log(idCategory);
    delete_category(idCategory)
      .then((res) => dispatch(deleteCategoryDistributor(idCategory)))
      .then(() => setShowDeleteCategory(false))
      .then(() => setLoadingDelete(false))
      .catch((err) => {
        toast.error("Can not deleting category");
        setLoadingDelete(false);
      });
  };

  return (
    <div>
      <React.Fragment>
        <Modal show={prop.isOpenCategory} className="flex" aria-hidden={false}>
          <ToastContainer />
          <Modal.Body>
            {/* <button onClick={()=>setShowCategory(false)}>Hello</button> */}
            {/*header*/}

            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-4 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-2xl text-center">
                Category
              </h1>
              <button
                className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={prop.handleShowCategory}
              >
                <img
                  src={require("../../assets/images/closeWhite.png")}
                  alt=""
                  className="w-[20px]"
                />
              </button>
            </div>
            <div className="border-0  rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*content*/}
              <div className="border-0  rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*body*/}

                <div className="flex justify-between w-[95%] m-auto my-5">
                  {/* search */}

                  <div class="flex">
                    <div class="relative w-full ">
                      <input
                        type="text"
                        name="search"
                        // defaultValue={search}
                        disabled={noData}
                        // onChange={(e) => setSearchProduct(e.target.value)}
                        onBlur={(e) => setSearchProduct(e.target.value)}
                        class={`${noData ? "cursor-no-drop" : null} rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg block p-2.5 xl:w-80 z-20 text-sm text-gray-900  rounded-r-lg border-l-2 border border-gray-400 focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500`}
                        placeholder="Search"
                      />
                      <button
                        type="submit"
                        class="rounded-tr-lg rounded-br-lg absolute top-0 right-0 p-2.5 text-sm font-medium text-gray-600 bg-primaryColor rounded-r-lg border border-primaryColor focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <svg
                          aria-hidden="true"
                          class="rounded-tr-full rounded-br-full w-5 h-5"
                          fill="none"
                          stroke="white"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                        <span class="sr-only">Search</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddCategory(true)}
                    type="button"
                    disabled={noData}
                    class={`${noData ? "cursor-no-drop" : null} col-span-2 flex rounded-xl items-center justify-center gap-2  bg-primary px-3 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-cyan-200 focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                  >
                    Add Category
                  </button>
                </div>
                <hr className="border border-gray-200" />
                <div className="relative flex-auto w-full">
                  <table class="w-full text-sm border-none text-gray-500 dark:text-gray-400 border border-separate border-spacing-y-3">
                    <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="p-3">
                          N<sup>o</sup>
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Category
                        </th>

                        <th scope="col" class="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {/* 
                          .filter((data) =>
                            data.name.toLowerCase().includes(search)
                          )
                           */}
                      {loading ? (
                        <tr>
                          <td colSpan={3}>
                            <div className="w-full h-36 flex justify-center items-center text-sm text-center border-none text-gray-500 dark:text-gray-400 border border-separate border-spacing-y-3">
                              <PropagateLoader color="#0f766e" />
                            </div>
                          </td>
                        </tr>
                      ) : currentCategories.length === 0 ? (
                        noData ? (
                          <tr
                            class={` border border-primary text-gray-400  dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                          >
                            <td class="text-xl p-9" colSpan={3}>
                            You have no create the store yet. Please create your store first
                            </td>
                          </tr>
                        ) : (
                          <tr
                            class={` border border-primary text-gray-400 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                          >
                            <td class="text-xl p-9" colSpan={3}>
                              No Data found
                            </td>
                          </tr>
                        )
                      ) : (
                        currentCategories.map((item, index) => (
                            <tr
                              key={item.id}
                              class={`shadow-sm border border-primary  dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                            >
                              <td class="w-4 py-3">{index + 1 + itemOffset}</td>

                              <td class={`capitalize `}>{item.name}</td>

                              <td class="flex gap-2 justify-center mt-1">
                                <button
                                  onClick={() => handleGetDataUpdate(item)}
                                  type="button"
                                  class="col-span-2 flex items-center justify-center gap-1 rounded-lg bg-primary w-20 py-1 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                >
                                  <img
                                    src={require("../../assets/images/distributor/edit_white.png")}
                                    alt=""
                                  />
                                  Edit
                                </button>
                                <button
                                  onClick={() => onDeleteCategory(item.id)}
                                  type="button"
                                  class="col-span-2 flex items-center gap-1 rounded-lg bg-red-400 px-2 py-1 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                >
                                  <img
                                    src={require("../../assets/images/distributor/delete_white.png")}
                                    alt=""
                                    className="w-[16px]"
                                  />
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* pagination */}
            {loading ? null : (
              errorGetCategory ? null :
              <ReactPaginate
                previousLabel={
                  <span class="flex flex-row px-3 hover:bg-blue-100 hover:text-primary hover:rounded-lg py-2 ml-0 leading-tight text-newGray bg-white   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg
                      class="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span>Pre</span>
                  </span>
                }
                nextLabel={
                  <span class="flex flex-row hover:bg-blue-100 hover:text-primary hover:rounded-lg px-3 py-2 leading-tight text-gray-500 bg-white  ">
                    <span>Next</span>
                    <svg
                      class="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                }
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePagination}
                containerClassName={
                  "flex items-center justify-end pt-4 text-sm"
                }
                pageClassName={
                  "z-10 px-3 py-2 leading-tight hover:bg-blue-100 hover:text-primary hover:rounded-lg"
                }
                breakClassName={
                  "z-10 px-3 py-2 leading-tight hover:bg-blue-100 hover:text-primary hover:rounded-lg"
                }
                activeClassName={"text-primary bg-blue-100 rounded-lg"}
              /> 
            )}
            {/* <ReactPaginate
              previousLabel={
                <span class="flex flex-row px-3 hover:bg-blue-100 hover:text-primary hover:rounded-lg py-2 ml-0 leading-tight text-newGray bg-white   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg
                    class="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Pre</span>
                </span>
              }
              nextLabel={
                <span class="flex flex-row hover:bg-blue-100 hover:text-primary hover:rounded-lg px-3 py-2 leading-tight text-gray-500 bg-white  ">
                  <span>Next</span>
                  <svg
                    class="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              }
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePagination}
              containerClassName={"flex items-center justify-end pt-4 text-sm"}
              pageClassName={
                "z-10 px-3 py-2 leading-tight hover:bg-blue-100 hover:text-primary hover:rounded-lg"
              }
              breakClassName={
                "z-10 px-3 py-2 leading-tight hover:bg-blue-100 hover:text-primary hover:rounded-lg"
              }
              activeClassName={"text-primary bg-blue-100 rounded-lg"}
            /> */}
          </Modal.Body>
        </Modal>

        {/* Add category */}
        <Modal
          show={showAddNewCategory}
          size="lg"
          onClose={!showAddNewCategory}
        >
          <Modal.Body>
            {/* <button onClick={()=>setShowCategory(false)}>Hello</button> */}
            {/*header*/}
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-3 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-xl text-center">
                Add New Category
              </h1>
              <button
                className="absolute right-2 top-1 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowAddCategory(false)}
              >
                <img
                  src={require("../../assets/images/closeWhite.png")}
                  className="w-[16px]"
                  alt=""
                />
              </button>
            </div>
            <div>
              <div>
                <div className="mt-10 mb-8">
                  <form onSubmit={handleSubmit(onAddCategory)}>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="category"
                        className="ml-[68px] text-lg font-medium text-[#777777]"
                      >
                        Category Name
                      </label>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {/* email */}
                        <div className="relative">
                          <input
                            // onChange={(e) => setCat(e.target.value)}
                            name="name"
                            placeholder="Category"
                            {...register("name")}
                            class={`relative border border-primaryColor text-gray-900 text-sm rounded-lg 
                              
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none`}
                          />
                          <p className="text-xs text-red-600 absolute ml-2 mt-1 ">
                            {errors.name?.message}
                          </p>
                          {/* {errors.name && touched.name ? (
                                  <div className="text-red-400 text-xs  absolute ">
                                    {errors.name}
                                  </div>
                                ) : null} */}
                        </div>
                        {loadingInsert ? (
                          <button
                            type="submit"
                            // onClick={() => onAddCategory(cat)}
                            class="col-span-2 flex  items-center gap-1 rounded-lg bg-primary  px-4 py-[9px] font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          >
                            <span
                              class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                              role="status"
                              aria-label="loading"
                            >
                              <span class="sr-only">Saving...</span>
                            </span>
                            Saving...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            // onClick={() => onAddCategory(cat)}
                            class="col-span-2 flex  items-center gap-1 rounded-lg bg-primary  px-4 py-[9px] font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          >
                            <img
                              src={require("../../assets/images/distributor/save.png")}
                              alt=""
                              className="w-[16px]"
                            />{" "}
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* </Form>
                    )}
                  </Formik> */}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* update category */}
        <Modal show={showUpdateCategory} size="lg">
          <Modal.Body>
            {/* <button onClick={()=>setShowCategory(false)}>Hello</button> */}
            {/*header*/}
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-5 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-2xl text-center">
                Edit Category
              </h1>
              <button
                className="absolute right-2 top-1 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => SetShowUpdateCategory(false)}
              >
                <img
                  src={require("../../assets/images/closeWhite.png")}
                  alt=""
                />
              </button>
            </div>
            <div>
              <div>
                <div className="mt-10 mb-8">
                  {/* <Formik
                    initialValues={{ name: "" }}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                      // same shape as initial values
                      // console.log("forgot : ", values);
                      onUpdateCategory(values);
                    }}
                  > */}
                  {/* {({ errors, touched }) => (
                      <Form> */}
                  {/* <!--Logo--> */}

                  {/* Field field */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="category"
                      className="ml-[68px] text-lg font-medium text-[#777777]"
                    >
                      Category Name
                    </label>
                    <div className="flex flex-wrap gap-5 justify-center">
                      {/* email */}
                      <div className="relative">
                        <input
                          name="name"
                          // value={getDataUpdate.name}
                          onBlur={handleChangeDataUpdate}
                          placeholder={getDataUpdate.name}
                          class={`border border-primaryColor text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none`}
                        />
                      </div>
                      {updateLoading ? (
                        <button
                          onClick={onUpdateCategory}
                          type="button"
                          class="col-span-2 flex  items-center gap-1 rounded-lg bg-primary  px-2 py-[9px] font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        >
                         <span
                            class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                            role="status"
                            aria-label="loading"
                          >
                            <span class="sr-only">Saving...</span>
                          </span>
                          Saving...
                        </button>
                      ) : (
                        <button
                          onClick={onUpdateCategory}
                          type="button"
                          class="col-span-2 flex  items-center gap-1 rounded-lg bg-primary  px-4 py-[9px] font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        >
                          <img
                            src={require("../../assets/images/distributor/save.png")}
                            alt=""
                            className="w-[16px]"
                          />{" "}
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                  {/* </Form>
                    )}
                  </Formik> */}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* delete */}
        <Modal
          show={showDeleteCategory}
          onClose={() => setShowDeleteCategory(false)}
          size="md"
          popup={true}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              {/* <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" /> */}
              <img
                src={require("../../assets/images/distributor/warning.png")}
                className="ml-[160px] -mt-3 mb-4 w-[70px]"
              />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this category? If you delete
                this category,{" "}
                <span className="text-red-500">
                  the products that use this category will be changed to the new category UnKnow
                </span>
              </h3>
              <div className="flex justify-center gap-4">
                <Button onClick={onSubmitDeleteCategory} color="failure">
                {loadingDelete ? <> <span
                            class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                            role="status"
                            aria-label="loading"
                          >
                            <span class="sr-only">Deleting...</span>
                          </span>&nbsp;
                          Deleting...</> : "Yes, I'm sure"}
                 
                </Button>
                <Button
                  onClick={() => setShowDeleteCategory(false)}
                  color="gray"
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </div>
  );
};


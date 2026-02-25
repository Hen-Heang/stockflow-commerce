import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdateProductDistributor from "./UpdateProductDistributor";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import productSlice, {
  deleteProductDistributor,
  getAllProduct,
  getDataToUpdateProduct,
  setLoading,
  setUnpublished,
  updateProductDistributor,
} from "../../redux/slices/distributor/productSlice";
import {
  getDataProduct,
  getTrueOpenFormProduct,
} from "../../redux/slices/distributor/getDataUpdateSlice";
import { Button, Modal, Pagination, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  delete_product_distributor,
  get_all_product_distributor,
  publish_product_distributor,
  unPublish_product_distributor,
  update_product_distributor,
} from "../../redux/services/distributor/product.server";
import noImage from "../../assets/images/no_image.jpg";
import { toast, ToastContainer } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import ReactPaginate from "react-paginate";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storageFirebase } from "../../firebaseUploadImage";
import { v4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";
import { get_all_category } from "../../redux/services/distributor/category.service";
import {
  getAllCategoryDistributor,
  setLoadingCategory,
} from "../../redux/slices/distributor/categorySlice";
const validationSchema = Yup.object().shape({
  category: Yup.string().required("category cannot be blank"),
});

const ProductDistributor = () => {
  useEffect(() => {
    document.title = "StockFlow Commerce | Product";
  }, []);
  const [modalUpdateProduct, setModalUpdateProduct] = useState(false);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleClick = () => {
    console.log(1);
    setShowAction(true);
  };

  // update product
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const getDataUpdateProduct = useSelector((state) => {clg})
  const handlePushValueToUpdate = (data) => {
    // console.log(data);
    dispatch(getDataProduct(data));
    navigate("/distributor/update-product");
  };

  // delete product

  const [deleteProduct, setDeleteProduct] = useState();
  const [deleteImage, setDeleteImage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  // console.log(loadingDelete);
  const handleDeleteProduct = (id, image) => {
    console.log(id);
    setDeleteProduct(id);
    setDeleteImage(image);
    setShowDelete(true);
    // console.log(image);
  };
  const onDeleteProduct = () => {
    setLoadingDelete(true);

    // console.log(deleteProduct)
    if (deleteImage == null || deleteImage == "") {
      console.log("if 1");
      delete_product_distributor(deleteProduct)
        .then((res) => {
          if (res.status === 409) {
            toast.error("Product is required and cannot be deleted");
            setLoadingDelete(false);
          }
          if (res.data.status === 200) {
            console.log("409 else");
            console.log(res.response);
            dispatch(deleteProductDistributor(deleteProduct));
            setShowDelete(false);
            setLoadingDelete(false);
            toast.success("Product has been deleted!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch((error) => {
          console.error("Error deleting product", error);
          setShowDelete(false);
        });
    } else {
      console.log("if 2");
      delete_product_distributor(deleteProduct)
        .then((res) => {
          if (res.status == 409) {
            toast.error("Product is required and cannot be deleted");
          }
          if (res.data.status === 200) {
            console.log("if 3");
            const deleteRef = ref(storageFirebase, `${deleteImage}`);
            deleteObject(deleteRef)
              .then(() => {
                dispatch(deleteProductDistributor(deleteProduct));
                console.log("Sokea");
                toast.success("Product has been deleted!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              })
              .catch((error) => {
                console.error("Error deleting image", error);
              })
              .finally(() => {
                setShowDelete(false);
                setLoadingDelete(false);
              });
          }
          console.log(res.response);
          if (res.response.status === 409 || res.response.status === 401) {
            toast.error("Product is required and cannot be deleted");
            setLoadingDelete(false);
          }
        })
        .catch((error) => {
          console.error("Error deleting product", error);
          setShowDelete(false);
          setLoadingDelete(false);
        });
    }

    console.log(loadingDelete);
  };

  //======================= get data product =========================
  const getAllProductItem = useSelector((state) => state.product.product);
  const [storeErrorNotFound, setStoreErrorNotFound] = useState("");
  const [noDataProduct, setNoDataProduct] = useState(false);

  // console.log("Get all products : ", getAllProductItem)

  console.log("first rrr", noDataProduct);
  const [noShop, setNoShop] = useState(false);
  useEffect(() => {
    get_all_product_distributor(dispatch)
      .then((res) => {
        console.log("Response : ", res.data.status);
        if (res.status === 200) {
          setNoShop(false);
          setNoDataProduct(false);

          dispatch(getAllProduct(res.data.data));
        }
        if (res.status == 400) {
          setNoDataProduct(true);
          setNoShop(false);
        }
        if (res.status === 404) {
          setNoShop(true);
          setStoreErrorNotFound(
            "You have not created the store yet. Please set up your store first."
          );
          setNoDataProduct(false);
        }
        // else {
        //   setStoreErrorNotFound(
        //     "You have not created the store yet. Please create your store first."
        //   );

        //   setNoDataProduct(true);
        // }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
        // Handle the error as needed
        dispatch(setLoading(false));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const loading = useSelector((state) => state.product.loading); // Access the loading state
  // ============================== handle search ==============================
  const [searchProduct, setSearchProduct] = useState("");
  const [dataPagination, setDataPagination] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + 8;
  const filteredProduct = getAllProductItem.filter((data) =>
    data?.name?.toLowerCase().includes(searchProduct?.toLowerCase())
  );
  // it blank page because it can not read toLowerCase and includes

  console.log(filteredProduct);

  const pageCount = Math.ceil(getAllProductItem.length / 8);

  // Calculate the correct itemOffset based on the current page and filtered results
  const newOffset = (dataPagination - 1) * 8;
  const currentProduct = filteredProduct.slice(newOffset, endOffset);

  // Update handlePagination function to change dataPagination state
  const handlePagination = (event) => {
    const newPage = event.selected + 1;
    const newOffset = (newPage - 1) * 8;
    setItemOffset(newOffset);
    setDataPagination(newPage);
  };

  // console.log("Get all products", getAllProductItem);

  // visibility
  const [visible, setVisible] = useState(false);
  const handleToggle = () => {
    // console.log(visible);
    setVisible((current) => !current);
    setStoreDataUpdate((prevData) => ({
      ...prevData,
      isPublish: !visible,
    }));
    // console.log("show is publish : ",storeDataUpdate.isPublish);
  };
  // get data update
  const [storeDataUpdate, setStoreDataUpdate] = useState({
    name: "",
    price: "",
    categoryId: "",
    image: "",
    description: "",
    isPublish: false,
  });
  const [idUpdateProduct, setIdUpdateProduct] = useState();
  // console.log("data update :" ,storeDataUpdate);
  const onGetDataProduct = (data) => {
    console.log(data);
    const { name, price, category, image, description, isPublish } = data;
    setStoreDataUpdate((prevData) => ({
      ...prevData,
      name: name,
      price: price,
      categoryId: category.id,
      image: image,
      description: description,
      isPublish: isPublish,
    }));
    console.log("data : ", storeDataUpdate);
    setIdUpdateProduct(data.id);
    setImageUrl(data.image);
    setVisible(data.isPublish);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setStoreDataUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleChangeProduct=(e)=>{
  //   console.log(e.target.value);
  //   setStoreDataUpdate((prevData) => ({
  //     ...prevData,
  //     name: e.target.value,
  //   }));
  // }

  // console.log("handle change data object :" ,storeDataUpdate);

  // ========================= onsubmit update ======================
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const onSubmitUpdate = async (data) => {
    if (targetImage == null) {
      setLoadingUpdate(true);
      // Handle the case where no image is selected
      update_product_distributor(storeDataUpdate, idUpdateProduct)
        .then((res) => {
          dispatch(updateProductDistributor(res.data.data));
          const modalId = `#hs-large-modal${idUpdateProduct}`;
          const modal = document.querySelector(modalId);
          if (modal) {
            modal.classList.add("hidden");
            document.body.classList.remove("blur"); // Remove the blur effect class
          }
        })
        .then(() => setLoadingUpdate(false))
        .catch((err) => {
          setLoadingUpdate(false);
          console.log("error while editing: ", err);
        });
    }

    const updatedData = cloneDeep(storeDataUpdate);
    console.log("clone data : ", updatedData);
    if (targetImage) {
      setLoadingUpdate(true);
      const imageRef = ref(storageFirebase, `image/${targetImage.name + v4()}`);
      try {
        await uploadBytes(imageRef, targetImage);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("downloadURL: ", downloadURL);
        updatedData.image = downloadURL;
      } catch (error) {
        console.log(error);
        setLoadingUpdate(false);
      }
    }
    // Submit the form data with the updatedData object

    update_product_distributor(updatedData, idUpdateProduct)
      .then((res) => {
        console.log(res.response.status == 401);
        if (res.response.status == 401 || res.response.status == 404) {
          toast.error("Something went wrong..!");
          setLoadingUpdate(false);
        } else {
          dispatch(
            updateProductDistributor({
              ...updatedData,
              id: idUpdateProduct,
            })
          );
          const modalId = `#hs-large-modal${idUpdateProduct}`;
          const modal = document.querySelector(modalId);
          if (modal) {
            modal.classList.add("hidden");
            document.body.classList.remove("blur"); // Remove the blur effect class
          }
        }
      })
      .then(() => setLoadingUpdate(false))
      .catch((err) => {
        setLoadingUpdate(false);
        console.log(err);
      });
  };

  // get category
  const categoryData = useSelector(
    (state) => state.categoryDistributor.categories
  );
  useEffect(() => {
    get_all_category(dispatch)
      .then((r) => {
        if (r.status == 400) {
          // toast.error("This store have no category");
        }
        if (r.status == 404) {
          // toast.error("Please create a new category");
        }
        if (r.status == 200) {
          dispatch(getAllCategoryDistributor(r.data.data));
        }
      })
      .catch((error) => {
        dispatch(setLoadingCategory(false));
      })
      .finally(() => {
        // console.log("finally finished");
        dispatch(setLoadingCategory(false));
      });
  }, getAllCategoryDistributor());

  // image
  const [imageUrl, setImageUrl] = useState("");
  const [targetImage, setTargetImage] = useState(null);
  const handleChangeImage = (e, index) => {
    const uploadImage = e.target.files[0];
    setTargetImage(uploadImage);
    //  console.log(URL.createObjectURL(e.target.files[0]));
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    //  formData.forEach((value, key) => {
    //   setStoreDataUpdate((prevData) => ({
    //     ...prevData,
    //     [key]: value,
    //   }));
    // });
  };

  // on action publish and unPublish
  const [idPublishProduct, setIdPublishProduct] = useState();
  const [showModalPublishProduct, setShowModalPublishProduct] = useState(false);
  const [allData, setAllData] = useState();
  const [loadingUnPublish, setLoadingUnPublish] = useState(false);
  const onChangeIdPublishProduct = (id, data) => {
    setIdPublishProduct(id);
    setAllData(data);
    // console.log(allData);
    setShowModalPublishProduct(true);
  };
  // console.log("ID : ", idPublishProduct);
  const handleSubmitPublishProduct = () => {
    setLoadingUnPublish(true);
    if (allData.isPublish) {
      console.log("true");
      unPublish_product_distributor(idPublishProduct)
        .then(() => {
          dispatch(setUnpublished(allData));
        })
        .then(() => {
          setShowModalPublishProduct(false);
          setLoadingUnPublish(false);
        });
    } else {
      console.log("false");
      publish_product_distributor(idPublishProduct)
        .then(() => {
          dispatch(setUnpublished(allData));
        })
        .then(() => {
          setShowModalPublishProduct(false);
          setLoadingUnPublish(false);
        });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // Delay of 500 milliseconds

    return () => clearTimeout(timer);
  }, []);
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div
      className={`dark:text-white transition ${
        isOpen
          ? " transition-all ease-in-out delay-300 duration-700 "
          : "opacity-0 scale-95 translate-y-1/2 "
      }`}
    >
      {/* Same as */}
      {/* <ToastContainer toastStyle={{ width: "300px" }} /> */}
      <div className={`bg-white min-h-screen rounded-lg w-full shadow-md `}>
        <div className="w-[95%] min-h-screen m-auto">
          {/* Header */}
          <div className="grid grid-cols-2 mb-10 ">
            <div className="grid-cols-1 mt-10">
              <h1 className="text-3xl font-bold text-primaryColor">
                Product List
              </h1>
            </div>
            <div className="grid-cols-1 mt-10">
              <div className="grid grid-cols-7 w-full gap-4">
                <div class="h-full col-span-5">
                  <div class="flex">
                    <div class="relative w-full ">
                      <input
                        type="search"
                        id="search-dropdown"
                        onChange={(e) => setSearchProduct(e.target.value)}
                        className={`${
                          noShop ? "cursor-no-drop" : null
                        } rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg block p-2.5 w-full z-20 text-sm text-gray-900  rounded-r-lg border-l-2 border border-gray-400 focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500`}
                        placeholder="Search....."
                        required
                      />
                      {/* <button
                          type="submit"
                          class="rounded-tr-lg rounded-br-lg absolute top-0 right-0 p-2.5 text-sm font-medium text-gray-600 bg-white rounded-r-lg border border-gray-400  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <svg
                            aria-hidden="true"
                            class="rounded-tr-full rounded-br-full w-5 h-5"
                            fill="none"
                            stroke="#0f766e"
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
                        </button> */}
                    </div>
                  </div>
                </div>
                {noShop ? (
                  <button
                    type="button"
                    disabled
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    class="col-span-2 cursor-no-drop flex items-center justify-center gap-2 rounded bg-primary px-3 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    <img
                      src={require("../../assets/images/distributor/add.png")}
                      alt=""
                    />{" "}
                    Add Product
                  </button>
                ) : (
                  <Link
                    to="/distributor/add-product"
                    type="button"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    class="col-span-2 flex items-center justify-center gap-2 rounded bg-primary px-3 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    <img
                      src={require("../../assets/images/distributor/add.png")}
                      alt=""
                    />{" "}
                    Add Product
                  </Link>
                )}

                {/* <button
                  type="button"
                  class="col-span-2 text-white bg-primaryColor hover:bg-cyan-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                
                </button> */}
              </div>
            </div>
          </div>
          {/* Table */}
          <div class="relative sm:rounded-lg">
            <table class="w-full text-sm text-center border-none text-gray-500 dark:text-gray-400 border border-separate border-spacing-y-3">
              <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" class="p-3">
                    N<sup>o</sup>
                  </th>
                  <th scope="col" class="w-96  ">
                    Product
                  </th>
                  <th scope="col" class="w-32">
                    Qty
                  </th>
                  <th scope="col" class="w-32">
                    Unit Price
                  </th>
                  <th scope="col" class="w-96">
                    Action
                  </th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <div className={`w-full flex justify-center mt-32`}>
                        <PropagateLoader color="#0f766e" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentProduct.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div
                          className={`w-full text-gray-400 flex justify-center mt-32 font-medium text-3xl`}
                        >
                          {noDataProduct
                            ? "No product available"
                            : storeErrorNotFound}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentProduct.map((item, index) => (
                      <tr
                        key={item.id}
                        class={`shadow-sm border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                      >
                        <td class="w-4 p-4">{index + 1 + newOffset}</td>
                        <th
                          scope="row"
                          class="flex items-center ml-44 mt-3 text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <img
                            src={
                              item.image == null || item.image == ""
                                ? noImage
                                : item.image
                            }
                            class="w-10 h-10 rounded-full"
                            alt=""
                          />
                          <div class="pl-3 text-start">
                            <div class="text-[18px]">{item.name}</div>
                            <div class="font-normal text-gray-500">
                              {item.category.name}
                            </div>
                          </div>
                        </th>
                        <td class={`  ${item.qty == 0 ? "text-red-600" : ""}`}>
                          {item.qty}
                        </td>
                        <td class="">
                          <div class="flex items-center ml-20">
                            $<span>{item.price}</span>
                          </div>
                        </td>
                        <td class="p-3">
                          <Button.Group>
                            {/* Edit */}
                            <Button
                              color="gray"
                              // onClick={() => setVisible(item.isPublish)}
                            >
                              <Tooltip content="Edit">
                                <button
                                  type="button"
                                  onClick={() => onGetDataProduct(item)}
                                  data-hs-overlay={`#hs-large-modal${item.id}`}
                                >
                                  <img
                                    src={require("../../assets/images/distributor/edit.png")}
                                    className="w-[15px] "
                                    alt=""
                                  />
                                </button>

                                <div
                                  id={`hs-large-modal${item.id}`}
                                  class="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto"
                                >
                                  <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all lg:max-w-4xl lg:w-full m-3 lg:mx-auto">
                                    <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                                      {/* header */}
                                      <div class=" items-center px-4 border-b dark:border-gray-700 relative bg-primaryColor rounded-t-xl -m-[1px]">
                                        <div className="">
                                          <h1 className="text-white text-3xl text-center font-bold py-5">
                                            Update Product
                                          </h1>
                                        </div>
                                        <button
                                          type="button"
                                          class="hs-dropdown-toggle absolute right-2  top-2  inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                                          data-hs-overlay={`#hs-large-modal${item.id}`}
                                        >
                                          <span class="sr-only">Close</span>
                                          <svg
                                            class="w-6 h-6"
                                            width="8"
                                            height="8"
                                            viewBox="0 0 8 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                              fill="white"
                                            />
                                          </svg>
                                        </button>
                                      </div>

                                      {/* content */}
                                      <div class="p-4 overflow-y-auto">
                                        <div className="border-0 w-full mx-auto rounded-lg relative  flex flex-col  bg-white outline-none focus:outline-none">
                                          {/*body*/}
                                          <div className="relative flex-auto">
                                            <div className="justify-center items-center m-auto text-start ">
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
                                                        name="name"
                                                        onChange={
                                                          handleFormChange
                                                        }
                                                        type="text"
                                                        placeholder={item.name}
                                                        // placeholder="Product Name"
                                                      />
                                                    </div>
                                                    {/* qty & price */}
                                                    <div class="flex flex-wrap -mx-3 ">
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
                                                          onChange={
                                                            handleFormChange
                                                          }
                                                          placeholder={
                                                            item.price
                                                          }
                                                          // placeholder="00.00"
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
                                                            name="categoryId"
                                                            onChange={
                                                              handleFormChange
                                                            }
                                                          >
                                                            <option
                                                              selected
                                                              value={
                                                                item.category
                                                              }
                                                            >
                                                              {
                                                                item.category
                                                                  .name
                                                              }
                                                            </option>
                                                            {categoryData.map(
                                                              (data, index) => (
                                                                <option
                                                                  value={
                                                                    data.id
                                                                  }
                                                                >
                                                                  {data.name}
                                                                </option>
                                                              )
                                                            )}
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
                                                        class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                        name="description"
                                                        rows="10"
                                                        // placeholder="Description..."
                                                        onChange={
                                                          handleFormChange
                                                        }
                                                        placeholder={
                                                          item.description
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                  {/* image */}
                                                  <div class=" col-span-2">
                                                    <div class="flex items-center justify-center w-full">
                                                      <img
                                                        src={
                                                          imageUrl == null ||
                                                          imageUrl == ""
                                                            ? noImage
                                                            : imageUrl
                                                        }
                                                        class="flex flex-col items-center justify-center w-full h-64  rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                                      />
                                                    </div>
                                                    <input
                                                      class="mt-10 block w-full text-sm text-[#777] border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                      id="file_input"
                                                      accept=".jpg, .png, .svg"
                                                      onChange={
                                                        handleChangeImage
                                                      }
                                                      type="file"
                                                    />

                                                    {/* visibility */}
                                                    <div className="relative mt-[78px] flex flex-col items-start">
                                                      <label
                                                        class="block text-xl  tracking-wide text-primaryColor font-bold mb-2"
                                                        for="grid-password"
                                                      >
                                                        Visibility
                                                      </label>
                                                      <label
                                                        // key={index}
                                                        className="relative inline-flex items-center mr-5 cursor-pointer"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          className="sr-only peer border border-primary"
                                                          checked={visible}
                                                          name="isPublish"
                                                          onClick={() =>
                                                            handleToggle()
                                                          }
                                                          // accept={}
                                                        />
                                                        <div className="w-11 h-6 rounded-full peer bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryColor"></div>
                                                        {visible ? (
                                                          <span className="ml-3 text-sm font-medium text-gray-900">
                                                            Visibility
                                                          </span>
                                                        ) : (
                                                          <span className="ml-3 text-sm font-medium text-gray-900">
                                                            Invisibility
                                                          </span>
                                                        )}
                                                      </label>
                                                      <div class="hs-tooltip flex items-center">
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
                                                  {loadingUpdate ? (
                                                    <button
                                                      type="button"
                                                      class="col-span-2 flex text-lg justify-center  items-center gap-3 rounded-lg bg-primary w-32  px-2 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                      href="#"
                                                    >
                                                      <span
                                                        class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                                                        role="status"
                                                        aria-label="loading"
                                                      >
                                                        <span class="sr-only">
                                                          Loading...
                                                        </span>
                                                      </span>
                                                      Saving...
                                                    </button>
                                                  ) : (
                                                    <button
                                                      type="button"
                                                      onClick={onSubmitUpdate}
                                                      class="col-span-2 flex justify-center text-lg items-center gap-3 rounded-lg bg-primary w-32 px-2 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                    >
                                                      <img
                                                        src={require("../../assets/images/distributor/save.png")}
                                                        alt=""
                                                      />{" "}
                                                      Save
                                                    </button>
                                                  )}
                                                  {/* 
                                              <button
                                                type="button"
                                                data-te-ripple-init
                                                onClick={onSubmitUpdate}
                                                data-te-ripple-color="light"
                                                class="col-span-2 flex text-lg items-center gap-3 rounded-lg bg-primary px-3 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                              >
                                                <img
                                                  src={require("../../assets/images/distributor/save.png")}
                                                  alt=""
                                                />{" "}
                                                Save
                                              </button> */}
                                                  <Link
                                                    to="/distributor/product"
                                                    data-hs-overlay={`#hs-large-modal${item.id}`}
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
                                    </div>
                                  </div>
                                </div>
                              </Tooltip>
                            </Button>
                            {/* Duplicate */}
                            {/* <Button color="gray">
                                <Tooltip content="Duplicate">
                                  <img
                                    src={require("../../assets/images/distributor/duplicate.png")}
                                    className="w-[20px]"
                                    alt=""
                                  />
                                </Tooltip>
                              </Button> */}
                            {/* Delete */}
                            <Button
                              color="gray"
                              onClick={() =>
                                handleDeleteProduct(item.id, item.image)
                              }
                            >
                              <Tooltip content="Delete">
                                <img
                                  src={require("../../assets/images/distributor/delete.png")}
                                  className="w-[20px]"
                                  alt=""
                                />
                              </Tooltip>
                            </Button>
                            {/* Hide */}
                            <Button
                              color="gray"
                              onClick={() =>
                                onChangeIdPublishProduct(item.id, item)
                              }
                            >
                              <Tooltip content="Hide">
                                {item.isPublish ? (
                                  <img
                                    src={require("../../assets/images/distributor/eye.png")}
                                    className="w-[20px]"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={require("../../assets/images/distributor/hide.png")}
                                    className="w-[20px]"
                                    alt=""
                                  />
                                )}
                              </Tooltip>
                            </Button>
                          </Button.Group>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
            {loading || noShop ? null : noDataProduct ? null : (
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
          </div>
        </div>
      </div>

      {/* Modal Update product*/}

      {/* delete */}
      <React.Fragment>
        <Modal show={showDelete} size="md" popup={true}>
          <Modal.Body>
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-2 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-2xl text-center">
                Product
              </h1>
              <button
                className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowDelete(false)}
              >
                <img
                  src={require("../../assets/images/closeWhite.png")}
                  className="w-[20px]"
                  alt=""
                />
              </button>
            </div>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto my-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={onDeleteProduct}>
                  {loadingDelete ? (
                    <>
                      <span
                        class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span class="sr-only">Deleting...</span>
                      </span>
                      &nbsp; Deleting...
                    </>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </Button>
                <Button color="gray" onClick={() => setShowDelete(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* update is publish */}
        <Modal show={showModalPublishProduct} size="md" popup={true}>
          <Modal.Body>
            <div className="relative flex -mx-6 -mt-6 items-center justify-center py-2 border-b border-solid bg-primaryColor border-slate-200 rounded-t">
              <h1 className="text-white font-bold text-2xl text-center">
                Product
              </h1>
              <button
                className="absolute right-2 top-2 p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModalPublishProduct(false)}
              >
                <img
                  src={require("../../assets/images/closeWhite.png")}
                  className="w-[20px]"
                  alt=""
                />
              </button>
            </div>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto my-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Do you want to unPublish this product ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleSubmitPublishProduct}>
                  {loadingUnPublish ? (
                    <>
                      <span
                        class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span class="sr-only">Updating...</span>
                      </span>
                      &nbsp; Updating...
                    </>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </Button>
                <Button
                  color="gray"
                  onClick={() => setShowModalPublishProduct(false)}
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
export default ProductDistributor;



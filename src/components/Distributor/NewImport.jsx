import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  add_new_product_distributor,
  get_all_product_distributor,
  import_product_distributor,
} from "../../redux/services/distributor/product.server";
import {
  addNewImportProduct,
  addNewProduct,
  getAllProduct,
} from "../../redux/slices/distributor/productSlice";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { get_all_category } from "../../redux/services/distributor/category.service";
import { getAllCategoryDistributor } from "../../redux/slices/distributor/categorySlice";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageFirebase } from "../../firebaseUploadImage";
import { v4 } from "uuid";
import { CategoryComponent } from "./CategoryComponent";
export default function NewImport(props) {
  const [open, setOpen] = useState(false);
  const [addPro, setAddPro] = useState(false);
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   const imgname = event.target.files[0].name;
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     const img = new Image();
  //     img.src = reader.result;
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const maxSize = Math.max(img.width, img.height);
  //       canvas.width = maxSize;
  //       canvas.height = maxSize;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(
  //         img,
  //         (maxSize - img.width) / 2,
  //         (maxSize - img.height) / 2
  //       );
  //       canvas.toBlob(
  //         (blob) => {
  //           const file = new File([blob], imgname, {
  //             type: "image/png",
  //             lastModified: Date.now(),
  //           });
  //           console.log(file);
  //           setImage(file);
  //         },
  //         "",
  //         0.8
  //       );
  //     };
  //   };
  // };
  // const handleClick = (event) => {
  //   hiddenFileInput.current.click();
  // };
  // const [toggleButton, setToggleButton] = useState(false);
  // const handleToggle = () => {
  //   setToggleButton(!toggleButton);
  // };

  // get category
  const categoryData = useSelector(
    (state) => state.categoryDistributor.categories
  );
  const [inputFields, setInputFields] = useState({
    name: "",
    qty: 0,
    price: 0,
    categoryId: "",
    image: "",
    description: "",
    isPublish: false,
  });
  // schema form add new product
  const schema1 = yup.object().shape({
    name: yup.string().required("Name is required"),
    categoryId: yup.string().required("Category is required"),
  });
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    setValue,
    reset: resetAdd,
  } = useForm({
    resolver: yupResolver(schema1),
  });
  useEffect(() => {
    get_all_category(dispatch)
      .then((r) => {
        if (r && r.data && r.data.status === 200) {
          dispatch(getAllCategoryDistributor(r.data.data));
          setValue("categoryId", r[0].id);
        } else {
          // console.log("Handle");
          if (r && r.response && r.response.data && r.response.data.detail) {
            // console.log(r.response.data.detail);
          }
        }
      })
      .catch((error) => {
        // console.log("Error occurred:", error);
      });
  }, getAllCategoryDistributor());

  /// schema for import
  const schemaImport = yup.object().shape({
    id: yup.string().required("Category cannot be blank"),
    qty: yup
      .number()
      .typeError("Quantity must be a number")
      .required("Quantity cannot be blank")
      .positive("Quantity must be greater than 0"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price cannot be blank")
      .positive("Price must be greater than 0"),
  });
  const {
    register: registerImport,
    handleSubmit: handleSubmitImport,
    formState: { errors: errorsImport },
    reset: resetImport,
  } = useForm({
    resolver: yupResolver(schemaImport),
  });
  //   add import
  const [loadingNewImport, setLoadingNewImport] = useState(false);

  // const [isOpenNewImport, setIsOpenNewImport] = useState(props.isOpenNewImport);
  const addProduct = (e) => {
    setLoadingNewImport(true);
    // e.preventDefault();
    // dispatch(addNewImportProduct(e));
    import_product_distributor(e)
      .then((res) => {
        if (
          res.response &&
          (res.response.status === 401 || res.response.status === 404)
        ) {
          toast.warn("Server error: " + res.response.status);
        } else {
          dispatch(addNewImportProduct(e));
          resetImport();
          toast.success("Import product added successfully");
        }
        setLoadingNewImport(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoadingNewImport(false);
      });
  };

  // ================ on submit =============
  const [loading, setLoading] = useState(false);
  const handleSubmitProduct = async (e) => {
    setLoading(true);
    const dataToSend = [{ ...inputFields, ...e }];
    console.log("data no image: ", dataToSend);
    if (targetImage == null) {
      add_new_product_distributor(dataToSend)
        .then((res) => dispatch(addNewProduct(res.data.data)))
        .then(() => {
          resetAdd();
          setAddPro(false);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setAddPro(false);
        });
    }
    // Set the loading state to true
    const imageRef = ref(storageFirebase, `image/${targetImage.name + v4()}`);
    await uploadBytes(imageRef, targetImage)
      .then(() => getDownloadURL(imageRef))
      .then((downloadURL) => {
        console.log("downloadURL : ", downloadURL);
        const updatedFields = dataToSend.map((field) => ({
          ...field,
          image: downloadURL,
        }));
        console.log(updatedFields);
        // Submit the form data after the image upload is complete
        add_new_product_distributor(updatedFields)
          .then((res) => dispatch(addNewProduct(res.data.data)))
          .then(() => {
            resetAdd();
            setAddPro(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            setAddPro(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setAddPro(false);
      });
  };
  // const handleAddProduct = (e)=>{
  //     navigate('/distributor/add-product')
  // }
  const productName = useSelector((state) => state.product.product);
  useEffect(() => {
    get_all_product_distributor(dispatch)
      .then((res) => {
        // console.log(res);
        if (res && res.data && res.data.status === 200) {
          dispatch(getAllProduct(res.data.data));
        } else {
          if (
            res &&
            res.response &&
            res.response.data &&
            res.response.data.detail
          ) {
            console.log(res.response.data.detail);
          }
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
        // Handle the error as needed
      });
  }, [getAllProduct]);

  // add new product

  const [visible, setVisible] = useState(false);
  const handleIsPublish = () => {
    // console.log(visible);
    setVisible((current) => !current);
    setInputFields((prevData) => ({
      ...prevData,
      isPublish: !visible,
    }));
    // image
  };
  const [imageUrl, setImageUrl] = useState("");
  const [targetImage, setTargetImage] = useState(null);
  const handleChangeImage = (e, index) => {
    const uploadImage = e.target.files[0];
    setTargetImage(uploadImage);
    console.log(URL.createObjectURL(e.target.files[0]));
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
  };

  // onchange data
  const onChangeData = (event) => {
    console.log(event.target.name);
    const { name, value } = event.target;
    setInputFields((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const onSubmitAddNewProduct = (event) => {
    console.log(inputFields);
    // Clear the input fields
    setInputFields({
      name: "",
      qty: 0,
      price: 0,
      categoryId: "",
      image: "",
      description: "",
      isPublish: false,
    });
  };

  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const handleShowCategory = () => {
    setIsOpenCategory(!isOpenCategory);
  };
  return (
    <div>
      {/* imported product */}
      <React.Fragment>
        {/* <Button onClick={() => setOpen(!open)}>
                Toggle modal
            </Button> */}
        <Modal show={props.isOpenNewImport} size="md" popup={true}>
          <Modal />
          <Modal.Header className="text-center bg-primary w-full">
            <h1 className="text-center text-white ml-28 text-xl">
              Import Products
            </h1>
            <p
              className="text-white float-right absolute right-4 top-4 "
              onClick={props.handleShowImport}
            >
              <img
                src={require("../../assets/images/closeWhite.png")}
                alt=""
                className="w-[16px]"
              />
            </p>
          </Modal.Header>
          <Modal.Body>
            {/* <Formik
                        initialValues={{
                            name:"",
                            qty:"",
                            price:"",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            addProduct(values);
                          console.log(values);
                          console.log("Helloooo")
                          }}
                    >
                        {({ errors, touched }) => ( */}
            <form
              className="px-6 mt-4 pb-8"
              onSubmit={handleSubmitImport(addProduct)}
            >
              <label
                for="default"
                class="block mb-2 w-full mt-3 text-lg font-medium text-newGray"
              >
                Product Name
              </label>
              <div className="flex flex-wrap ">
                <div className="w-1/2">
                  <select
                    {...registerImport("id")}
                    name="id"
                    class="bg-gray-50 border dropdown border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full"
                  >
                    <option className="label" selected disabled>
                      please select
                    </option>
                    {productName.map((item) => (
                      <option value={item.id} className="label">
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-red-600 text-xs">
                    {errorsImport.id?.message}
                  </div>
                  {/* {errors.productName && touched.productName ? (
                                            <div className='text-red-600 text-xs'>{errors.productName}</div>
                                        ) : null} */}
                </div>
                <div className="w-1/2 flex justify-end -mt-1/2 ">
                  <div
                    onClick={() => setAddPro(!addPro)}
                    className="w-28 h-10 bg-primary text-white rounded-lg text-sm cursor-pointer flex justify-center items-center"
                  >
                    Add product
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block mb-2 w-full mt-3 text-lg font-medium text-newGray"
                >
                  Quantity
                </label>
                <input
                  {...registerImport("qty")}
                  name="qty"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 "
                  placeholder="Quantity"
                />
                <div className="text-red-600 text-xs">
                  {errorsImport.qty?.message}
                </div>
                {/* {errors.qty && touched.qty ? (
                                        <div className='text-red-600  text-xs'>{errors.qty}</div>
                                    ) : null} */}
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block mb-2 w-full mt-3 text-lg font-medium text-newGray"
                >
                  Imported Price
                </label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 fill-white text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <div className="w-full">
                    <input
                      name="price"
                      {...registerImport("price")}
                      type="text"
                      placeholder="Price"
                      className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="text-red-600 text-xs">
                  {errorsImport.price?.message}
                </div>
                {/* {errors.price && touched.price ? (
                                        <div className='text-red-600 text-xs'>{errors.name?.message}</div>
                                    ) : null} */}
              </div>
              <div className="mx-auto flex flex-wrap ml-16 mt-5">
                <div
                  onClick={props.handleShowImport}
                  className="bg-newRed w-24 text-white rounded-lg py-2 text-sm cursor-pointer flex justify-center"
                >
                  Cancel
                </div>

                {loadingNewImport ? (
                  <>
                    <button
                      type="submit"
                      className="bg-primary ml-3 w-24 text-white rounded-lg text-sm flex  items-center justify-items-center "
                    >
                      <span
                        class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full ml-2"
                        role="status"
                        aria-label="loading"
                      >
                        <span class="sr-only">Adding...</span>
                      </span>
                      &nbsp; Adding...
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="bg-primary ml-3 w-24 text-white rounded-lg text-sm "
                  >
                    Add
                  </button>
                )}
              </div>
            </form>
            {/* )}
                    </Formik> */}
          </Modal.Body>
        </Modal>
      </React.Fragment>
      {/* add product */}
      <React.Fragment>
        <Modal show={addPro} popup={true} onClose={() => setAddPro(!addPro)}>
          <Modal.Header className="text-center bg-primary w-full">
            <h1 className="text-center text-white  ml-64 text-lg mx-auto">
              Add Product
            </h1>
            <p
              className="text-white float-right absolute right-2 top-2 bg-primary w-10 h-10"
              onClick={() => setAddPro(false)}
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
          <Modal.Body>
            {/* <Formik
              initialValues={{
                productName: "",
                qty: "",
                price: "",
                category: "",
                discription: "",
              }}
              validationSchema={SignupSchema2}
              handleSubmit={(values) => {
                handleSubmitProduct(values);
                console.log(values);
              }}
            > */}
            {/* {({ errors, touched }) => ( */}
            <form onSubmit={handleSubmitForm1(handleSubmitProduct)}>
              <div className="w-full flex flex-wrap">
                <div className="w-1/2">
                  <label
                    htmlFor=""
                    className="block mb-2 w-full mt-3 text-md font-medium text-newGray"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    // onBlur={onChangeData}
                    {...registerForm1("name")}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Product Name"
                  />
                  {errorsForm1.name && (
                    <p className="text-red-600 text-xs ml-2">
                      {errorsForm1.name.message}
                    </p>
                  )}
                  {/* <div className="text-red-600 text-xs ml-2">
                    {errors.name?.message}
                  </div> */}
                  <div className="flex flex-wrap mt-3">
                    <label
                      htmlFor=""
                      className="block mb-2 w-full text-md font-medium text-newGray"
                    >
                      Category
                    </label>
                    <div className="w-2/3">
                      <select
                        as="select"
                        name="categoryId"
                        // onChange={onChangeData}
                        id="categoryId"
                        {...registerForm1("categoryId")}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full appearance-none"
                      >
                        <option value="string" className="hover:text-green-600">
                          select category
                        </option>
                        {categoryData.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                      {errorsForm1.categoryId && (
                        <p className="text-red-600 text-xs ml-2">
                          {errorsForm1.categoryId.message}
                        </p>
                      )}
                    </div>

                    <div className="w-1/3 pl-2">
                      <div
                        onClick={() => setIsOpenCategory(!isOpenCategory)}
                        className="bg-primary w-full h-10 text-white flex justify-center items-center rounded-lg text-md cursor-pointer"
                      >
                        Add new
                      </div>
                      <CategoryComponent
                        isOpenCategory={isOpenCategory}
                        handleShowCategory={handleShowCategory}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        for="message"
                        class="block mb-2 w-full mt-3 text-md font-medium text-newGray"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        {...registerForm1("description")}
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write description here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <div className="w-full pl-4">
                    <label
                      htmlFor=""
                      className="block mb-2 w-full mt-2 text-lg font-medium text-newGray text-md"
                    >
                      Add image
                    </label>
                    <div>
                      {/* image */}
                      <div class=" col-span-2">
                        <div class="flex items-center justify-center w-full">
                          <label
                            for="dropzone-file"
                            class="flex flex-col items-center justify-center  bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            {imageUrl == "" || imageUrl == null ? (
                              <>
                                <div class="flex flex-col items-center justify-center w-full px-14 h-56 border-2 border-primaryColor border-dashed rounded-lg cursor-pointer">
                                  <img
                                    src={require("../../assets/images/distributor/image.png")}
                                    alt=""
                                  />
                                  <p class="mb-2  text-center text-gray-500 dark:text-gray-400">
                                    <span class="font-semibold text-primaryColor">
                                      Click to upload
                                    </span>
                                  </p>
                                </div>
                              </>
                            ) : (
                              <img
                                src={imageUrl}
                                className="h-h-56 w-auto rounded-lg "
                              />
                            )}
                            <input
                              id="dropzone-file"
                              name="image"
                              multiple
                              onChange={handleChangeImage}
                              type="file"
                              class="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full pl-4 text-black font-bold mt-4 text-md">
                    Visibility
                  </div>
                  <div className="w-full mt-3 pl-4 text-md">
                    <label
                      // key={index}
                      className="relative inline-flex items-center mr-5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer border border-primary"
                        checked={visible}
                        name="isPublish"
                        // {...register("isPublish")}
                        onClick={() => handleIsPublish()}
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
                  </div>
                  <div className="w-full pl-8 flex mt-10 justify-between">
                    <button
                      onClick={() => setAddPro(!addPro)}
                      className="bg-newRed w-28 text-white rounded-lg py-1 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      // onClick={onSubmitAddNewProduct}
                      className="bg-primary ml-3 w-28 py-2 text-white rounded-lg text-sm flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <span
                            class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full ml-2"
                            role="status"
                            aria-label="loading"
                          >
                            <span class="sr-only">Adding...</span>
                          </span>
                          &nbsp; Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* //   )}
            // </Formik> */}
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </div>
  );
}

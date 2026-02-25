import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageFirebase } from "../../firebaseUploadImage";
import { v4 } from "uuid";
import { add_new_product_distributor } from "../../redux/services/distributor/product.server";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct } from "../../redux/slices/distributor/productSlice";
import { CategoryComponent } from "../../components/Distributor/CategoryComponent";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


const AddProductDistributor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState([
    {
      name: "",
      qty: "",
      price: "",
      categoryId: "",
      image: "",
      description: "",
      isPublish: true,
    },
  ]);
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };
  // console.log(inputFields);

  // validation using react hook form
  const schemaAddProduct = yup.object().shape({
    name: yup.string().required("Category cannot be blank"),
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
    register: registerAddProduct,
    handleSubmit: handleSubmitAddProduct,
    formState: { errors: errorsAddProduct },
    reset: resetAddProduct,
  } = useForm({
    resolver: yupResolver(schemaAddProduct),
  });

  const [selectedOption, setSelectedOption] = useState('');
  const [validationError, setValidationError] = useState({});

const handleChange = (event, index) => {
  const { value } = event.target;
  setSelectedOption((prevOptions) => {
    const updatedOptions = [...prevOptions];
    updatedOptions[index] = value;
    return updatedOptions;
  });
  setValidationError((prevErrors) => {
    const updatedErrors = { ...prevErrors };
    updatedErrors[index] = '';
    return updatedErrors;
  });
};
const validateOption = (index) => {
  if (selectedOption[index] === '') {
    setValidationError((prevErrors) => ({
      ...prevErrors,
      [index]: 'Please select an option',
    }));
    return false;
  }
  // Additional validation logic here if needed
  return true;
};

  //   add more form fields
  const addFields = (nextChecked) => {
    let newField = {
      name: "",
      qty: "",
      price: "",
      categoryId: "",
      image: "",
      description: "",
      isPublish: true,
    };
    setInputFields([...inputFields, newField]);
  };

  // visibility
  const [visible, setVisible] = useState(true);
  const handleToggle = (index) => {
    const data = [...inputFields];
    data[index].isPublish = !data[index].isPublish;
    setInputFields(data);
    console.log(visible);
    setVisible((current) => !current);
  };
  
  // submit form
  const [loading, setLoading] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    // Validate options for each form
    const isFormValid = Object.keys(selectedOption).every((index) =>
      validateOption(index)
    );
  
    if (isFormValid) {
      // Desired action when validation passes
      console.log('Validation passed! Submitting the form...');
    } else {
      // Desired action when validation fails
      console.log('Validation failed! Please correct the form errors.');
    }
    e.preventDefault();
    setLoading(true);
    // console.log("target : ",targetImage);
    if (targetImage == null) {
      console.log("data no image: ",inputFields);
      add_new_product_distributor(inputFields)
          .then((res) => dispatch(addNewProduct(res.data.data)))
          .then(() => navigate("/distributor/product"))
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
    }
    // Set the loading state to true
    const imageRef = ref(storageFirebase, `image/${targetImage.name + v4()}`);
    await uploadBytes(imageRef, targetImage)
      .then(() => getDownloadURL(imageRef))
      .then((downloadURL) => {
        console.log("downloadURL : ", downloadURL);
        const updatedFields = inputFields.map((field) => ({
          ...field,
          image: downloadURL,
        }));
        console.log(updatedFields);
        // Submit the form data after the image upload is complete
        add_new_product_distributor(updatedFields)
          .then((res) => dispatch(addNewProduct(res.data.data)))
          .then(() => navigate("/distributor/product"))
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // image
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
  // get category
  const categoryData = useSelector(
    (state) => state.categoryDistributor.categories
  );

  // console.log(inputFields);

  //  Remove the fields
  const removeFields = (index) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };

  // open category
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const handleShowCategory = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); // Delay of 500 milliseconds

    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`dark:text-white transition ${
        isOpen
          ? " transition-all ease-in-out delay-300 duration-1000 "
          : "opacity-0 scale-95 translate-y-1/2 "
      }`}
    >
      
      <div className="bg-white h-min-screen rounded-lg w-full shadow-md">
        
        <div className="w-[90%] h-min-screen m-auto relative pb-10">
          {/* Header */}
          <div className="">
            <h1 className="text-primaryColor text-4xl text-center font-medium py-8">
              Add New Product
            </h1>
          </div>
          <hr className="border border-gray-200" />
          {/* form */}
          <div className="">
            <form class="m-auto mt-10 " onSubmit={submit}>
              {inputFields.map((input, index) => {
                return (
                  <div
                    key={index}
                    class="grid grid-cols-6 gap-5 border border-1 rounded-lg  p-10 mb-5"
                  >
                    {/* Field input */}
                    <div class="col-span-4">
                      {/* Product */}
                      <div>
                        <label
                          class="block relative uppercase tracking-wide text-gray-700 font-bold mb-2"
                          for="grid-password"
                        >
                          Product Name
                          {/* {errorAdd == '' ? null : <span className="text-sm lowercase font-medium text-red-600 absolute right-1 top-10">{errorAdd}</span>} */}
                        </label>
                        <input
                          value={input.productName}
                          onChange={(event) => handleFormChange(index, event)}
                          className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-primary"
                          // class={`${errorAdd == '' ? " appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-gray-500" :"appearance-none block w-full text-gray-700 border border-red-600 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:ring-red-600 focus:bg-white focus:border-gray-500"}`}
                          name="name"
                          type="text"
                          placeholder="Product Name"
                        />
                      </div>
                      {/* qty & price */}
                      <div class="flex flex-wrap -mx-3 ">
                        {/* qty */}
                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            class="relative block uppercase tracking-wide text-gray-700  font-bold mb-2"
                            for="grid-first-name"
                          >
                            Quantity
                          </label>
                          <input
                            class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-primary"
                            onChange={(event) => handleFormChange(index, event)}
                            value={input.qty}
                            type="number"
                            name="qty"
                            placeholder="Quantity"
                          />
                        </div>
                        {/* Price */}
                        <div class="w-full md:w-1/2 px-3 relative">
                          <img
                            src={require("../../assets/images/distributor/dollar.png")}
                            className="absolute top-11 left-6 "
                            alt=""
                          />
                          <label
                            class="block uppercase tracking-wide text-gray-700  font-bold mb-2"
                            for="grid-last-name"
                          >
                            Price
                          </label>
                          <input
                            class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 pl-10 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-primary"
                            onChange={(event) => handleFormChange(index, event)}
                            value={input.price}
                            type="number"
                            name="price"
                            placeholder="00.00"
                          />
                        </div>
                      </div>
                      {/* category */}
                      <div class="flex flex-wrap -mx-3">
                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label
                            class="block uppercase tracking-wide text-gray-700  font-bold mb-2"
                            for="grid-state"
                          >
                            Category
                          </label>
                          <div class="relative">
                            <select
                              class="appearance-none capitalize block w-full text-gray-700 border border-gray-400 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-primary"
                              id="grid-state"
                              name="categoryId"
                              // onChange={(event) =>
                              //   handleFormChange(index, event)
                              // }
                              // value={selectedOption} 
                              onChange={(event) =>
                                handleChange(event,index)}
                              // value={input.categoryId}
                        
                            >
                              <option selected disabled value="">
                                -- please select --
                              </option>
                              {categoryData.map((item, index) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                            {validationError && <div className="error-message">{validationError}</div>}
                            <div class="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-gray-700">
                              <img
                                src={require("../../assets/images/distributor/down_arrow.png")}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div class="w-full md:w-1/2 px-3 mt-2 md:mb-0">
                          <button
                            type="button"
                            onClick={handleShowCategory}
                            class="inline-block rounded bg-primary mt-6 px-9 py-[8px]  font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                          >
                            Add new{" "}
                           
                          </button>
                          <CategoryComponent
                              isOpenCategory={isOpenCategory}
                              handleShowCategory={handleShowCategory}
                            />
                        </div>
                      </div>
                      {/* description */}
                      <div className="relative mb-6">
                        <label
                          class="block uppercase tracking-wide text-gray-700  font-bold mb-2"
                          for="grid-password"
                        >
                          description
                        </label>
                        <textarea
                          class="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:ring-primary focus:bg-white focus:border-primary"
                          name="description"
                          rows="10"
                          placeholder="Description..."
                          onChange={(event) => handleFormChange(index, event)}
                          value={input.description}
                        />
                      </div>
                    </div>
                    {/* image */}
                    <div class=" col-span-2">
                      <div class="flex items-center justify-center w-full">
                        <label
                          for="dropzone-file"
                          class="flex flex-col items-center justify-center  bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          {imageUrl == "" || imageUrl == null ? (
                            <>
                              <div class="flex flex-col items-center justify-center w-full px-14 h-64 border-2 border-primaryColor border-dashed rounded-lg cursor-pointer">
                                <img
                                  src={require("../../assets/images/distributor/image.png")}
                                  alt=""
                                />
                                <p class="mb-2  text-center text-gray-500 dark:text-gray-400">
                                  <span class="font-semibold text-primaryColor">
                                    Click to upload
                                  </span>
                                  or <br />
                                  drag and drop
                                </p>
                              </div>
                            </>
                          ) : (
                            <img
                              src={imageUrl}
                              className="h-[260px] w-auto rounded-lg "
                            />
                          )}
                          {/* <p class=" text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p> */}

                          <input
                            id="dropzone-file"
                            name="image"
                            multiple
                            // onChange={(event) => handleFormChange(index, event)}
                            onChange={(e) => handleChangeImage(e, index)}
                            type="file"
                            class="hidden"
                          />
                        </label>
                      </div>

                      {/* visibility */}
                      <div className="mt-44 relative">
                        <label
                          class="block text-3xl  tracking-wide text-primaryColor font-bold mb-2"
                          for="grid-password"
                        >
                          Visibility
                        </label>
                        <div class="hs-tooltip flex items-center">
                          {/* visible */}
                          <label
                            key={index}
                            className="relative inline-flex items-center mr-5 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              onChange={handleFormChange}
                              className="sr-only peer border border-primary"
                              checked={input.isPublish}
                              name="isPublish"
                              onClick={() => handleToggle(index)}
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
                      </div>
                      <button
                        onClick={() => removeFields(index)}
                        type="button"
                        class="float-right -mb-10 flex text-lg items-center rounded-lg bg-[#FF7272] px-2 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                      >
                        <img
                          src={require("../../assets/images/distributor/delete_white.png")}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* add more button */}
              <div
                className="border border-1 rounded-lg py-3 px-5 cursor-pointer w-52"
                onClick={addFields}
              >
                <div className="flex items-center justify-center gap-3">
                  <img
                    className=""
                    src={require("../../assets/images/distributor/add_more.png")}
                    alt=""
                  />
                  <p className="text-[#777777] font-medium">Add more</p>
                </div>
              </div>
              {/* button save and cancel */}
              <div className="w-full flex justify-end gap-3 mb-5">
                {loading ? (
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
                      <span class="sr-only">Loading...</span>
                    </span>
                    Saving...
                  </button>
                ) : (
                  <button
                    type="submit"
                    class="col-span-2 flex justify-center text-lg items-center gap-3 rounded-lg bg-primary w-32 px-2 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    <img
                      src={require("../../assets/images/distributor/save.png")}
                      alt=""
                    />{" "}
                    Save
                  </button>
                )}

                <Link
                  to="/distributor/product"
                  type="button"
                  class="col-span-2 flex text-lg justify-center items-center gap-3 rounded-lg bg-[#FF7272] w-32 px-2 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
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
export default AddProductDistributor;

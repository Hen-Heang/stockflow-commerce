import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAccount,
  getAccountDistributer,
} from "../../redux/slices/distributor/AccountSlice";
import { Modal, Button } from "flowbite-react";
import { useEffect } from "react";
import noImage from "../../assets/images/no_image.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageFirebase } from "../../firebaseUploadImage";
import { v4 } from "uuid";
import {
  add_new_account,
  get_account_distributor,
} from "../../redux/services/distributor/account.service";
import { update_account } from "../../redux/services/distributor/account.service";
import { getDataStore } from "../../redux/slices/distributor/storeSlice";
import { get_store_distributor_profile } from "../../redux/services/distributor/store.service";
import { PulseLoader, RingLoader } from "react-spinners";
import AccountProfileSkeleton from "../../components/retailler/skeletons/AccountProfileSkeleton";

export default function Account() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Account";
  }, []);
  const dispatch = useDispatch();
  //  ========================= CreateObject =======================
  const [newAccount, setNewAccount] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    profileImage: "",
    
  });
  // ========================== validation =========================
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Check if firstName field is empty
    if (newAccount.firstName.trim() === "") {
      errors.firstName = "First name is required";
      isValid = false;
    }

    // Check if lastName field is empty
    if (newAccount.lastName.trim() === "") {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    // Check if gender field is empty
    if (newAccount.gender.trim() === "") {
      errors.gender = "Gender is required";
      isValid = false;
    }

    // Check if gender field contains a valid value
    const validGenders = ["Male", "Female", "Other"]; // Modify this array according to your valid gender options
    if (!validGenders.includes(newAccount.gender)) {
      errors.gender = "Invalid gender selected";
      isValid = false;
    }

    // Check if profileImage field has an invalid file extension
    if (newAccount.profileImage.trim() !== "") {
      const allowedExtensions = [".jpg", ".png", ".svg"]; // Valid file extensions
      const fileExtension = newAccount.profileImage
        .split(".")
        .pop()
        .toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        errors.profileImage =
          "Invalid file format. Only JPG, PNG, and SVG are allowed.";
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };
  // ======================== account image =========================
  const [targetImage, setTargetImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const handleChangeImage = (e) => {
    const uploadImage = e.target.files[0];
    setTargetImage(uploadImage);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
  };

  // get data from api
  // console.log("image url : ", imageUrl);
  // useEffect(() => {
  //   get_account_distributor().then((res) => {
  //     dispatch(getAccountDistributer(res.data.data));
  //     setNewAccount(res.data.data);
  //     setImageUrl(res.data.data.profileImage);
  //   });
  // }, getAccountDistributer());
  const [loadingAccount, setloadingAccount] = useState(false);
  const [noDataAccount, setNoDataAccount] = useState(false);
  useEffect(() => {
    get_account_distributor().then((res) => {
      if (res.status === 404 || res.status === 409 || res.status === 401) {
        dispatch(
          getAccountDistributer({
            firstName: "",
            lastName: "",
            gender: "",
            address: "",
            primaryPhoneNumber: "",
            profileImage: "",
            additionalPhoneNumber: [],
          })
        );
        setloadingAccount(false);
        setNoDataAccount(true);
      } else {
        dispatch(getAccountDistributer(res.data.data));
        setNewAccount(res.data.data);
        setImageUrl(res.data.data.profileImage);
        setloadingAccount(false);
        setNoDataAccount(false);
      }
    });
  }, []);
  // useSelector
  const account = useSelector((state) => state.account.data);
  console.log("Account: ", account);
  const [updatedName, setUpdatedName] = useState("");
  // handleObject
  const handleFormChange = (e) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  // =================================  confirm form =========================
  const [loadingConfirm, setSetLoadingConfirm] = useState(false);
  const submit = async (e) => {
    setSetLoadingConfirm(true);
    e.preventDefault();
    console.log("account :", account);

    // condition if account data null
    if (noDataAccount) {
      console.log("No data account : ");
      if (!validateForm()) {
        setShowsave(false);
        setSetLoadingConfirm(false);
      }
      if (validateForm()) {
        // if account doesn't have
        console.log("image url : ", targetImage);
        if (targetImage == null || targetImage == "") {
          console.log("No Image url ...");
          // if user did not input image
          add_new_account(newAccount).then((res) => {
            dispatch(addNewAccount(res.data.data));
            setSetLoadingConfirm(false);
            setEdit(true);
            setIsDisabled(true);
            setSave(false);
            setCancel(false);
            setShowsave(false);
          });
        } else {
          // if use input image
          const imageRef = ref(
            storageFirebase,
            `account_image/${targetImage.name + v4()}`
          );
          await uploadBytes(imageRef, targetImage)
            .then(() => getDownloadURL(imageRef))
            .then((downloadURL) => {
              console.log("downloadURL : ", downloadURL);
              const updatedFields = {
                ...newAccount,
                profileImage: downloadURL,
              };
              console.log(updatedFields);
              // Submit the form data after the image upload is complete
              add_new_account(updatedFields)
                .then((res) => {
                  dispatch(addNewAccount(res.data.data));
                  setEdit(true);
                  setIsDisabled(true);
                  setSave(false);
                  setCancel(false);
                  setShowsave(false);
                  setSetLoadingConfirm(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } else {
      console.log("Already have account...!");
      // if account already create, so update account
      if (targetImage == null || targetImage == "") {
        // if user did not input image
        console.log("Update 2");
        update_account(newAccount).then((res) => {
          dispatch(addNewAccount(res.data.data));
          setEdit(true);
          setIsDisabled(true);
          setSave(false);
          setCancel(false);
          setShowsave(false);
          setSetLoadingConfirm(false);
        });
      } else {
        // if use input image
        const imageRef = ref(
          storageFirebase,
          `account_image/${targetImage.name + v4()}`
        );
        await uploadBytes(imageRef, targetImage)
          .then(() => getDownloadURL(imageRef))
          .then((downloadURL) => {
            console.log("downloadURL : ", downloadURL);
            const updatedFields = {
              ...newAccount,
              profileImage: downloadURL,
            };
            console.log(updatedFields);
            // Submit the form data after the image upload is complete
            console.log("Update 3");
            update_account(updatedFields)
              .then((res) => {
                dispatch(addNewAccount(res.data.data));
                setEdit(true);
                setIsDisabled(true);
                setSave(false);
                setCancel(false);
                setShowsave(false);
                setSetLoadingConfirm(false);
              })
              .then(() => setShowsave(false))
              .then(() => setSetLoadingConfirm(false))
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      console.log(newAccount);
    }
  };

  // Disable Form
  const [isDisabled, setIsDisabled] = useState(true);

  // Handle Edit Form
  const handleEdit = () => {
    setIsDisabled(!isDisabled);
    setEdit(false);
    setSave(true);
    setCancel(true);
  };
  //Handle Cancel Form
  const handleCancelEdit = () => {
    document.getElementById("Form").reset();
    setIsDisabled(!isDisabled);
    setEdit(true);
    setSave(false);
    setCancel(false);
  };
  // Edit Button
  const [edit, setEdit] = useState(true);
  // Save Button
  const [save, setSave] = useState(false);
  // Cancel Button
  const [cancel, setCancel] = useState(false);

  // ========================= store info =========================
  // const storeList = useSelector((state) => state.shop.store);
  // useEffect(() => {
  //   get_store_distributor_profile().then((res) => {
  //     dispatch(getDataStore(res.data.data));
  //   });
  // }, getDataStore());

  // Show Popup
  const [showSave, setShowsave] = useState(false);
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
  return (
    <div
      className={`dark:text-white transition ${
        isOpen
          ? " transition-all ease-in-out delay-300 duration-1000 "
          : "opacity-0 scale-95 translate-y-1/2 "
      }`}
    >
      {/* Form */}
      <form id="Form">
        {loadingAccount ? (
          <AccountProfileSkeleton />
        ) : (
          <div className="bg-white rounded-lg w-full shadow-md">
            <div className="w-full p-6 space-y-1 md:space-y-2 sm:px-12 sm:py-12">
              {/* Account image and Name*/}
              <div className="flex m-auto flex-row justify-start gap-3 lg:gap-7 items-center w-[100%]">
                {imageUrl == null || imageUrl == "" ? (
                  <img
                    src={
                      account?.profileImage == "" ||
                      account.profileImage == null
                        ? noImage
                        : account?.profileImage
                    }
                    alt=""
                    className="rounded w-36 h-36 sm:w-48 sm:h-48 lg:w-48 lg:h-48 border border-gray-300"
                  />
                ) : (
                  <img
                    src={
                      imageUrl == "" || imageUrl == null ? noImage : imageUrl
                    }
                    alt=""
                    className="rounded w-36 h-36 sm:w-48 sm:h-48 lg:w-48 lg:h-48 border border-gray-300"
                  />
                )}
                <div className="self-auto w-full">
                  <h1 className="text-5xl font-medium ">
                    {account?.firstName == null || account?.firstName == ""
                      ? "Unknown"
                      : account.firstName}{" "}
                    {account?.lastName == null || account?.lastName == ""
                      ? "Guest"
                      : account?.lastName}
                  </h1>
                  {/* <p className="text-sm sm:text-lg lg:text-lg text-gray-600">
                    Store address
                  </p> */}

                  <div className="sm:w-[86%] lg:w-[95%] ">
                    <div className="flex  sm:flex-row sm:self-end justify-end lg:-mx-3 lg:px-12">
                      {edit ? (
                        <button
                          type="button"
                          className="top-7  py-2 w-20 lg:py-2.5 lg:w-32 sm:mb-2 text-xs lg:text-sm font-medium text-white focus:outline-none bg-gray-400 rounded border border-gray-300 hover:bg-gray-500 focus:z-10 focus:ring-1 focus:ring-gray-400 "
                          onClick={handleEdit}
                        >
                          Edit
                        </button>
                      ) : null}
                      {cancel ? (
                        <button
                          onClick={handleCancelEdit}
                          type="button"
                          className="text-center mr-3 top-7 py-2 w-20 lg:py-2.5 lg:w-32 sm:mb-2 text-[10px] lg:text-sm font-medium text-white focus:outline-none bg-gray-400 rounded border border-gray-300 hover:bg-gray-500 focus:z-10 focus:ring-1 focus:ring-gray-400 "
                        >
                          Cancel
                        </button>
                      ) : null}
                      {save ? (
                        <button
                          type="button"
                          className="top-7 py-2 w-20 lg:py-2.5 lg:w-32 sm:mb-2 text-[10px] lg:text-sm font-medium text-white focus:outline-none bg-primaryColor rounded border border-gray-300 focus:z-10 focus:ring-1 focus:ring-gray-400 "
                          onClick={() => setShowsave(!showSave)}
                        >
                          Save Changes
                        </button>
                      ) : null}
                      {/* Popup */}
                      <React.Fragment>
                        <Modal show={showSave} size="md" popup={true}>
                          <Modal.Header className="mt-[50%] sm:m-auto" />
                          <Modal.Body>
                            <div className="absolute bg-white top-2 right-0 h-14 w-12"></div>
                            <div className="w-full mx-auto text-center  -mt-6">
                              <div className="mx-auto rounded-full w-16 h-16 sm:w-20 sm:h-20 justify-center">
                                <svg
                                  className="text-white fill-primaryColor w-18 h-18"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                  />
                                </svg>
                              </div>
                              <div className="w-full mx-auto">
                                <h3 className="mb-2 sm:text-lg text-base text-black">
                                  Are you sure you want to update ?
                                </h3>
                                <p className="text-gray-500 sm:text-sm text-xs">
                                  If you choose confirm it would change your
                                </p>
                                <p className="sm:text-sm text-xs text-gray-500">
                                  information.
                                </p>
                                <div className="flex flex-col justify-center gap-3 w-full">
                                  <Button
                                    className="mt-5 w-3/4 mx-auto hover:bg-primaryColor bg-primaryColor border-gray-300 justify-center"
                                    type="submit"
                                    onClick={submit}
                                  >
                                    Confirm
                                  </Button>
                                  <button
                                    onClick={() => setShowsave(!showSave)}
                                    type="button"
                                    className="w-3/4 mx-auto text-semibold text-sm font-medium text-center w-18 h-10 item-center rounded-lg border-2 border-primaryColor text-gray-800"
                                  >
                                    Keep Updating
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </React.Fragment>
                    </div>
                  </div>
                </div>
              </div>
              <br /> <hr className="border border-gray-200" /> <br />
              {/* div 1 */}
              <div className="flex lg:flex-row flex-col justify-start">
                <div className="lg:w-2/5 sm:w-2/6 w-full mb-4">
                  <h1 className="font-medium sm:text-lg">
                    Account Information
                  </h1>
                  <p className="leading-loose text-xs lg:text-sm sm:text-base text-gray-500">
                    Update your information here
                  </p>
                </div>
                <div className="w-full max-w-xl sm:mx-auto">
                  <div className="flex flex-wrap lg:-mx-3 mb-2">
                    {/* Firstname */}
                    <div className="w-full lg:w-1/2 lg:pr-3 md:mb-0">
                      <label
                        className="block mb-1 tracking-wide text-primaryColor text-sm font-medium"
                        for="grid-first-name"
                      >
                        First Name
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:ring-primaryColor focus:border-primaryColor placeholder:text-gray-700 disabled:placeholder:text-gray-400"
                        id="grid-first-name"
                        name="firstName"
                        type="text"
                        placeholder={
                          account?.firstName == null || account?.firstName == ""
                            ? "First Name"
                            : account.firstName
                        }
                        onChange={handleFormChange}
                        disabled={isDisabled}
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm -mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    {/* LastName */}
                    <div className="w-full lg:w-1/2">
                      <label
                        className="block mb-1 tracking-wide text-primaryColor text-sm font-medium"
                        for="grid-last-name"
                      >
                        Last Name
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:ring-primaryColor focus:border-primaryColor focus:bg-white placeholder:text-gray-700 disabled:placeholder:text-gray-400"
                        id="grid-last-name"
                        name="lastName"
                        type="text"
                        placeholder={
                          account?.lastName == null || account?.lastName == ""
                            ? "Last Name"
                            : account.lastName
                        }
                        onChange={handleFormChange}
                        disabled={isDisabled}
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm ">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="flex flex-wrap lg:-mx-3 mb-2">
                    <label
                      className="block mb-1 tracking-wide text-primaryColor text-sm font-medium"
                      for="grid-gender"
                    >
                      Gender
                    </label>
                    <select
                      disabled={isDisabled}
                      onChange={handleFormChange}
                      name="gender"
                      className="block appearance-none w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:ring-primaryColor focus:border-primaryColor"
                      id="grid-gender"
                    >
                      <option selected disabled value={account?.gender}>
                        {account.gender == "" || account?.gender == null
                          ? "Select a gender"
                          : account?.gender}
                      </option>
                      <option disabled>Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-600 text-sm">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <hr className="border border-gray-200" /> <br />
              {/* div 2*/}
              <div className="flex lg:flex-row flex-col justify-start">
                <div className="lg:w-2/5 sm:w-full w-full mb-4">
                  <h1 className="sm:text-lg font-medium">Account Picture</h1>
                  <p className="leading-loose text-xs lg:text-sm sm:text-base text-gray-500">
                    Update your warehouse profile here
                  </p>
                </div>
                <div className="w-full max-w-xl sm:mx-auto">
                  {/* image upload */}
                  <div className="flex flex-wrap lg:-mx-3 ">
                    <div className="w-2/5 mb-6 lg:mb-0 flex flex-col justify-between items-center">
                      {imageUrl == null || imageUrl == "" ? (
                        <img
                          src={
                            account?.profileImage == "" ||
                            account?.profileImage == null
                              ? noImage
                              : account?.profileImage
                          }
                          alt=""
                          className="rounded w-24 h-24 sm:w-32 sm:h-32 border border-gray-300"
                        />
                      ) : (
                        <img
                          src={
                            imageUrl == "" || imageUrl == null
                              ? noImage
                              : imageUrl
                          }
                          alt=""
                          className="rounded w-24 h-24 sm:w-32 sm:h-32 border border-gray-300"
                        />
                      )}
                    </div>
                    <div className="w-3/5">
                      <label
                        for="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-28 sm:h-40 border border-gray-300 rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <img
                            src={require("../../assets/images/add-image 2.png")}
                            alt=""
                            className="h-7 w-7 sm:h-10 sm:w-10"
                          />
                          <p className="my-2 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            <span className="font-semibold underline text-primaryColor">
                              Click to upload
                            </span>{" "}
                            {/* or drag and drop <br /> */} <br />
                            SVG, PNG, JPG, or gif
                            <br />
                            (max, 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          name="profileImage"
                          type="file"
                          accept="image/jpeg, image/png, image/gif, image/svg+xml"
                          className="hidden"
                          onChange={handleChangeImage}
                          disabled={isDisabled}
                        />
                      </label>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex flex-wrap lg:-mx-3 mt-5 mb-5 lg:mb-10">
                    <label
                      for="email"
                      className="block mb-1 tracking-wide text-sm font-medium text-primaryColor dark:text-white"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="block bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded w-full py-3 px-4 focus:outline-none focus:bg-white focus:ring-primaryColor focus:border-primaryColor placeholder:text-gray-400"
                      value={localStorage.getItem("email")}
                      disabled
                    />
                  </div>
                  {/* Button Edit none */}
                </div>
              </div>
              {/*---*/}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}


import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepicker from "react-tailwindcss-datepicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as chartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  layouts,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { get_all_activity } from "../../redux/services/distributor/homepage.service";
import { getActivityInfo } from "../../redux/slices/distributor/getActivitySlice";
import { api } from "../../utils/api";
import dayjs from "dayjs";
import { get_dis_home_report } from "../../redux/services/distributor/homeReport.service";
import { getDistributorReport } from "../../redux/slices/distributor/homeReportSlice";
import OneSignal from "react-onesignal";
import axios from "axios";
chartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
const HomeDistributor = () => {
  useEffect(() => {
    document.title = "StockFlow Commerce | Home";
  }, []);

  const onSubmit = () => {
    toast.success("You are login successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // top cards
  const App = () => {
    const [activeTab, setActiveTab] = useState("tab1");
  };

  const getActivityList = useSelector((state) => state.getActivityInfo.data);
  //  console.log("HHHHH",getActivityList)
  const dispatch = useDispatch();
  useEffect(() => {
    get_all_activity().then((r) => dispatch(getActivityInfo(r.data.data)));
  }, getActivityInfo());
///////////////////////////////////////////////////
  // const [startDate, setStartDate] = useState();
  // const [endDate, setEndDate] = useState();
  // const [formattedStartDate, setFormattedStartDate] = useState("");
  // const [formattedEndDate, setFormattedEndDate] = useState("");
  // const [statsTime, setStatsTime] = useState([]);
  // const [dataSetStats, setDataSetStats] = useState([]);
  // const [graphLabel, setGraphLabel] = useState([]);
  // const handleStartDateChange = (newValue) => {
  //   if (newValue.isAfter(dayjs(), "day")) {
  //     toast.error("Selected date should not be higher than today!");
  //     setStartDate(null);
  //   } else {
  //     setStartDate(newValue);
  //   }
  // };
  // const handleEndDateChange = (newValue) => {
  //   if (newValue.isAfter(dayjs(), "day")) {
  //     toast.error("Selected date should not be higher than today!");
  //     setEndDate(null);
  //   } else {
  //     setEndDate(newValue);
  //   }
  // };
  // // console.log(`stats`, statsTime);
  // const constructURL = () => {
  //   const baseURL =
  //     "http://localhost:8888/api/v1/distributor/order_activities/months";
  //   // const queryParams = [];
  //   if (startDate) {
  //     console.log("startdate", startDate);
  //     const formattedStartDate = dayjs(startDate).format("YYYY-MM");
  //     // console.log("aaa", formattedStartDate);
  //     // queryParams.push(`startDate=${formattedStartDate}`);
  //     setFormattedStartDate(formattedStartDate);
  //   }
  //   if (endDate) {
  //     const formattedEndDate = dayjs(endDate).format("YYYY-MM");
  //     // queryParams.push(`endDated=${formattedEndDate}`);
  //     setFormattedEndDate(formattedEndDate);
  //   }
  //   // const queryString = queryParams.join("&");
  //   const urlWithQuery = `${baseURL}?startDate=${formattedStartDate}&endDated=${formattedEndDate}`;
  //   console.log(urlWithQuery);
  //   return urlWithQuery;
  // };
  // const handleSubmit = () => {
  //   if (!startDate || !endDate) {
  //     toast.error("Please select both start date and end date");
  //     setStartDate(null);
  //     setEndDate(null);
  //     return;
  //   }
  //   // Handle the submission of start date and end date
  //   // For example, you can make an API call or perform any necessary operations
  //   console.log("Start Date:", startDate);
  //   console.log("End Date:", endDate);

  //   // Reset the form or perform any other actions
  //   setStartDate();
  //   setEndDate();

  //   toast.success("Dates submitted successfully");
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url = constructURL();
  //     try {
  //       const response = await api.get(url);
  //       setStatsTime(response.data.data);
  //       const timeline = response.data.data.totalOrderEachMonth;
  //       const graphLabel = response.data.data.month;
  //       setDataSetStats(timeline);
  //       setGraphLabel(graphLabel);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };
  //   fetchData();
  // }, [startDate, endDate]);
  ///////////////////////////////////////////////////


  
  // For filter the date
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [formattedStartDate, setFormattedStartDate] = useState();
  const [formattedEndDate, setFormattedEndDate] = useState();
  const [report, setStatsTime] = useState([]);
  const [date, setDate] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const currentDate = new Date().toLocaleDateString();
  const [startDateIsAfterCurrentDate, setStartDateIsAfterCurrentDate] =
    useState(false);
  const [endDateIsAfterCurrentDate, setEndDateIsAfterCurrentDate] =
    useState(false);
  const [testReport, setTestReport] = useState({});



  const handleStartDateChange = (newValue) => {
    console.log("value start date ", newValue);
    if (newValue.isAfter(dayjs(), "day")) {
      toast.error("Selected date should not be higher than today!");
      console.log("currentDate", typeof currentDate);
      console.log("Test ", newValue.isAfter(dayjs(), "day"));
      setStartDateIsAfterCurrentDate(newValue.isAfter(dayjs(), "day"));

      console.log("startDateIsAfterCurrentDate", startDateIsAfterCurrentDate);
      setStartDate();
    } else {
      // console.log("Else start : ", newValue);
      // setStartDate(newValue);
      if (newValue != null) {
        const formattedStartDate = dayjs(newValue).format("YYYY-MM");
        setFormattedStartDate(formattedStartDate);
        setStartDateIsAfterCurrentDate(false);
        console.log("formattedStartDate type", typeof formattedStartDate);

        console.log("formattedStartDate : ", formattedStartDate);
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    console.log("value end date ", newValue);

    if (newValue.isAfter(dayjs(), "day")) {
      toast.error("Selected date should not be higher than today!");
      console.log("Test ", formattedEndDate > currentDate);
      console.log("End ", newValue.isAfter(dayjs(), "day"));
      setEndDateIsAfterCurrentDate(newValue.isAfter(dayjs(), "day"));
      setEndDate();
    } else {
      console.log("Hi end date");

      setEndDate(newValue);
      if (newValue != null) {
        const formattedEndDate = dayjs(newValue).format("YYYY-MM");
        setFormattedEndDate(formattedEndDate);
        setEndDateIsAfterCurrentDate(false);
        console.log("formattedEndDate : ", formattedEndDate);
      }
    }
  };

  // For submit date
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    console.log("isClicked: ", isClicked);
    // if (startDate != null && endDate != null) {
    setIsClicked(!isClicked);
    // }

    setOpen(true);
    if (formattedStartDate == null && formattedEndDate == null) {
      console.log("Hi message");
      setOpen(false);
      toast.error("Please select date", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      //  setIsLoading(false);
      return;
    }

    // Reset the form or perform any other actions
    setStartDate();
    setEndDate();
  };

  const reportURL = () => {
    console.log("Start : ", startDate);
    console.log("End : ", endDate);

    const baseURL = "http://localhost:8888/api/v1/distributor/order_activities/months";
    const urlWithQuery = `${baseURL}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    console.log(urlWithQuery);
    return urlWithQuery;
  };
  // check again



  useEffect(() => {
    const fetchData = async () => {
      const url = reportURL();

      try {
        console.log(formattedStartDate);
        console.log(formattedEndDate);
        const res = await get_dis_home_report(
          formattedStartDate,
          formattedEndDate
        );
        setOpen(false);
        console.log("resfff : ", res);
        dispatch(getDistributorReport(res.data.data));

      
      } catch (error) {
        console.log("This is error", error);
      }
    };
    // setIsLoading(true); // Set loading state to true before fetching data
    fetchData();
  }, [isClicked]);


    const distributorReport =  useSelector((state)=> state.homeReport.distributorReport )
  console.log("dtr", distributorReport)

  // statistic
  const data = {
    // labels: graphLabel,
    labels: distributorReport.month ? distributorReport.month :  [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Order Each Month",
        data: distributorReport.totalOrderEachMonth ?
        distributorReport.totalOrderEachMonth :  [] ,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "#00b7c9",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "",
        onClick: (e) => e.stopPropagation(), // Prevent legend filtering
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number'
        },
        ticks: {
          // forces step size to be 50 units
          stepSize: 1
        }


      },
    },
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

  // ===================== push notifications =================
  // const externalUserId = "65"; // Replace with the actual external user ID
  // const message = "Hello, Tell me pg when you get this notification...!(~_~)"; // Replace with your notification message

  // const sendPushNotification = async () => {
  //   const apiKey = "MTc0Nzk5MWEtNjI0Ni00NGFjLWJiZmItYzVjNmY0MzY3NzQ0";
  //   const appId = "aaa38faa-9476-4e23-9c0c-037a9fac31ce";
  //   const notification = {
  //     app_id: appId,
  //     contents: { en: message },
  //     include_external_user_ids: [externalUserId],
  //   };

  //   try {
  //     const response = await axios.post(
  //       "https://onesignal.com/api/v1/notifications",
  //       notification,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Basic ${apiKey}`,
  //         },
  //       }
  //     );

  //     console.log("Push notification sent successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error sending push notification:", error.response.data);
  //   }
  // };
  // const allNotifications = useSelector((state)=>state.allDataNotification.dataNotification)
  return (
    <div
    className={`dark:text-white transition ${
      isOpen
        ? " transition-all ease-in-out delay-300 duration-1000 "
        : "opacity-0 scale-95 translate-y-1/2 "
    }`}
  >
       {/* {allNotifications.map((item)=>{
        <span>{console.log(item.notificationType)}</span>
      })} */}
      <div></div>
      <div className="bg-white py-8 w-[95%] mx-auto lg:w-full rounded-lg shadow-md">
        {/* <button onClick={sendPushNotification}>Send Push Notification</button> */}
        {/* text */}
        <div className="w-[95%] flex flex-wrap flex-col gap-3 justify-center m-auto">
          <h1 className="lg:text-3xl text-primaryColor font-bold">
            Order activity
          </h1>
          <ToastContainer />
          <p className="text-[#777777]  text-xs lg:text-base text-start">
            Activity that you need to monitor your to maintain your order
          </p>
          {/* Item Activity */}
          <div className="flex flex-wrap justify-evenly sm:justify-between lg:gap-0 gap-5">
            {/* item 1 */}
            <div className="col-span-1 flex justify-center flex-col  lg:flex-row gap-5  ">
              <div className="px-4 lg:px-0 lg:w-full">
                <img
                  src={require("../../assets/images/distributor/add_shopping_cart_home.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777] whitespace-nowrap">New order</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.newOrder}
                </span>
              </div>
            </div>
            {/* <div className="col-span-1 flex justify-center gap-5 cursor-pointer hover:rounded-full hover:shadow-lg">
              <div className="hidden lg:block">
                <img
                  src={require("../../assets/images/distributor/add_shopping_cart_home.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">New order</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.newOrder}
                </span>
              </div>
            </div> */}

            {/* item 2 */}
            <div className="col-span-1 flex flex-col  lg:flex-row  gap-5">
              <div className="px-4 lg:px-0 lg:w-full">
                <img
                  src={require("../../assets/images/distributor/packing_home.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">Preparing</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.preparing}
                </span>
              </div>
            </div>
            {/* item 3 */}
            <div className="col-span-1 flex flex-col  lg:flex-row gap-5">
              <div className="px-4 lg:px-0 lg:w-full">
                <img
                  src={require("../../assets/images/distributor/delivery_home.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">Dispatch</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.dispatch}
                </span>
              </div>
            </div>
            {/* <div className="col-span-1 flex gap-5">
              <div className="hidden lg:block">
                <img
                  src={require("../../assets/images/distributor/delivery_home.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">Dispatch</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.dispatch}
                </span>
              </div>
            </div> */}
            {/* item 4 */}
            <div className="col-span-1 flex flex-col  lg:flex-row gap-5">
              <div className="px-4 lg:px-0 lg:w-full">
                <img
                  src={require("../../assets/images/distributor/Hourglass.png")}
                  className="p-2 bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">Confirming</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.confirming}
                </span>
              </div>
            </div>
            {/* item 5 */}
            <div className="col-span-1 flex flex-col  lg:flex-row  gap-5">
              <div className=" px-4 lg:px-0 lg:w-full">
                <img
                  src={require("../../assets/images/distributor//task_completed_home.png")}
                  className="p-2  bg-[#F2F2F2] rounded-full shadow-md outline-gray-600"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#777777]">Completed</p>
                <span className="text-black lg:text-2xl text-xl font-medium">
                  {getActivityList.completed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="bg-white h-min-screen  w-full lg:rounded-lg lg:shadow-md">
        <div className="w-[95%] m-auto flex flex-col gap-10">
          <div className="mt-10">
            <h1 className="text-xl lg:text-2xl text-black font-medium">
              Store Statistic
            </h1>
          </div>

          {/* <Datepicker
                format="yyyy-MM"
                value={value}
                onChange={handleValueChange}
              /> */}

          <div className=" flex sm:gap-5 sm:items-center flex-col sm:flex-row">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={'"Start Date"'}
                      views={["year", "month"]}
                      format="YYYY-MM"
                      value={startDate}
                      onChange={handleStartDateChange}
                     
                    />
                  </LocalizationProvider>
            <p className="flex py-2 justify-center sm:justify-normal">To</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={'"End Date"'}
                      views={["year", "month"]}
                      value={endDate}
                      format="YYYY-MM"
                      onChange={handleEndDateChange}
                    />
                  </LocalizationProvider>

                  {startDateIsAfterCurrentDate === true ||
                  endDateIsAfterCurrentDate === true ? (
                    <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md ">
                      Check
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-sky-400 hover:text-white"
                      onClick={handleSubmit}
                    >
                      Check
                    </button>
                  )}
          </div>


          {/* card */}

          {/* 
            { statsTime.map((item)=>
console.log("item",item)
            )}; */}

          <div className="flex flex-row justify-evenly sm:justify-between   space-x-3">
            {/* Total Order */}
            {/* <div className="pt-8  px-2 w-28 sm:w-1/4 mb-2  lg:pb-7 sm:pl-8  shadow-md flex flex-col sm:gap-3 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-base">Total Order</p>
              <div className="p-2">
              <h2 className=" text-xl mt-10 lg:mt-4 mb-2 lg:text-2xl text-black font-medium">
                {statsTime.totalOrder}
              </h2>
              </div>
            </div> */}
            <div className="pt-7  px-2 w-28 mb-2 sm:w-1/4  lg:pb-7 sm:pl-8  shadow-md flex flex-col gap-3 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-base py-2">Total Order</p>

              <div className="p-2">
                <h2 className="text-xl pt-4 w-28 mb-2 lg:text-2xl text-black font-medium">
                  {distributorReport.totalOrder}
                </h2>
              </div>
            </div>
            {/* totalProductImport*/}
            <div className="pt-7  px-2 w-28 mb-2 sm:w-1/4  lg:pb-7 sm:pl-8  shadow-md flex flex-col gap-3 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-base py-2">
                Total Product Imported
              </p>

              <div className="p-2">
                <h2 className="text-xl w-28 mb-2 lg:text-2xl text-black font-medium">
                  {/* {statsTime.totalProductImport} */}
                  {distributorReport.totalProductImport}
                </h2>
              </div>
            </div>
            {/*totalProductSold*/}
            <div className="pt-8  px-2 w-28 mb-2 sm:w-1/4   sm:pl-8 shadow-md flex flex-col gap-3 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-base">Total Products Sold</p>
              <div className="p-2">
                <h2 className="text-xl pt-4 mb-4 lg:text-2xl text-black font-medium">             
                  {distributorReport.totalProductSold}
                </h2>
              </div>
            </div>
          </div>
          {/* Statistic chart */}
          <div className="mb-36 p-6 sm:px-14 lg:px-0">
            <Line data={data} options={options} className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDistributor;


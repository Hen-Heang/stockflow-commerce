import React from "react";
import { Bar } from "react-chartjs-2";
import Datepicker from "react-tailwindcss-datepicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Chart as chartJS,
  BarElement,
  LinearScale,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";

chartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
function ReportDistributor() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Report";
  }, []);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [formattedStartDate, setFormattedStartDate] = useState();
  const [formattedEndDate, setFormattedEndDate] = useState();

  const [statsTime, setStatsTime] = useState([]);

  const [dataSetStats, setDataSetStats] = useState([]);
  const [graphLabel, setGraphLabel] = useState([]);

  const handleStartDateChange = (newValue) => {
    if (newValue.isAfter(dayjs(), "day")) {
      toast.error("Selected date should not be higher than today!");
      setStartDate(null);
    } else {
      setStartDate(newValue);
    }
  };

  const handleEndDateChange = (newValue) => {
    if (newValue.isAfter(dayjs(), "day")) {
      toast.error("Selected date should not be higher than today!");
      setEndDate(null);
    } else {
      setEndDate(newValue);
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start date and end date");
      setStartDate(null);
      setEndDate(null);
      return;
    }
    // Handle the submission of start date and end date
    // For example, you can make an API call or perform any necessary operations
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Reset the form or perform any other actions
    setStartDate();
    setEndDate();

    toast.success("Dates submitted successfully");
  };

  const reportURL = () => {
    const baseURL = "http://localhost:8888/api/v1/distributor/reports";

    if (startDate) {
      console.log(startDate);
      const formattedStartDate = dayjs(startDate).format("YYYY-MM");
      console.log(formattedStartDate);
      setFormattedStartDate(formattedStartDate);
    }

    if (endDate) {
      console.log(endDate);
      const formattedEndDate = dayjs(endDate).format("YYYY-MM");
      console.log(formattedEndDate);
      setFormattedEndDate(formattedEndDate);
    }
    const urlWithQuery = `${baseURL}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    console.log(urlWithQuery);
    return urlWithQuery;
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = reportURL();
      try {
        const response = await api.get(url);
        setStatsTime(response.data.data);
        console.log(response )
        console.log(response.data.data);
        const timeline = response.data.data.orderPerMonth
        ;
        console.log("pr",timeline)
        const graphLabel = response.data.data.periodName;
        setDataSetStats(timeline);
        console.log("aa",graphLabel)
        setGraphLabel(graphLabel);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [startDate && endDate]);
 

  const data = {
    labels: 
    graphLabel,
    // [
    // "January" ,
    // "February" ,
    // "March",
    // "April",
    // "May",
    // "June",
    // "July",
    // "August",

    // ],
    datasets: [
      {
        label: "a month",
        data: dataSetStats, // order per month
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "#0f766e",
        tension: 0.1,
      },
    ],
  };

  //   data picker with

  // set when opening
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); // Delay of 500 milliseconds


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
        y: {
            beginAtZero: true,        
        }
    }
    };

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
      <div className="bg-white min-h-screen rounded-lg w-full shadow-md">
        <div className="w-[95%] min-h-screen px-4 sm:px-10 lg:px-0 lg:m-auto flex-col">
          <div className="flex flex-col gap-3 justify-between m-auto">
            <div className="mt-10 mb-10 flex flex-wrap flex-col gap-5 justify-center">
              <h1 className="text-3xl text-primaryColor font-bold">
                Order history
              </h1>
              <p className="text-[#777777]">
                Manage your recent order and invoices.
              </p>
              <p className="text-[#777777]">
                Click on a download button to get the invoice!
              </p>
              <div className=" flex flex-col lg:flex-row sm:gap-5  sm:justify-start">
                {/* <Datepicker
                format="yyyy-MM"
                value={value}
                onChange={handleValueChange}
              /> */}
             <div className="flex flex-col sm:flex-row gap-5 lg:w-3/5">
         <div className="flex flex-col w-[100%] sm:flex-row sm:justify-start sm:space-x-1 lg:p-2  justify-evenly">
         <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"Start Date"}
                    views={["year", "month"]}
                    format="YYYY-MM"
                    value={startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                          readOnly: true,
                      },
                  }}
                    
                  />
                </LocalizationProvider>
                <p className="mx-auto sm:mx-0 sm:p-4">To</p>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"End Date"}
                    views={["year", "month"]}
                    value={endDate}
                    format="YYYY-MM"
                    onChange={handleEndDateChange}
                    slotProps={{
                      textField: {
                          readOnly: true,
                      },
                  }}
                  />
                </LocalizationProvider>

                <button
                  className="px-4 mb-2 mt-2 sm:mt-0 sm:mb-0 space-x-1 h-10 sm:h-14 bg-primary text-white font-semibold rounded-md hover:bg-primary"
                  onClick={handleSubmit}
                >
                  Check
                </button>
         </div>
             </div>
                <div className="  flex flex-col sm:flex-row sm:justify-between  lg:justify-between w-full sm:w-4/5 lg:m-auto sm:gap-2 lg:gap-0 lg:ml-40 ">
                  {/* Expense */}
                  <div className="py-2 mb-2 sm:mb-0 pl-8 pr-24  shadow-md flex flex-col gap-1 rounded-lg border border-gray-200">
                    <p className="text-[#0F766E]">Expense</p>
                    <h2 className="text-xl text-black font-medium">
                      $ <span>{statsTime.totalExpense}</span>
                    </h2>
                    <p>
                      {/* <span className="text-[#08C91B]">+34.42%</span> */}
                    </p>
                  </div>
                  {/* Expense */}
                  <div className="py-2 mb-2 sm:mb-0 pl-8 pr-24  shadow-md flex flex-col gap-1 rounded-lg border border-gray-200">
                    <p className="text-[#0F766E]">Profit</p>
                    <h2 className="text-xl text-black font-medium">
                      $ <span>{statsTime.totalProfit}</span>
                    </h2>
                    <p>
                      {/* <span className="text-[#08C91B]">+34.42%</span> */}
                    </p>
                  </div>
                  {/* Expense */}
                  <div className="py-2 mb-2 sm:mb-0 pl-8 pr-24  shadow-md flex flex-col gap-1 rounded-lg border border-gray-200">
                    <p className="text-[#0F766E]">Total Orders</p>
                    <h2 className="text-xl text-black font-medium">
                      <span>{statsTime.totalOrder}</span>
                    </h2>
                    <p>
                      {/* <span className="text-[#08C91B]">+34.42%</span> */}
                    </p>
                  </div>
                </div>
                <ToastContainer />
              </div>
             <Bar data={data} options={Option}  />

              {/* cart */}
              {/* {reportList.map((item=>( */}

              {/* )))}   */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDistributor;



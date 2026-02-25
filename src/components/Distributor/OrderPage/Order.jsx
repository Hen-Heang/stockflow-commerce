import React, { useState } from "react";
import NewOrder from "./NewOrder";
import Preparing from "./Preparing";
import Dispatch from "./Dispatch";
import Confirm from "./Confirm";
import Complete from "./Complete";
import { useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
export default function Order() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Order";
  }, []);


  // ===================== websocket =================
  // var stompClient = null;
  // const Sock = null;
  // const connect = () => {
  //   const Sock = new SockJS("http://localhost:8888/ws");
  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnected, onError);
  //   console.log("WS connected");
  // };
  // const disconnectFromSocket = () => {
  //   if (Sock) {
  //     Sock.close();
  //   }
  // };
  // const onConnected = () => {
  //   console.log("/user/" + localStorage.getItem("userId") + "/private");
  //   stompClient.subscribe(
  //     "/user/" + localStorage.getItem("userId") + "/private",
  //     onPrivateMessage
  //   );
  //   userJoin();
  // };
  // const userJoin = () => {
  //   var chatMessage = {
  //     status: "JOIN",
  //   };
  //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  // };
  // const onPrivateMessage = (payload) => {
  //   var payloadData = JSON.parse(payload.body);
  //   console.log(payloadData);
  //   switch (payloadData.status) {
  //     case "ORDER":
  //       console.log("connected");
  //       window.location.reload();
  //       break;
  //   }
  // };
  // const onError = (err) => {
  //   console.log(err);
  // };
  // useEffect(() => {
  //   connect();
  // }, []);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const toggleTab1 = () => {
    toggleTab(1);
  };
  const toggleTab2 = () => {
    toggleTab(2);
  };
  const toggleTab3 = () => {
    toggleTab(3);
  };
  const toggleTab4 = () => {
    toggleTab(4);
  };
  const toggleTab5 = () => {
    toggleTab(5);
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
  return (
    <div
    className={`dark:text-white transition ${
      isOpen
        ? " transition-all ease-in-out delay-300 duration-1000 "
        : "opacity-0 scale-95 translate-y-1/2 "
    }`}
  >
      {/* <div className="bg-white min-h-screen rounded-lg w-full shadow-md"> */}
        <div className="w-full p-8 bg-white m-auto rounded-lg">
          {/* <div className="flex flex-wrap flex-col gap-3 justify-between m-auto"> */}
            <div className="flex flex-wrap flex-col gap-3 justify-center relative overflow-x-auto">
              <h1 className="text-primary font-bold text-3xl">
                Order activity
              </h1>
              <p className="text-newGray text-[16px] mt-2">
                Activity that you need to monitor your to maintain your order{" "}
              </p>
              <div>
                <div class="flex items-center">
                  <ul class="flex flex-row text-md mt-4 mr-6 space-x-8 text-[16px]">
                    <li>
                      <a
                        href="#"
                        onClick={toggleTab1}
                        class={
                          toggleState === 1
                            ? "text-newGray dark:text-white border-b-2 border-primary "
                            : "outline-none"
                        }
                      >
                        New Orders
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={toggleTab2}
                        class={
                          toggleState === 2
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Preparing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={toggleTab3}
                        class={
                          toggleState === 3
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Dispatch
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={toggleTab4}
                        class={
                          toggleState === 4
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Confirming
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={toggleTab5}
                        class={
                          toggleState === 5
                            ? "text-newGray dark:text-white border-b-2 border-primary"
                            : "outline-none"
                        }
                      >
                        Completed
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <div> */}
                  <div className="flex flex-wrap flex-col w-full">
                    <div className="flex-grow-1">
                      <div
                        className={
                          toggleState === 1
                            ? " w-full  block"
                            : " w-full h-full hidden bg-white"
                        }
                      >
                        <NewOrder toggleTab2={toggleTab2} />
                      </div>
                      <div
                        className={
                          toggleState === 2
                            ? "bg-white w-full h-full block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <Preparing toggleTab3={toggleTab3} />
                      </div>
                      <div
                        className={
                          toggleState === 3
                            ? "bg-white w-full h-full   block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <Dispatch toggleTab4={toggleTab4} />
                      </div>
                      <div
                        className={
                          toggleState === 4
                            ? "bg-white w-full h-full   block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <Confirm toggleTab5={toggleTab5} />
                      </div>
                      <div
                        className={
                          toggleState === 5
                            ? "bg-white w-full h-full   block"
                            : "bg-white w-full h-full hidden"
                        }
                      >
                        <Complete />
                      </div>
                    </div>
                  </div>
                {/* </div> */}
              </div>
            </div>
          {/* </div> */}
        </div>
      {/* </div> */}
    </div>
  );
}


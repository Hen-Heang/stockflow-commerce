import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { ThemeProvider } from "./components/Distributor/ThemeContext";
// import Background from "./components/Distributor/Background";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import("preline");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //     <Provider store={store}>
  //         <React.StrictMode>
  //             <ThemeProvider>
  //                 <Background>
  //                 <App />
  //                 </Background>
  //             </ThemeProvider>
  //         </React.StrictMode>
  //   </Provider>
  // <React.StrictMode>
  //     <ThemeProvider>
  //         <Background>
  //             <App />
  //         </Background>
  //     </ThemeProvider>
  // </React.StrictMode>
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <App />

  //   </Provider>
  //   {/* <Provider store={store}></Provider> */}
  //   {/* <Provider store={store}> */}
  //   {/* </Provider> */}

  // </React.StrictMode>

  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

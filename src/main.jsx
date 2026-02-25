import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";

import("preline");

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

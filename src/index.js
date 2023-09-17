import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import routes from "./routes";
import rootReduces from "./reduces";
import { ConfigProvider, message } from "antd";
// import zhCN from "antd/lib/locale/zh_CN";
import service from "./service";
import "./global.css";

global.service = service;
const store = createStore(
  rootReduces,
  composeWithDevTools(applyMiddleware(thunk))
);

window.addEventListener("unhandledrejection", (e) => {
  const { response = {}, reason = {} } = e;
  const { code } = reason;
  message.error(response.data || reason.message);
  if (code === "102") {
    window.location = "/login";
  }
});
ReactDOM.render(
  // <ConfigProvider locale={zhCN}>
  <Provider store={store}>{routes}</Provider>,
  document.getElementById("root")
  // </ConfigProvider>,
);

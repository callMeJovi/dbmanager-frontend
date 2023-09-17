import React from "react";
import { Space } from "antd";
import jwt_decode from "jwt-decode";
import "./style/index.css";

export default class extends React.Component {
  onLogout = () => {
    sessionStorage.removeItem("token");
    window.location = "/login";
  };
  render() {
    try {
      this.account = jwt_decode(sessionStorage.token).account;
    } catch {
      this.account = "";
    }

    return (
      <div className="m-header">
        <Space>
          <span>hi,{this.account}</span>
          <a onClick={this.onLogout}>Log out</a>
        </Space>
      </div>
    );
  }
}

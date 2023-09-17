import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import CryptoJs from "crypto-js";
import { Navigate } from "react-router-dom";
import "./style/index.css";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onLogin = (values) => {
    console.log(values);
    global.service
      .post("/api/login", {
        ...values,
        password: CryptoJs.AES.encrypt(values.password, "12345678").toString(),
      })
      .then((data) => {
        //
        this.setState({ logined: true });
        // sessionStorage.setItem('account',values.account)
        sessionStorage.setItem("token", data.token);
      });
  };
  render() {
    return (
      <div className="m-login">
        <Form onFinish={this.onLogin}>
          <h4>Log in</h4>
          <Form.Item
            name="account"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="your username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input
              type="password"
              prefix={<LockOutlined />}
              placeholder="your password"
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
        {this.state.logined && <Navigate to="/" />}
      </div>
    );
  }
}

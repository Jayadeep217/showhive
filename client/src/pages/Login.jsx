import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MailOutlined,
  LockOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { login } from "../api/auth.api.js";
import { setUserData } from "../redux/userSlice.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const loginResponse = await login(values.email, values.password);
      if (loginResponse.status === "success") {
        message.success("Login successful!");
        dispatch(setUserData(loginResponse.data));
        navigate("/home");
      } else {
        message.error(loginResponse.message || "Login failed!");
      }
    } catch (error) {
      message.error("Login failed!");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <VideoCameraOutlined className="auth-brand-icon" />
          <span className="auth-brand-name">ShowHive</span>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" block htmlType="submit">
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

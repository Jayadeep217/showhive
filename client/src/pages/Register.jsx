import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { register } from "../api/auth.api.js";

function Register() {
  const onSubmit = async (values) => {
    try {
      const registerResponse = await register(
        values.name,
        values.email,
        values.password,
      );
      if (registerResponse.status === "success") {
        message.success("Registration successful!");
      } else {
        message.error(registerResponse.message || "Registration failed!");
      }
    } catch (error) {
      message.error("Registration failed!");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <VideoCameraOutlined className="auth-brand-icon" />
          <span className="auth-brand-name">ShowHive</span>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join ShowHive today</p>

        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>

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
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

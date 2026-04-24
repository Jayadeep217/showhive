import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { register } from "../calls/auth.calls.js";

function Register() {
  const onSubmit = async (values) => {
    try {
      const registerResponse = await register(values.name, values.email, values.password);
      
      if (registerResponse.status === "success") {
        message.success("Registration successful!");
      }
      else {
        message.error(registerResponse.message || "Registration failed!");
      }
    } catch (error) {
      message.error("Registration failed!");
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <header className="App-header">
        <main className="main-area mw-500 text-center px-3">
          <section className="left-section">
            <h1>Register for ShowHive</h1>
          </section>

          <section className="right-section">
            <Form layout="vertical" onFinish={onSubmit}>
              <Form.Item
                label="Name"
                htmlFor="name"
                name="name"
                className="d-block"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your Name"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                className="d-block"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your Email"
                ></Input>
              </Form.Item>

              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                ></Input>
              </Form.Item>

              <Form.Item className="d-block">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            <div>
              <p>
                Already a User? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </section>
        </main>
      </header>
    </>
  );
}

export default Register;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Form, Input, message, Modal, Spin } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUser, requestOtp, updatePassword } from "../../api/auth.api.js";
import { useLogout } from "../../hooks/useLogout.js";
import { setUserData } from "../../redux/userSlice.js";

function ProfilePage() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(!userData);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUser();
        dispatch(setUserData(res.data || null));
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [dispatch]);

  const onLogout = useLogout();

  const handleRequestOtp = async () => {
    setOtpLoading(true);
    try {
      await requestOtp();
      setOtpSent(true);
      message.success(`OTP sent to ${userData?.email}`);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    setPwdLoading(true);
    try {
      await updatePassword(values.currentPassword, values.newPassword, values.otp);
      dispatch(setUserData(null));
      Modal.success({
        title: "Password Changed",
        content: "Your password has been updated. Please log in again.",
        okText: "Go to Login",
        onOk: () => navigate("/login"),
        maskClosable: false,
      });
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (loading) {
    return (
      <>
        <Navbar userData={userData} onLogout={onLogout} />
        <div className="booking-loading">
          <Spin size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="profile-page">
        <div className="profile-header">
          <button className="booking-back-btn" onClick={() => navigate("/home")}>
            <ArrowLeftOutlined /> Back
          </button>
          <h1 className="bookings-title">My Profile</h1>
        </div>

        <div className="profile-content">
          {/* Info card */}
          <div className="profile-card">
            <Avatar size={96} className="profile-avatar" icon={<UserOutlined />}>
              {initials}
            </Avatar>
            <div className="profile-info">
              <div className="profile-name">{userData?.name || "—"}</div>
              <div className="profile-email">{userData?.email || "—"}</div>
              <div className="profile-role-badge">{userData?.role || "user"}</div>
            </div>
          </div>

          {/* Change password card */}
          <div className="profile-pwd-card">
            <h2 className="profile-section-title">
              <LockOutlined /> Change Password
            </h2>

            <Form
              form={form}
              layout="vertical"
              onFinish={handlePasswordUpdate}
              className="profile-pwd-form"
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: "Enter your current password." }]}
              >
                <Input.Password placeholder="Current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Enter a new password." },
                  { min: 6, message: "Password must be at least 6 characters." },
                ]}
              >
                <Input.Password placeholder="New password" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your new password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match."));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              {!otpSent ? (
                <Button
                  icon={<MailOutlined />}
                  loading={otpLoading}
                  onClick={handleRequestOtp}
                  style={{ width: "100%" }}
                >
                  Send OTP to {userData?.email}
                </Button>
              ) : (
                <>
                  <Form.Item
                    label="Enter OTP"
                    name="otp"
                    rules={[
                      { required: true, message: "Enter the OTP sent to your email." },
                      { len: 6, message: "OTP must be 6 digits." },
                    ]}
                  >
                    <Input
                      placeholder="6-digit OTP"
                      maxLength={6}
                      style={{ letterSpacing: 6, fontSize: 18, textAlign: "center" }}
                    />
                  </Form.Item>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={pwdLoading}
                      className="booking-confirm-btn"
                      style={{ flex: 1 }}
                    >
                      Update Password
                    </Button>
                    <Button
                      loading={otpLoading}
                      onClick={handleRequestOtp}
                      style={{ flexShrink: 0 }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;

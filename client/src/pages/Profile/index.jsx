import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Form, Input, message, Modal, Spin } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updatePassword } from "../../api/auth.api.js";
import { setUserData } from "../../redux/userSlice.js";

function ProfilePage() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(!userData);
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

  const onLogout = () => {
    dispatch(setUserData(null));
    navigate("/login");
  };

  const handlePasswordUpdate = async (values) => {
    setPwdLoading(true);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      dispatch(setUserData(null));
      Modal.success({
        title: "Password Changed",
        content:
          "Your password has been updated. Please log in again with your new password.",
        okText: "Go to Login",
        onOk: () => navigate("/login"),
        maskClosable: false,
      });
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to update password.",
      );
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
          <button
            className="booking-back-btn"
            onClick={() => navigate("/home")}
          >
            <ArrowLeftOutlined /> Back
          </button>
          <h1 className="bookings-title">My Profile</h1>
        </div>

        <div className="profile-content">
          {/* Info card */}
          <div className="profile-card">
            <Avatar
              size={96}
              className="profile-avatar"
              icon={<UserOutlined />}
            >
              {initials}
            </Avatar>
            <div className="profile-info">
              <div className="profile-name">{userData?.name || "—"}</div>
              <div className="profile-email">{userData?.email || "—"}</div>
              <div className="profile-role-badge">
                {userData?.role || "user"}
              </div>
            </div>
          </div>

          {/* Update password card */}
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
                rules={[
                  { required: true, message: "Enter your current password." },
                ]}
              >
                <Input.Password placeholder="Current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Enter a new password." },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
              >
                <Input.Password placeholder="New password" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password.",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match."),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={pwdLoading}
                className="booking-confirm-btn"
                style={{ width: "100%" }}
              >
                Update Password
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;

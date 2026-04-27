import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../api/auth.calls.js";
import { setUserData } from "../redux/userSlice.js";

import { Layout, Input, Button, Avatar, Typography, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

function Home() {
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const data = await getUser();
      dispatch(setUserData(data.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
  };

  const displayName = userData?.name || "Guest";

  return (
    <Layout>
      <Header
        style={{
          background: "rgb(235, 78, 98)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        {/* Logo / Brand */}
        <Text strong style={{ fontSize: 18 }}>
          MyApp
        </Text>

        {/* Search Bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "0 20px",
          }}
        >
          <Input
            placeholder="Search..."
            onPressEnter={(e) => onSearch(e.target.value)}
            style={{ maxWidth: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        {/* User Info + Logout */}
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{displayName}</Text>
          <Button icon={<LogoutOutlined />} onClick={onLogout} type="default">
            Logout
          </Button>
        </Space>
      </Header>

      <div style={{ padding: 20 }}>{/* Page content */}</div>
    </Layout>
  );
}

export default Home;

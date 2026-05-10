import { Link } from "react-router-dom";
import { Layout, Input, Avatar, Typography, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  DownOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

function Navbar({ userData, onSearch, onLogout }) {
  const displayName = userData?.name || "Guest";
  const initials = displayName.charAt(0).toUpperCase();
  const dashboardPath = userData?.role === "admin" ? "/admin" : "/partner";
  const hasDashboard =
    userData?.role === "admin" || userData?.role === "partner";
  const menuItems = [
    ...(hasDashboard
      ? [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to={dashboardPath}>My Dashboard</Link>,
          },
          { type: "divider" },
        ]
      : []),
    ...(userData
      ? [
          {
            key: "profile",
            icon: <UserOutlined />,
            label: <Link to="/profile">My Profile</Link>,
          },
          {
            key: "bookings",
            icon: <BookOutlined />,
            label: <Link to="/bookings">My Bookings</Link>,
          },
          { type: "divider" },
        ]
      : []),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <Header className="app-navbar">
      {/* Logo */}
      <Link to="/home" className="navbar-logo">
        <VideoCameraOutlined className="navbar-logo-icon" />
        <span className="navbar-logo-text">ShowHive</span>
      </Link>

      {/* Search */}
      <div className="navbar-search-wrap">
        <Input
          placeholder="Search movies..."
          onPressEnter={(e) => onSearch?.(e.target.value)}
          prefix={<SearchOutlined className="navbar-search-icon" />}
          allowClear
          className="navbar-search"
        />
      </div>

      {/* User dropdown */}
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="navbar-user-pill">
          <Avatar
            className="navbar-avatar"
            icon={!userData ? <UserOutlined /> : null}
          >
            {userData ? initials : null}
          </Avatar>
          <Text className="navbar-username">{displayName}</Text>
          <DownOutlined className="navbar-chevron" />
        </div>
      </Dropdown>
    </Header>
  );
}

export default Navbar;

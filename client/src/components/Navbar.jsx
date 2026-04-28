import { Layout, Input, Button, Avatar, Typography, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

function Navbar({ userData, onSearch, onLogout }) {
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
        <Text strong style={{ fontSize: 18 }}>
          ShowHive
        </Text>

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

        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{displayName}</Text>
          <Button icon={<LogoutOutlined />} onClick={onLogout} type="default">
            Logout
          </Button>
        </Space>
      </Header>
    </Layout>
  );
}

export default Navbar;

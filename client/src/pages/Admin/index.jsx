import React from "react";
import { Tabs, Typography } from "antd";
import TheaterList from "./TheaterManagement.jsx";
import MovieManagement from "./MovieManagement.jsx";
import AppLayout from "../../components/AppLayout.jsx";

const { Title } = Typography;

function Admin() {
  const tabItems = [
    {
      key: "1",
      label: "Movie Management",
      children: <MovieManagement />,
    },
    {
      key: "2",
      label: "Theater Management",
      children: <TheaterList />,
    },
  ];
  return (
    <AppLayout>
      <Title level={3} style={{ marginBottom: 16 }}>
        Admin Dashboard
      </Title>
      <Tabs items={tabItems} />
    </AppLayout>
  );
}

export default Admin;

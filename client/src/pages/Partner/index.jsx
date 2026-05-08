import React from "react";
import { Tabs, Typography } from "antd";
import TheaterManagement from "./TheaterManagement";
import AppLayout from "../../components/AppLayout";

const { Title } = Typography;

function Partner() {
  const tabItems = [
    {
      key: "1",
      label: "Theater Management",
      children: <TheaterManagement />,
    },
  ];
  return (
    <AppLayout>
      <Title level={3} style={{ marginBottom: 16 }}>
        Partner Dashboard
      </Title>
      <Tabs items={tabItems} />
    </AppLayout>
  );
}
export default Partner;

import React from "react";

import { Tabs } from "antd";
import TheaterManagement from "./TheaterManagement";

function Partner() {
  const tabItems = [
    {
      key: "1",
      label: "Theater Management",
      children: <TheaterManagement />,
    },
  ];
  return (
    <>
      <div>
        <p>
          <b style={{ fontSize: "24px" }}>This is Partner Page</b> - Only
          accessible to partner users.
        </p>
        <Tabs items={tabItems} />
      </div>
    </>
  );
}
export default Partner;

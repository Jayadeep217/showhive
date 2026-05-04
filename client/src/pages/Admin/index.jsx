import React from "react";

import { Tabs } from "antd";
import TheaterList from "./TheaterManagement";
import MovieManagement from "./MovieManagement";

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
    <>
      <div>
        <p>
          <b style={{ fontSize: "24px" }}>This is Admin Page</b> - Only
          accessible to admin users.
        </p>
        <Tabs items={tabItems} />
      </div>
    </>
  );
}

export default Admin;

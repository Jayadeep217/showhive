import React from "react";

import { Tabs } from "antd";
import TheaterManagement from "./TheaterManagement";
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
      children: <TheaterManagement />,
    },
  ];
  return (
    <>
      <div>
        <h1>This is Admin Page</h1>
        <p>Only accessible to admin users.</p>
        <Tabs items={tabItems} />
      </div>
    </>
  );
}

export default Admin;

import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getAllTheatersAdmin, updateTheater } from "../../api/theater.api";

function TheaterManagement() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllTheatersAdmin();
      if (response.status === "success") {
        const allTheatres = response.theaters || [];
        setTheatres(
          allTheatres.map((item) => ({ ...item, key: `theatre${item._id}` })),
        );
      } else {
        message.error(response.message || "Failed to fetch theaters");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (theatre) => {
    try {
      const response = await updateTheater(theatre._id, {
        isActive: !theatre.isActive,
      });
      if (response.status === "success") {
        message.success(response.message);
        getData();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (_, data) => data.owner?.name || "-",
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, data) => (
        <span
          style={{ color: data.isActive ? "green" : "red", fontWeight: "bold" }}
        >
          {data.isActive ? "Approved" : "Pending / Blocked"}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, data) => (
        <div className="d-flex align-items-center gap-10">
          {data.isActive ? (
            <Button danger onClick={() => handleStatusChange(data)}>
              Block
            </Button>
          ) : (
            <Button type="primary" onClick={() => handleStatusChange(data)}>
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return <Table dataSource={theatres} columns={columns} loading={loading} />;
}

export default TheaterManagement;

import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getAllTheatersAdmin, updateTheater } from "../../api/theater.api";

function TheaterManagement() {
  const [theatres, setTheatres] = useState([]);

  const getData = async () => {
    try {
      const response = await getAllTheatersAdmin();
      if (response.status === "success") {
        const allTheatres = response.theaters || [];
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre${item._id}` };
          }),
        );
      } else {
        message.error(response.message, response.error);
      }
    } catch (err) {
      message.error(err.message);
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
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, data) => {
        console.log(text, data);        
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        if (data.isActive) {
          return "Approved";
        } else {
          return "Pending/ Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            {data.isActive ? (
              <Button onClick={() => handleStatusChange(data)}>Block</Button>
            ) : (
              <Button onClick={() => handleStatusChange(data)}>Approve</Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);
  return (
    <>
      {theatres && theatres.length > 0 && (
        <Table dataSource={theatres} columns={columns} />
      )}
    </>
  );
}

export default TheaterManagement;

import React, { useEffect, useState } from "react";
import { deleteTheater, getPartnerTheaters } from "../../api/theater.api";
import { Table, Button, notification, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TheaterForm from "./theaterForm";

function TheaterManagement() {
  const [theaters, setTheaters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pure fetch function (NO state updates)
  const fetchTheaters = async () => {
    try {
      const response = await getPartnerTheaters();
      return response?.theaters || [];
    } catch (error) {
      notification.error({
        title: "Fetch Failed",
        description: error.message,
      });
      return [];
    }
  };

  // State updater (used outside useEffect too)
  const loadTheaters = async () => {
    try {
      setLoading(true);
      const theatersData = await fetchTheaters();
      setTheaters(theatersData);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        setLoading(true);
        const theatersData = await fetchTheaters();

        if (!ignore) {
          setTheaters(theatersData);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (theater) => {
    try {
      await deleteTheater(theater._id);

      notification.success({
        title: "Theater Deleted",
        description: `"${theater.name}" deleted successfully.`,
      });

      await loadTheaters();
    } catch (error) {
      notification.error({
        title: "Delete Failed",
        description: error.message,
      });
    }
  };

  const handleAddTheater = () => {
    setFormType("add");
    setSelectedTheater(null);
    setIsModalOpen(true);
  };

  const handleEditTheater = (theater) => {
    setFormType("edit");
    setSelectedTheater(theater);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTheater(null);
    setFormType("add");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address`",
      dataIndex: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      render: (_, theater) => (
        <div className="d-flex gap-2">
          <Button onClick={() => handleEditTheater(theater)}>
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete Theater"
            description={`Are you sure you want to delete "${theater.name}"?`}
            onConfirm={() => handleDelete(theater)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button type="primary" onClick={handleAddTheater}>
          Add New Theater
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={theaters}
        loading={loading}
      />

      {isModalOpen && (
        <TheaterForm
          isModalOpen={isModalOpen}
          setIsModalOpen={handleCloseModal}
          formType={formType}
          selectedTheater={selectedTheater}
          refreshTheaters={loadTheaters}
        />
      )}
    </>
  );
}

export default TheaterManagement;

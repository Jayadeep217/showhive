import React, { useEffect, useState, useCallback } from "react";
import { Modal, Table, Button, notification, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getShowsByTheater, deleteShow } from "../../api/show.api";
import ShowForm from "./ShowForm";
import moment from "moment";

function ShowsModal({ isModalOpen, onCancel, theater }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedShow, setSelectedShow] = useState(null);

  const fetchShows = useCallback(async () => {
    if (!theater?._id) return;
    try {
      setLoading(true);
      const response = await getShowsByTheater(theater._id);
      setShows(response?.shows || []);
    } catch (error) {
      notification.error({
        message: "Failed to load shows",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [theater]);
  
  useEffect(() => {
    if (!isModalOpen) return;

    const loadShows = async () => {
      await fetchShows();
    };

    loadShows();
  }, [isModalOpen, fetchShows]);

  const handleDelete = async (show) => {
    try {
      await deleteShow(show._id);
      notification.success({ message: `"${show.name}" deleted successfully` });
      fetchShows();
    } catch (error) {
      notification.error({
        message: "Delete failed",
        description: error.message,
      });
    }
  };

  const handleAddShow = () => {
    setFormType("add");
    setSelectedShow(null);
    setIsFormOpen(true);
  };

  const handleEditShow = (show) => {
    setFormType("edit");
    setSelectedShow(show);
    setIsFormOpen(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (movie) => movie?.title || "-",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => moment(date).format("DD MMM YYYY"),
    },
    { title: "Time", dataIndex: "time" },
    { title: "Total Seats", dataIndex: "totalSeats" },
    {
      title: "Booked",
      dataIndex: "bookedSeats",
      render: (seats) => seats?.length || 0,
    },
    {
      title: "Price",
      dataIndex: "ticketPrice",
      render: (price) => `₹${price}`,
    },
    {
      title: "Actions",
      render: (_, show) => (
        <div className="d-flex gap-2">
          <Button onClick={() => handleEditShow(show)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete Show"
            description={`Are you sure you want to delete "${show.name}"?`}
            onConfirm={() => handleDelete(show)}
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
      <Modal
        title={`Shows — ${theater?.name || ""}`}
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <div className="d-flex justify-content-end mb-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddShow}
          >
            Add Show
          </Button>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={shows}
          loading={loading}
        />
      </Modal>

      {isFormOpen && (
        <ShowForm
          isModalOpen={isFormOpen}
          onCancel={() => setIsFormOpen(false)}
          formType={formType}
          selectedShow={selectedShow}
          theater={theater}
          refreshShows={fetchShows}
        />
      )}
    </>
  );
}

export default ShowsModal;

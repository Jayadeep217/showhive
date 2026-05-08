import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
} from "antd";
import { getAllMovies } from "../../api/movie.api";
import { createShow, updateShow } from "../../api/show.api";
import dayjs from "dayjs";

function ShowForm({
  isModalOpen,
  onCancel,
  formType,
  selectedShow,
  theater,
  refreshShows,
}) {
  const [form] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getAllMovies();
        setMovies(response?.movies || []);
      } catch {
        message.error("Failed to load movies");
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedShow) {
      form.setFieldsValue({
        ...selectedShow,
        movie: selectedShow.movie?._id || selectedShow.movie,
        date: selectedShow.date ? dayjs(selectedShow.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [formType, selectedShow, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        date: values.date?.toISOString(),
        theater: theater._id,
      };

      const actionMap = {
        add: () => createShow(payload),
        edit: () => updateShow(selectedShow._id, payload),
      };

      const response = await actionMap[formType]();

      if (response.status === "success") {
        message.success(
          formType === "add" ? "Show added successfully!" : "Show updated successfully!",
        );
        form.resetFields();
        onCancel();
        await refreshShows();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "Add Show" : "Edit Show"}
      open={isModalOpen}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={formType === "add" ? "Add" : "Update"}
      cancelText="Close"
      onOk={form.submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Show Name"
              name="name"
              rules={[{ required: true, message: "Please enter show name" }]}
            >
              <Input placeholder="e.g. Morning Show" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Movie"
              name="movie"
              rules={[{ required: true, message: "Please select a movie" }]}
            >
              <Select
                showSearch
                placeholder="Select a movie"
                options={movies.map((m) => ({ value: m._id, label: m.title }))}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: "Please enter show time" }]}
            >
              <Input placeholder="e.g. 10:00 AM" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Total Seats"
              name="totalSeats"
              rules={[{ required: true, message: "Please enter total seats" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ticket Price (₹)"
              name="ticketPrice"
              rules={[{ required: true, message: "Please enter ticket price" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ShowForm;

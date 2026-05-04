import React, { useEffect } from "react";
import { Modal, Form, Row, Col, Input, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { addNewMovie, updateMovie } from "../../api/movie.api";

function MovieForm({
  isModalOpen,
  setIsModalOpen,
  formType,
  selectedMovie,
  refreshMovies,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formType === "edit" && selectedMovie) {
      form.setFieldsValue({
        ...selectedMovie,
        releaseDate: selectedMovie.releaseDate?.split("T")[0],
      });
    } else {
      form.resetFields();
    }
  }, [formType, selectedMovie, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        duration: Number(values.duration),
        ...(values.ratings && { ratings: Number(values.ratings) }),
      };

      const actionMap = {
        add: () => addNewMovie(payload),
        edit: () => updateMovie(selectedMovie._id, payload),
      };

      const response = await actionMap[formType]();

      if (response.status === "success") {
        message.success(
          formType === "add"
            ? "Movie added successfully!"
            : "Movie updated successfully!",
        );

        form.resetFields();
        setIsModalOpen();
        await refreshMovies();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={() => {
        form.resetFields();
        setIsModalOpen();
      }}
      okText={formType === "add" ? "Add" : "Update"}
      cancelText="Close"
      onOk={form.submit}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true, message: "Please enter movie title" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Duration (min)"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: "Please select a language" }]}
            >
              <Select
                placeholder="Select Language"
                options={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Punjabi", label: "Punjabi" },
                  { value: "Telugu", label: "Telugu" },
                  { value: "Bengali", label: "Bengali" },
                  { value: "German", label: "German" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[{ required: true, message: "Please select release date" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: true, message: "Please select a genre" }]}
            >
              <Select
                placeholder="Select Genre"
                options={[
                  { value: "Action", label: "Action" },
                  { value: "Comedy", label: "Comedy" },
                  { value: "Horror", label: "Horror" },
                  { value: "Love", label: "Love" },
                  { value: "Patriot", label: "Patriot" },
                  { value: "Bhakti", label: "Bhakti" },
                  { value: "Thriller", label: "Thriller" },
                  { value: "Mystery", label: "Mystery" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Ratings (0–10)"
              name="ratings"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 10,
                  transform: (v) => (v ? Number(v) : v),
                  message: "Rating must be between 0 and 10",
                },
              ]}
            >
              <Input type="number" min={0} max={10} step={0.1} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Poster URL"
              name="posterPath"
              rules={[{ required: true, message: "Please enter poster URL" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default MovieForm;

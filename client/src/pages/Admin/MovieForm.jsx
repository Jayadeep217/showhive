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
      onOk={form.submit}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Genre" name="genre" rules={[{ required: true }]}>
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

          <Col span={16}>
            <Form.Item
              label="Poster URL"
              name="posterPath"
              rules={[{ required: true }]}
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

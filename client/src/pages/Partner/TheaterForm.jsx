import React, { useEffect } from "react";
import { Modal, Form, Row, Col, Input, message } from "antd";
import { addNewTheater, updateTheater } from "../../api/theater.api";

function TheaterForm({
  isModalOpen,
  setIsModalOpen,
  formType,
  selectedTheater,
  refreshTheaters,
  ownerId,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formType === "edit" && selectedTheater) {
      form.setFieldsValue({ ...selectedTheater });
    } else {
      form.resetFields();
    }
  }, [formType, selectedTheater, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        ...(formType === "add" && { owner: ownerId }),
      };

      const actionMap = {
        add: () => addNewTheater(payload),
        edit: () => updateTheater(selectedTheater._id, payload),
      };

      const response = await actionMap[formType]();

      if (response.status === "success") {
        message.success(
          formType === "add"
            ? "Theater added successfully!"
            : "Theater updated successfully!",
        );

        form.resetFields();
        setIsModalOpen();
        await refreshTheaters();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      title={formType === "add" ? "Add Theater" : "Edit Theater"}
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
              label="Theater Name"
              name="name"
              rules={[{ required: true, message: "Please enter theater name" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default TheaterForm;

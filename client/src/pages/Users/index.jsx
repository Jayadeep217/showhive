import React, { useEffect, useState } from "react";
import { Table, Select, message, Modal, Tag } from "antd";
import { getAllUsers, updateUserRole } from "../../api/auth.api.js";
import dayjs from "dayjs";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "partner", label: "Partner" },
  { value: "admin", label: "Admin" },
];

const ROLE_COLOR = {
  admin: "volcano",
  partner: "geekblue",
  user: "default",
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.status === "success") {
        setUsers(res.users.map((u) => ({ ...u, key: u._id })));
      } else {
        message.error(res.message || "Failed to fetch users");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (record, newRole) => {
    if (newRole === record.role) return;
    Modal.confirm({
      title: "Change role?",
      content: `Set "${record.name}" as ${newRole}?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        setUpdatingId(record._id);
        try {
          const res = await updateUserRole(record._id, newRole);
          if (res.status === "success") {
            message.success("Role updated");
            setUsers((prev) =>
              prev.map((u) =>
                u._id === record._id ? { ...u, role: newRole } : u,
              ),
            );
          } else {
            message.error(res.message || "Failed to update role");
          }
        } catch (err) {
          message.error(err.response?.data?.message || "Failed to update role");
        } finally {
          setUpdatingId(null);
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={ROLE_COLOR[role]}>{role.toUpperCase()}</Tag>
      ),
      filters: [
        { text: "User", value: "user" },
        { text: "Partner", value: "partner" },
        { text: "Admin", value: "admin" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("D MMM YYYY") : "—"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Change Role",
      key: "action",
      render: (_, record) => (
        <Select
          value={record.role}
          options={ROLE_OPTIONS}
          style={{ width: 110 }}
          loading={updatingId === record._id}
          disabled={updatingId === record._id}
          onChange={(newRole) => handleRoleChange(record, newRole)}
        />
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
}

export default UserManagement;

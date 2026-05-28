import axios from "axios";

import {
  API_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
  USER_URL,
  REQUEST_OTP_URL,
  UPDATE_PASSWORD_URL,
  ALL_USERS_URL,
  UPDATE_USER_ROLE_URL,
} from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await api.post(LOGIN_URL, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post(REGISTER_URL, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await api.get(USER_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post(LOGOUT_URL);
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const requestOtp = async () => {
  try {
    const response = await api.post(REQUEST_OTP_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword, otp) => {
  try {
    const response = await api.put(UPDATE_PASSWORD_URL, {
      currentPassword,
      newPassword,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get(ALL_USERS_URL);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(UPDATE_USER_ROLE_URL(id), { role });
    return response.data;
  } catch (error) {
    console.error("Update user role error:", error);
    throw error;
  }
};

import axios from "axios";

import {
  API_URL,
  LOGIN_URL,
  REGISTER_URL,
  USER_URL,
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
    const response = await api.get(USER_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

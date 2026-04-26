import axios from "axios";
import { API_URL } from "./api.config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", {
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
    const response = await api.get("/auth/getuser", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

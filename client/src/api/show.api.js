import axios from "axios";
import {
  API_URL,
  ALL_SHOWS_URL,
  ADD_SHOW_URL,
  GET_SHOW_URL,
  GET_SHOWS_BY_THEATER_URL,
  UPDATE_SHOW_URL,
  DELETE_SHOW_URL,
} from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllShows = async () => {
  try {
    const response = await api.get(ALL_SHOWS_URL);
    return response.data;
  } catch (error) {
    console.error("Get all shows error:", error);
    throw error;
  }
};

export const getShowsByTheater = async (theaterId) => {
  try {
    const response = await api.get(GET_SHOWS_BY_THEATER_URL(theaterId));
    return response.data;
  } catch (error) {
    console.error("Get shows by theater error:", error);
    throw error;
  }
};

export const getShowById = async (showId) => {
  try {
    const response = await api.get(GET_SHOW_URL(showId));
    return response.data;
  } catch (error) {
    console.error("Get show by ID error:", error);
    throw error;
  }
};

export const createShow = async (showData) => {
  try {
    const response = await api.post(ADD_SHOW_URL, showData);
    return response.data;
  } catch (error) {
    console.error("Create show error:", error);
    throw error;
  }
};

export const updateShow = async (showId, showData) => {
  try {
    const response = await api.put(UPDATE_SHOW_URL(showId), showData);
    return response.data;
  } catch (error) {
    console.error("Update show error:", error);
    throw error;
  }
};

export const deleteShow = async (showId) => {
  try {
    const response = await api.delete(DELETE_SHOW_URL(showId));
    return response.data;
  } catch (error) {
    console.error("Delete show error:", error);
    throw error;
  }
};

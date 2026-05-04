import axios from "axios";
import {
  API_URL,
  ALL_THEATERS_URL,
  PARTNER_THEATERS_URL,
  ADD_THEATER_URL,
  GET_THEATER_URL,
  UPDATE_THEATER_URL,
  DELETE_THEATER_URL,
} from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllTheatersAdmin = async () => {
  try {
    const response = await api.get(ALL_THEATERS_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get all theaters error:", error);
    throw error;
  }
};

export const getPartnerTheaters = async (ownerId) => {
  try {
    const response = await api.get(PARTNER_THEATERS_URL(ownerId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get partner theaters error:", error);
    throw error;
  }
};

export const getTheaterById = async (theaterId) => {
  try {
    const response = await api.get(GET_THEATER_URL(theaterId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get theater by ID error:", error);
    throw error;
  }
};

export const addNewTheater = async (newTheaterData) => {
  try {
    const response = await api.post(ADD_THEATER_URL, newTheaterData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Add new theater error:", error);
    throw error;
  }
};

export const updateTheater = async (theaterId, updatedTheaterData) => {
  try {
    const response = await api.put(
      UPDATE_THEATER_URL(theaterId),
      updatedTheaterData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Update theater error:", error);
    throw error;
  }
};

export const deleteTheater = async (theaterId) => {
  try {
    const response = await api.delete(DELETE_THEATER_URL(theaterId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete theater error:", error);
    throw error;
  }
};

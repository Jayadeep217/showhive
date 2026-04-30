import axios from "axios";
import {
  API_URL,
  ALL_MOVIES_URL,
  ADD_MOVIE_URL,
} from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllMovies = async () => {
  try {
    const response = await api.get(ALL_MOVIES_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get all movies error:", error);
    throw error;
  }
};

export const addNewMovie = async (newMovieData) => {
  try {
    const response = await api.post(ADD_MOVIE_URL, newMovieData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Add new movie error:", error);
    throw error;
  }
};

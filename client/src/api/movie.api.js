import axios from "axios";
import {
  API_URL,
  ALL_MOVIES_URL,
  ADD_MOVIE_URL,
  GET_MOVIE_URL,
  UPDATE_MOVIE_URL,
  DELETE_MOVIE_URL,
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

export const getMovieById = async (movieId) => {
  try {
    const response = await api.get(GET_MOVIE_URL(movieId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get movie by ID error:", error);
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

export const updateMovie = async (movieId, updatedMovieData) => {
  try {
    const response = await api.put(UPDATE_MOVIE_URL(movieId), updatedMovieData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Update movie error:", error);
    throw error;
  }
};

export const deleteMovie = async (movieId) => {
  try {
    const response = await api.delete(DELETE_MOVIE_URL(movieId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete movie error:", error);
    throw error;
  }
};

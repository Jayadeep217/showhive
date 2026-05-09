import axios from "axios";
import {
  API_URL,
  CREATE_BOOKING_URL,
  GET_USER_BOOKINGS_URL,
} from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post(CREATE_BOOKING_URL, bookingData);
    return response.data;
  } catch (error) {
    console.error("Create booking error:", error);
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get(GET_USER_BOOKINGS_URL);
    return response.data;
  } catch (error) {
    console.error("Get user bookings error:", error);
    throw error;
  }
};

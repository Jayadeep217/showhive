import axios from "axios";
import {
  API_URL,
  CREATE_BOOKING_URL,
  GET_USER_BOOKINGS_URL,
  CREATE_ORDER_URL,
  VERIFY_PAYMENT_URL,
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

export const createOrder = async (orderData) => {
  try {
    const response = await api.post(CREATE_ORDER_URL, orderData);
    return response.data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post(VERIFY_PAYMENT_URL, paymentData);
    return response.data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};

export const API_URL = "http://localhost:54325/api";

export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const LOGOUT_URL = "/auth/logout";
export const USER_URL = "/auth/user";
export const REQUEST_OTP_URL = "/auth/otp/request";
export const UPDATE_PASSWORD_URL = "/auth/password";

export const ALL_MOVIES_URL = "/movies/all";
export const ADD_MOVIE_URL = "/movies/create";
export const GET_MOVIE_URL = (id) => `/movies/${id}`;
export const UPDATE_MOVIE_URL = (id) => `/movies/update/${id}`;
export const DELETE_MOVIE_URL = (id) => `/movies/delete/${id}`;

export const ALL_THEATERS_URL = "/theaters/all";
export const PARTNER_THEATERS_URL = "/theaters/partner/my";
export const ADD_THEATER_URL = "/theaters/create";
export const GET_THEATER_URL = (id) => `/theaters/${id}`;
export const UPDATE_THEATER_URL = (id) => `/theaters/update/${id}`;
export const DELETE_THEATER_URL = (id) => `/theaters/delete/${id}`;

export const ALL_SHOWS_URL = "/shows/all";
export const ADD_SHOW_URL = "/shows/create";
export const GET_SHOW_URL = (id) => `/shows/${id}`;
export const GET_SHOWS_BY_THEATER_URL = (theaterId) =>
  `/shows/theater/${theaterId}`;
export const GET_SHOWS_BY_MOVIE_URL = "/shows/allTheatersbyMovie";
export const UPDATE_SHOW_URL = (id) => `/shows/update/${id}`;
export const DELETE_SHOW_URL = (id) => `/shows/delete/${id}`;

export const CREATE_BOOKING_URL = "/bookings/create";
export const GET_USER_BOOKINGS_URL = "/bookings/user";
export const CREATE_ORDER_URL = "/bookings/create-order";
export const VERIFY_PAYMENT_URL = "/bookings/verify-payment";

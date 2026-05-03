export const API_URL = "http://localhost:54325/api";

export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const USER_URL = "/auth/user";

export const ALL_MOVIES_URL = "/movies/all";
export const ADD_MOVIE_URL = "/movies/create";
export const GET_MOVIE_URL = (id) => `/movies/${id}`;
export const UPDATE_MOVIE_URL = (id) => `/movies/update/${id}`;
export const DELETE_MOVIE_URL = (id) => `/movies/delete/${id}`;

export const ALL_THEATERS_URL = "/theaters/all";
export const ADD_THEATER_URL = "/theaters/create";
export const GET_THEATER_URL = (id) => `/theaters/${id}`;
export const GET_PARTNER_THEATERS_URL = (id) => `/theaters/${id}`;
export const UPDATE_THEATER_URL = (id) => `/theaters/update/${id}`;
export const DELETE_THEATER_URL = (id) => `/theaters/delete/${id}`;

export const ALL_SHOWS_URL = "/shows/all";
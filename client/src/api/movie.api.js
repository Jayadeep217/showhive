import axios from "axios";
import { API_URL } from "../config/api.config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


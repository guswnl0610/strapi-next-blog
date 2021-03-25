import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:1337/",
  timeout: 100000,
});

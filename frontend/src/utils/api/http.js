import axios from "axios";

const http = axios.create({
  baseURL: "/api", // Membaca proxy dari vite.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
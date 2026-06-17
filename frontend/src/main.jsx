import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // 🔑 Setup Router dari Silva [cite: 25]

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Membungkus App agar URL browser bisa dikontrol [cite: 28, 33] */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
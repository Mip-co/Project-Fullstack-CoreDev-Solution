import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // 🔑 Menghubungkan master global state context

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 🔑 Membungkus seluruh aplikasi agar useAuth() aktif di semua halaman */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// app.js (Root Folder)
const express = require("express");
const app = express();
const router = require("./routes/api"); // Import router [cite: 428]

app.use(express.json()); // Middleware agar bisa baca JSON [cite: 491]
app.use(express.urlencoded({ extended: true })); 

app.use(router); // Gunakan router 

app.listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
});
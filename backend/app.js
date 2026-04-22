const express = require("express");
const app = express();

const router = require("./routes/api");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route utama
app.use("/api", router);

// server
app.listen(3000, () => {
  console.log("Server running at: http://localhost:3000");
});
const express = require("express");
const app = express();
const cors = require("cors");

// API imports
const userRoutes = require("./routes/user.route.js");
const attendanceRoutes = require("./routes/attendance.route.js");
const dailySummaryRoutes = require("./routes/dailySummary.route.js");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use("/api", userRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", dailySummaryRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Running" });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

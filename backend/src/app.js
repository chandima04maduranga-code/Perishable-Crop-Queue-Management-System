const express = require("express");
const cors = require("cors");

const cropRoutes = require("./routes/cropRoutes");

const distributionRoutes = require(
  "./routes/distributionRoutes"
);

const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);

const errorHandler = require(
  "./middleware/errorHandler"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    application:
      "Perishable Crop Queue Management System",
    developers: ["Chandima", "Nikarsan"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
  });
});

app.use("/api/crops", cropRoutes);

app.use(
  "/api/distributions",
  distributionRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(errorHandler);

module.exports = app;
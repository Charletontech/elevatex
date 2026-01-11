const express = require("express");
const path = require("path");
const models = require("./models");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const transactionRoutes = require("./routes/transaction.routes");
const loanRoutes = require("./routes/loan.routes");
const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notification.routes");
const investmentRoutes = require("./routes/investment.routes.js");
//require("./cron-jobs-process.js");
const Database = require("./loaders/database");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Mount authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/investments", investmentRoutes);

// Simple API endpoint for testing
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Serve the index.html file for the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handlers to debug "clean exit"
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

const startServer = async () => {
  try {
    // connect database
    await Database.connect();

    // synchronize database
    // await Database.sync();

    // start running server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

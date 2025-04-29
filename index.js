import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import cors from "cors";

// Import your routes
import userRoutes from "./Routes/userRote.js";
import productRoutes from "./Routes/productRoutes.js";

import { swaggerUi, swaggerSpec } from "./swagger.js";

// Configure environment
dotenv.config();

// Connect to MongoDB
connectDB();

// App setup
const app = express();
const PORT = process.env.PORT;

// Swagger Docs Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/user", userRoutes); // example: /api/user/register, /api/user/login
app.use("/api/products", productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

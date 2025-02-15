import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", orderRoutes);
app.use("/api", productRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

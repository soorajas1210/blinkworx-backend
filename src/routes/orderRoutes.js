import express from "express";
import {
  addNewOrder,
  getOrder,
  getOrderById,
  removeOrderById,
  updateOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/order", getOrder);
router.get("/order/:id", getOrderById);
router.post("/orders", addNewOrder);
router.put("/orders/:id", updateOrderById);
router.delete("/orders/:id", removeOrderById);

export default router;

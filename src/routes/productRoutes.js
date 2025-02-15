import express from "express";
import {
  addNewProduct,
  getProducts,
  removeProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add-product", addNewProduct);
router.get("/products", getProducts);
router.delete("/products/:id", removeProductById);

export default router;

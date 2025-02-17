import express from "express";
import {
  addToCart,
  getCarts,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController";

const router = express.Router();

router.get("/:userId", getCarts);
router.post("/", addToCart);
router.put("/cart/:itemId", updateCartItem);
router.delete("/cart/:itemId", removeFromCart);

export default router;

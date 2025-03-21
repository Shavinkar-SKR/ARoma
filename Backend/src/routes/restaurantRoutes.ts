import * as express from "express";
import {
  getAllRestaurants,
  searchRestaurants,
  getRestaurantById,
} from "../controllers/restaurantController";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/search", searchRestaurants);
router.get("/:restaurantId", getRestaurantById);

export default router;

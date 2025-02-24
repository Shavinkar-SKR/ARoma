import * as express from "express";
import {
  getAllRestaurants,
  searchRestaurants,
} from "../controllers/restaurantController";

const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/search", searchRestaurants);

export default router;

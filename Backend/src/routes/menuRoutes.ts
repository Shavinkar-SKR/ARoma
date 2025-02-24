import * as express from "express";
import {
  getMenuByRestaurant,
  searchMenuItems,
} from "../controllers/menuController";

const router = express.Router();

router.get("/:restaurantId", getMenuByRestaurant);
router.get("/search", searchMenuItems);

export default router;

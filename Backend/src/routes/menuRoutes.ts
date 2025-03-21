import * as express from "express";
import {
  getMenu,
  getMenuByRestaurant,
  searchMenuItems,
} from "../controllers/menuController";

const router = express.Router();

router.get("/", getMenu);
router.get("/search", searchMenuItems);
router.get("/:restaurantId", getMenuByRestaurant);

export default router;

import express from "express";
import {
  getAllRestaurants,
  searchRestaurants,
} from "../controllers/restaurantController.js";

//const express = require("express");
const router = express.Router();

router.get("/", getAllRestaurants);
router.get("/search", searchRestaurants);

export default router;

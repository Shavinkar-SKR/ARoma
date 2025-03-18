"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurantmenuController_1 = require("../controllers/restaurantmenuController");
const router = (0, express_1.Router)();
// routes/restaurantMenuRoutes.ts
// Add this new route
router.get("/menus/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.getMenuItemById)(req, res);
    }
    catch (error) {
        console.error("Error fetching menu item:", error);
        res.status(500).json({ message: 'Error fetching menu item' });
    }
}));
// Get all restaurants with their menus
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.getAllRestaurantsWithMenus)(req, res);
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get single restaurant with its menu
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.getRestaurantWithMenu)(req, res);
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Add menu item to specific restaurant
router.post("/:id/menus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.addMenuItemToRestaurant)(req, res);
    }
    catch (error) {
        console.error("Error creating menu item:", error);
        res.status(500).json({ message: 'Error creating menu item' });
    }
}));
// Update menu item
router.put("/menus/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.updateMenuItem)(req, res);
    }
    catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({ message: 'Error updating menu item' });
    }
}));
// Delete menu itema
router.delete("/menus/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, restaurantmenuController_1.deleteMenuItem)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({ message: 'Error deleting menu item' });
    }
}));
exports.default = router;

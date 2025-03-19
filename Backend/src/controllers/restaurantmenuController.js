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
exports.getMenuItemById = exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItemToRestaurant = exports.addMenuItem = exports.getRestaurantWithMenu = exports.getAllRestaurantsWithMenus = void 0;
const dbConfig_1 = require("../config/dbConfig"); // Adjust path as needed
const mongodb_1 = require("mongodb");
// Fetch all restaurants and their menu items
const getAllRestaurantsWithMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Fetch all restaurants
        const restaurants = yield db.collection("restaurants").find().toArray();
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found" });
        }
        // Fetch menu items for each restaurant
        const restaurantsWithMenus = yield Promise.all(restaurants.map((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
            const menuItems = yield db.collection("menus").find({ restaurantId: restaurant._id.toString() }).toArray();
            return Object.assign(Object.assign({}, restaurant), { menuItems });
        })));
        return res.json(restaurantsWithMenus);
    }
    catch (error) {
        console.error("Error fetching restaurants and menus:", error);
        return res.status(500).json({ message: "Error fetching restaurants and menus" });
    }
});
exports.getAllRestaurantsWithMenus = getAllRestaurantsWithMenus;
// Delete an existing menu item by ID
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Delete the menu item by ID
        const result = yield db.collection("menus").deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.status(200).json({ message: "Menu item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting menu item:", error);
        return res.status(500).json({ message: "Error deleting menu item" });
    }
});
exports.deleteMenuItem = deleteMenuItem;
// Fetch a specific restaurant by ID and its menu items
const getRestaurantWithMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Fetch restaurant details by ID
        const restaurant = yield db.collection("restaurants").findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Fetch the menu items for this restaurant
        const menuItems = yield db.collection("menus").find({
            restaurantId: id // restaurantId is a string
        }).toArray();
        return res.json({
            restaurant,
            menuItems,
        });
    }
    catch (error) {
        console.error("Error fetching restaurant and menu:", error);
        return res.status(500).json({ message: "Error fetching restaurant and menu" });
    }
});
exports.getRestaurantWithMenu = getRestaurantWithMenu;
// Fetch a specific menu item by ID
const getMenuItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const menuItem = yield db.collection("menus").findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.json(menuItem);
    }
    catch (error) {
        console.error("Error fetching menu item:", error);
        return res.status(500).json({ message: "Error fetching menu item" });
    }
});
exports.getMenuItemById = getMenuItemById;
// Add a new menu item to the system
const addMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, image, category, restaurantId, dietary, hasARPreview } = req.body;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Create the new menu item object with the provided fields
        const newMenuItem = {
            name: name,
            description: description,
            price: parseFloat(price), // Ensure price is a double
            image: image,
            category: category,
            restaurantId: restaurantId, // restaurantId is a string
            dietary: {
                isVegan: dietary.isVegan,
                isNutFree: dietary.isNutFree,
                isGlutenFree: dietary.isGlutenFree,
            },
            hasARPreview: hasARPreview,
        };
        // Insert the new menu item into the "menus" collection
        const result = yield db.collection("menus").insertOne(newMenuItem);
        return res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId });
    }
    catch (error) {
        console.error("Error adding menu item:", error);
        return res.status(500).json({ message: "Error adding menu item" });
    }
});
exports.addMenuItem = addMenuItem;
// Add a new menu item to a specific restaurant by its ID
const addMenuItemToRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price, image, category, dietary, hasARPreview } = req.body;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Create the new menu item object with the provided fields
        const newMenuItem = {
            name: name,
            description: description,
            price: parseFloat(price), // Ensure price is a double
            image: image,
            category: category,
            restaurantId: id, // Use the restaurant ID from the route parameter
            dietary: {
                isVegan: dietary.isVegan,
                isNutFree: dietary.isNutFree,
                isGlutenFree: dietary.isGlutenFree,
            },
            hasARPreview: hasARPreview,
        };
        // Insert the new menu item into the "menus" collection
        const result = yield db.collection("menus").insertOne(newMenuItem);
        return res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId });
    }
    catch (error) {
        console.error("Error adding menu item:", error);
        return res.status(500).json({ message: "Error adding menu item" });
    }
});
exports.addMenuItemToRestaurant = addMenuItemToRestaurant;
// Update an existing menu item
const updateMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price, image, category, dietary, hasARPreview } = req.body;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        // Create an update object with the provided fields
        const updateFields = {};
        if (name)
            updateFields.name = name;
        if (description)
            updateFields.description = description;
        if (price)
            updateFields.price = parseFloat(price); // Ensure price is a double
        if (image)
            updateFields.image = image;
        if (category)
            updateFields.category = category;
        if (dietary) {
            updateFields.dietary = {
                isVegan: dietary.isVegan,
                isNutFree: dietary.isNutFree,
                isGlutenFree: dietary.isGlutenFree,
            };
        }
        if (hasARPreview !== undefined)
            updateFields.hasARPreview = hasARPreview; // To handle boolean values correctly
        // Update the menu item in the "menus" collection
        const result = yield db.collection("menus").updateOne({ _id: new mongodb_1.ObjectId(id) }, // Find the menu item by ID
        { $set: updateFields } // Update only the specified fields
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.status(200).json({ message: "Menu item updated successfully" });
    }
    catch (error) {
        console.error("Error updating menu item:", error);
        return res.status(500).json({ message: "Error updating menu item" });
    }
});
exports.updateMenuItem = updateMenuItem;

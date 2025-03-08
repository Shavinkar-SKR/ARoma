"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuItemById = exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItemToRestaurant = exports.addMenuItem = exports.getRestaurantWithMenu = exports.getAllRestaurantsWithMenus = void 0;
var dbConfig_1 = require("../config/dbConfig"); // Adjust path as needed
var mongodb_1 = require("mongodb");
// Fetch all restaurants and their menu items
var getAllRestaurantsWithMenus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_1, restaurants, restaurantsWithMenus, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db_1 = _a.sent();
                return [4 /*yield*/, db_1.collection("restaurants").find().toArray()];
            case 2:
                restaurants = _a.sent();
                if (restaurants.length === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "No restaurants found" })];
                }
                return [4 /*yield*/, Promise.all(restaurants.map(function (restaurant) { return __awaiter(void 0, void 0, void 0, function () {
                        var menuItems;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db_1.collection("menus").find({ restaurantId: restaurant._id.toString() }).toArray()];
                                case 1:
                                    menuItems = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, restaurant), { menuItems: menuItems })];
                            }
                        });
                    }); }))];
            case 3:
                restaurantsWithMenus = _a.sent();
                return [2 /*return*/, res.json(restaurantsWithMenus)];
            case 4:
                error_1 = _a.sent();
                console.error("Error fetching restaurants and menus:", error_1);
                return [2 /*return*/, res.status(500).json({ message: "Error fetching restaurants and menus" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllRestaurantsWithMenus = getAllRestaurantsWithMenus;
// Delete an existing menu item by ID
var deleteMenuItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, db, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                return [4 /*yield*/, db.collection("menus").deleteOne({ _id: new mongodb_1.ObjectId(id) })];
            case 3:
                result = _a.sent();
                if (result.deletedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Menu item not found" })];
                }
                return [2 /*return*/, res.status(200).json({ message: "Menu item deleted successfully" })];
            case 4:
                error_2 = _a.sent();
                console.error("Error deleting menu item:", error_2);
                return [2 /*return*/, res.status(500).json({ message: "Error deleting menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteMenuItem = deleteMenuItem;
// Fetch a specific restaurant by ID and its menu items
var getRestaurantWithMenu = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, db, restaurant, menuItems, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                return [4 /*yield*/, db.collection("restaurants").findOne({ _id: new mongodb_1.ObjectId(id) })];
            case 3:
                restaurant = _a.sent();
                if (!restaurant) {
                    return [2 /*return*/, res.status(404).json({ message: "Restaurant not found" })];
                }
                return [4 /*yield*/, db.collection("menus").find({
                        restaurantId: id // restaurantId is a string
                    }).toArray()];
            case 4:
                menuItems = _a.sent();
                return [2 /*return*/, res.json({
                        restaurant: restaurant,
                        menuItems: menuItems,
                    })];
            case 5:
                error_3 = _a.sent();
                console.error("Error fetching restaurant and menu:", error_3);
                return [2 /*return*/, res.status(500).json({ message: "Error fetching restaurant and menu" })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getRestaurantWithMenu = getRestaurantWithMenu;
// Fetch a specific menu item by ID
var getMenuItemById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, db, menuItem, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                return [4 /*yield*/, db.collection("menus").findOne({ _id: new mongodb_1.ObjectId(id) })];
            case 3:
                menuItem = _a.sent();
                if (!menuItem) {
                    return [2 /*return*/, res.status(404).json({ message: "Menu item not found" })];
                }
                return [2 /*return*/, res.json(menuItem)];
            case 4:
                error_4 = _a.sent();
                console.error("Error fetching menu item:", error_4);
                return [2 /*return*/, res.status(500).json({ message: "Error fetching menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getMenuItemById = getMenuItemById;
// Add a new menu item to the system
var addMenuItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, price, image, category, restaurantId, dietary, hasARPreview, db, newMenuItem, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description, price = _a.price, image = _a.image, category = _a.category, restaurantId = _a.restaurantId, dietary = _a.dietary, hasARPreview = _a.hasARPreview;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _b.sent();
                newMenuItem = {
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
                return [4 /*yield*/, db.collection("menus").insertOne(newMenuItem)];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId })];
            case 4:
                error_5 = _b.sent();
                console.error("Error adding menu item:", error_5);
                return [2 /*return*/, res.status(500).json({ message: "Error adding menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addMenuItem = addMenuItem;
// Add a new menu item to a specific restaurant by its ID
var addMenuItemToRestaurant = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, description, price, image, category, dietary, hasARPreview, db, newMenuItem, result, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, description = _a.description, price = _a.price, image = _a.image, category = _a.category, dietary = _a.dietary, hasARPreview = _a.hasARPreview;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _b.sent();
                newMenuItem = {
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
                return [4 /*yield*/, db.collection("menus").insertOne(newMenuItem)];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId })];
            case 4:
                error_6 = _b.sent();
                console.error("Error adding menu item:", error_6);
                return [2 /*return*/, res.status(500).json({ message: "Error adding menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addMenuItemToRestaurant = addMenuItemToRestaurant;
// Update an existing menu item
var updateMenuItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, description, price, image, category, dietary, hasARPreview, db, updateFields, result, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, description = _a.description, price = _a.price, image = _a.image, category = _a.category, dietary = _a.dietary, hasARPreview = _a.hasARPreview;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _b.sent();
                updateFields = {};
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
                return [4 /*yield*/, db.collection("menus").updateOne({ _id: new mongodb_1.ObjectId(id) }, // Find the menu item by ID
                    { $set: updateFields } // Update only the specified fields
                    )];
            case 3:
                result = _b.sent();
                if (result.matchedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Menu item not found" })];
                }
                return [2 /*return*/, res.status(200).json({ message: "Menu item updated successfully" })];
            case 4:
                error_7 = _b.sent();
                console.error("Error updating menu item:", error_7);
                return [2 /*return*/, res.status(500).json({ message: "Error updating menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateMenuItem = updateMenuItem;

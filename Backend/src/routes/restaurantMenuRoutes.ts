import { Router, Request, Response } from 'express';
import {
  getRestaurantWithMenu,
  getAllRestaurantsWithMenus,
} from '../controllers/restaurantmenuController';
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuItemController';

const router = Router();

// Route: GET /api/restaurants to get all restaurants with their menu items
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllRestaurantsWithMenus(req, res); // Call the controller function
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: GET /api/restaurants/:id to get a specific restaurant by ID with its menu items
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await getRestaurantWithMenu(req, res); // Call the controller function
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: POST /api/menus to create a new menu item
router.post("/menus", async (req: Request, res: Response): Promise<void> => {
  try {
    await createMenuItem(req, res); // Handle creating menu item
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item' });
  }
});

// Route: PUT /api/menus/:id to update a menu item by ID
router.put("/menus/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await updateMenuItem(req, res); // Handle updating menu item
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

// Route: DELETE /api/menus/:id to delete a menu item by ID
router.delete("/menus/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteMenuItem(req, res); // Handle deleting menu item
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import {
  getRestaurantWithMenu,
  getAllRestaurantsWithMenus,
  addMenuItemToRestaurant,
  updateMenuItem,
  deleteMenuItem ,
  getMenuItemById
} from '../controllers/restaurantmenuController';

const router = Router();


// routes/restaurantMenuRoutes.ts

// Add this new route
router.get("/menus/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await getMenuItemById(req, res);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: 'Error fetching menu item' });
  }
});
// Get all restaurants with their menus
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllRestaurantsWithMenus(req, res);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single restaurant with its menu
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await getRestaurantWithMenu(req, res);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add menu item to specific restaurant
router.post("/:id/menus", async (req: Request, res: Response): Promise<void> => {
  try {
    await addMenuItemToRestaurant(req, res);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: 'Error creating menu item' });
  }
});

// Update menu item
router.put("/menus/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await updateMenuItem(req, res);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

// Delete menu itema
router.delete("/menus/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteMenuItem(req, res); // Call the controller function
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

export default router;
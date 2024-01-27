import { Router } from "express";
import {
  addStocksToFavouriteController,
  deleteStockFromFavouriteController,
  showAllFavourtiesController,
} from "../controller/favourite.controller.js";

const router = Router();

// GET ROUTE TO SHOW ALL FAVOURITES ROUTES
router.get("/", showAllFavourtiesController);

// POST ROUTE TO ADD A STOCK TO FAVOURTIES
router.post("/", addStocksToFavouriteController);

// DELETE ROUTE TO REMOVE A STOCK FROM FAVOURTIES
router.delete("/", deleteStockFromFavouriteController);

export default router;

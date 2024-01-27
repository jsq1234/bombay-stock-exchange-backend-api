import { Router } from "express";
import {
  getStockController,
  getAllStocksHistoryController,
  getStockHistoryController,
  getTopKStocksController,
} from "../controller/stock.controller.js";

const router = Router();

// GET ROUTE TO FIND TOP K STOCKS (PUT 10 FOR TOP 10)
router.get("/top/:k", getTopKStocksController);
// GET ROUTE TO FIND STOCKS BY NAME
router.get("/:stock_name", getStockController);
// GET ROUTE TO GET ALL STOCKS
router.get("/", getAllStocksHistoryController);
// GET ROUTE TO GET A STOCK HISTORY
router.get("/hist/:stock_code", getStockHistoryController);

export default router;

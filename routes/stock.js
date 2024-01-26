import { Router } from "express";
import { getStockController } from "../controller/stock.controller.js";

const router = Router();

router.get("/:stock_name", getStockController);

export default router;

import { serverLog } from "../config/loggerConfig.js";
import { serverCache } from "../middleware/cache.middleware.js";
import {
  getAllStocksHistory,
  getStockHistory,
  getStocksByName,
  getTopStocks,
} from "../services/stocks.service.js";

export async function getStockController(req, res) {
  try {
    const { stock_name } = req.params;
    const results = await getStocksByName(stock_name);

    if (results.length === 0) {
      return res.status(404).json({ error: `${stock_name} doesn't exist.` });
    }

    return res.json({ message: results });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Interval server error." });
  }
}

export async function getAllStocksHistoryController(req, res) {
  try {
    const results = await getAllStocksHistory();

    if (results.length === 0) {
      return res.status(404).json({ error: "No stocks to show" });
    }
    return res.json({ message: results });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function getStockHistoryController(req, res) {
  try {
    const { stock_code } = req.params;

    const results = await getStockHistory(stock_code);

    if (results.length === 0) {
      return res.status(404).json({ error: `${stock_code} doesn't exist.` });
    }

    return res.json({ message: results });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function getTopKStocksController(req, res) {
  try {
    const { k } = req.params;

    if (isNaN(k) || !Number.isInteger(Number(k)) || k < 0) {
      return res
        .status(400)
        .json({ error: "Invalid value for k. Must be an positive integer" });
    }

    const results = await getTopStocks(k);

    if (results.length === 0) {
      return res.status(404).json({ error: "No stocks found." });
    }

    return res.json({ message: results });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

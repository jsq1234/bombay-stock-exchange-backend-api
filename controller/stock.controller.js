import { serverLog } from "../config/loggerConfig.js";
import {
  getAllStocksHistory,
  getStockHistory,
  getStocksByName,
} from "../services/stock.service.js";

export async function getStockController(req, res) {
  try {
    const { stock_name } = req.params;

    const results = await getStocksByName(stock_name);

    if (results.length === 0) {
      return res.status(404).send(`${stock_name} doesn't exist.`);
    }
    return res.send(results);
  } catch (error) {
    serverLog.error(error);
    return res.status(500).send("Interval server error.");
  }
}

export async function getAllStocksHistoryController(req, res) {
  try {
    const results = await getAllStocksHistory();
    if (results.length == 0) {
      return res.status(404).send("No stocks to show");
    }
    return res.send(results);
  } catch (error) {
    serverLog.error(error);
    return res.status(500).send("Internal server error.");
  }
}

export async function getStockHistoryController(req, res) {
  try {
    const { stock_code } = req.params;
    const results = await getStockHistory(stock_code);
    if (results.length == 0) {
      return res.status(404).send(`${stock_code} doesn't exist.`);
    }
    return res.send(results);
  } catch (error) {
    serverLog.error(error);
    return res.status(500).send("Internal server error.");
  }
}

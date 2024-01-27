import { serverLog } from "../config/loggerConfig.js";
import {
  addStockToFavourites,
  deleteFromFavourites,
  getAllFavourtiesStocks,
} from "../services/favourite.service.js";

export async function addStocksToFavouriteController(req, res) {
  try {
    const { stock_name } = req.body;

    if (!stock_name) {
      return res.status(400).send({
        error: "stock_name required in request body.",
      });
    }
    const result = await addStockToFavourites(stock_name);
    console.log(result);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: `${stock_name} doesn't exist in db.` });
    }

    return res.json({
      message: `Added ${stock_name} to favourities.`,
    });
  } catch (error) {
    if (error.name === "PostgresError") {
      //console.log(error);
      if (error.message.includes("duplicate")) {
        return res.status(409).json({ error: `Already exists in favourites.` });
      }
    }
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function showAllFavourtiesController(req, res) {
  try {
    const result = await getAllFavourtiesStocks();
    if (result.length === 0) {
      return res.status(400).json({ error: "No stocks in favourites." });
    }
    return res.json({ message: result });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function deleteStockFromFavouriteController(req, res) {
  try {
    const { stock_name } = req.params;
    const result = await deleteFromFavourites(stock_name);
    if (result.length === 0) {
      return res.status(400).json({ error: "No stocks in favourites." });
    }
    return res.json({ error: `deleted ${stock_name} from favourites` });
  } catch (error) {
    serverLog.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

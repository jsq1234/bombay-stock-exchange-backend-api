import { Router } from "express";
import sql from "../config/dbConfig.js";
import { dbLog } from "../config/loggerConfig.js";
import { convertStockRecords } from "../utils/index.js";

const router = Router();

router.get("/:stock_name", async (req, res) => {
  const { stock_name } = req.params;

  async function getStock(stock_name) {
    const profiler = dbLog.startTimer();
    const db_results = await sql`
        SELECT * FROM stock_exchange where sc_name = ${stock_name}
    `;
    profiler.done({ message: db_results.command });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  }

  const results = await getStock(stock_name);
  return res.send(results);
});

export default router;

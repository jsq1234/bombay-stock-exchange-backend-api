import sql from "../config/dbConfig.js";
import { dbLog } from "../config/loggerConfig.js";
import { convertStockRecords, executeQuery } from "../utils/index.js";

export async function getStocksByName(stock_name) {
  try {
    const db_results = await executeQuery(() => {
      return sql`SELECT * FROM stock_exchange where sc_name = ${stock_name}`;
    });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

export async function getAllStocksHistory() {
  try {
    const db_results = await executeQuery(() => {
      return sql`SELECT * FROM stock_exchange ORDER BY date desc`;
    });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

export async function getStockHistory(stock_code) {
  try {
    const db_results = await executeQuery(() => {
      return sql`SELECT * FROM stock_exchange where sc_code = ${stock_code} order by date desc`;
    });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

// export async function getTopStocks(k){
//     try{

//     }
// }

import sql from "../config/dbConfig.js";
import { dbLog } from "../config/loggerConfig.js";
import { convertStockRecords, executeQuery } from "../utils/index.js";

export async function getStocksByName(stock_name) {
  try {
    const db_results = await executeQuery(() => {
      return sql`
        select stock_info.sc_name, stock_info.sc_code, se.* from stock_exchange se
        join stock_info on se.sc_id = stock_info.id
        where stock_info.sc_name = ${stock_name}
      `;
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
      return sql`
        select stock_info.sc_name, stock_info.sc_code, se.* from stock_exchange se
        join stock_info on stock_info.id = se.sc_id
      `;
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
      return sql`
        select stock_info.sc_name, stock_info.sc_code, se.* from stock_exchange se
        join stock_info on stock_info.id = se.sc_id
        where stock_info.sc_code = ${stock_code}
        order by se.date desc;
      `;
    });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

export async function getTopStocks(k) {
  try {
    const db_results = await executeQuery(() => {
      return sql`
        select stock_info.sc_name, stock_info.sc_code, se.* from stock_exchange se
        join stock_info on stock_info.id = se.sc_id
        order by se.net_turnov desc
        limit ${k}
      `;
    });
    const results = db_results.map((row) => convertStockRecords(row));
    return results;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

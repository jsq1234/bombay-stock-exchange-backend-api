import sql from "../config/dbConfig.js";
import { dbLog } from "../config/loggerConfig.js";

export async function addStockToFavourites(stock_name) {
  try {
    const profiler = dbLog.startTimer();
    const result = await sql`
      insert into favourties(sc_id) ( select id from stock_info where sc_name = ${stock_name}) returning *;
    `;
    profiler.done({ message: `${result.command} favourites` });
    return result;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

export async function getAllFavourtiesStocks() {
  try {
    const profiler = dbLog.startTimer();
    const result = await sql`
      select inf.sc_code, inf.sc_name from stock_info inf
      join favourties fv 
      on fv.sc_id = inf.id
    `;
    profiler.done({ message: `${result.command} stock_exchange` });
    return result;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

export async function deleteFromFavourites(stock_name) {
  try {
    const profiler = dbLog.startTimer();
    const result = await sql`
      delete from favourties where sc_id in 
      (
        select inf.id from stock_info inf
        join stock_exchange se
        on inf.id = se.sc_id
        where inf.sc_name = ${stock_name}
      ) returning *;
    `;
    profiler.done({ message: `${result.command} favourties` });
    return result;
  } catch (error) {
    dbLog.error(error);
    throw error;
  }
}

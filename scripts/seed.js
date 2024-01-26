import sql from "../config/dbConfig.js";
import { dbLog, serverLog } from "../config/loggerConfig.js";
import { trackExecutionTime } from "../utils/index.js";
import { extractFilesFromFolder } from "./extract.js";

export async function createStockExchangeTable() {
  dbLog.info("Creating table stock_exchange");
  await sql`
        CREATE TABLE IF NOT EXISTS stock_exchange(
            DATE DATE,
            SC_CODE INTEGER,
            SC_NAME VARCHAR(20),
            OPEN NUMERIC(20,3),
            HIGH NUMERIC(20,3),
            LOW NUMERIC(20,3),
            CLOSE NUMERIC(20,3),
            LAST NUMERIC(20,3),
            PREVCLOSE NUMERIC(20,3),
            NO_TRADES INTEGER,
            NO_OF_SHRS INTEGER,
            NET_TURNOV NUMERIC(20,3),
            PRIMARY KEY (SC_CODE,DATE)
        )
    `;
  dbLog.info("Created table stock_exchange");
}

export async function createFavouriteTable() {
  const profiler = dbLog.startTimer();
  const results = await sql`
      CREATE TABLE IF NOT EXISTS favourites(
        ID SERIAL PRIMARY KEY,
        SC_CODE INTEGER,
        DATE DATE,
        FOREIGN KEY (SC_CODE, DATE) REFERENCES stock_exchange(SC_CODE,DATE)
      )
    `;
  profiler.done({
    message: `[${results.command}] : Created table favorites`,
  });
}

export async function insertValuesIntoStockExchange(result) {
  const profiler = dbLog.startTimer();
  const results = await sql`
        INSERT INTO stock_exchange ${sql(result)}
    `;
  profiler.done({
    message: `[${results.command}] : Successfully added ${result.length} records`,
  });
}

export async function seed() {
  await createStockExchangeTable();
  await createFavouriteTable();
  const folderPath = "./Equities";
  const profiler = dbLog.startTimer();
  for await (const { fileName, result } of extractFilesFromFolder(folderPath)) {
    await insertValuesIntoStockExchange(result);
  }
  profiler.done({ message: `Inserted all documents in database` });
}

export async function dropTable() {
  const result = await sql`DROP TABLE stock_exchange`;
  return result.command;
}

(async function () {
  try {
    await seed();
  } catch (e) {
    if (e.name === "PostgresError") {
      dbLog.error(e);
    } else {
      serverLog.error(e.message);
    }
  } finally {
    /* end sql connection if calling npm run migrate */
    await sql.end();
  }
})();

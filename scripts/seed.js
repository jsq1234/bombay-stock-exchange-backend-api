import sql from "../config/dbConfig.js";
import { dbLog, serverLog } from "../config/loggerConfig.js";
import { extractFilesFromFolder } from "./extract.js";
import { executeQuery } from "../utils/index.js";

export async function createStockInfoTable() {
  dbLog.info("Creating table stock_info");
  await sql`
  create table if not exists stock_info(
    id serial primary key,
    sc_code integer not null,
    sc_name varchar(25) not null,
    constraint unique_sc_code_name_pair unique (sc_code, sc_name)
    )
  `;
  dbLog.info("Created table stock_info");
}

export async function createStockExchangeTable() {
  dbLog.info("Creating table stock_exchange");
  await sql`
          CREATE TABLE IF NOT EXISTS stock_exchange(
              DATE DATE,
              SC_ID INTEGER REFERENCES stock_info(id),
              OPEN NUMERIC(20,3),
              HIGH NUMERIC(20,3),
              LOW NUMERIC(20,3),
              CLOSE NUMERIC(20,3),
              LAST NUMERIC(20,3),
              PREVCLOSE NUMERIC(20,3),
              NO_TRADES INTEGER,
              NO_OF_SHRS INTEGER,
              NET_TURNOV NUMERIC(20,3),
              PRIMARY KEY (SC_ID,DATE)
          )
      `;
  dbLog.info("Created table stock_exchange");
}

export async function createFavouritesTable() {
  dbLog.info("Creating table favourites");
  await sql`
    create table if not exists favourties(
        id serial primary key,
        sc_id integer references stock_info(id),
        constraint unique_sc_id unique(sc_id)
      )`;
  dbLog.info("Created table favourties");
}

async function insertValuesIntoStockInfo(data) {
  await executeQuery(() => {
    return sql`
            insert into stock_info ${sql(
              data,
              "sc_code",
              "sc_name"
            )} on conflict do nothing
        `;
  });
}

async function insertValuesIntoStockExchange(data) {
  const dataArr = data.map((d) => [d.sc_name, d.sc_code]);
  const result = await sql`
        with temp_t (sc_name, sc_code) as ( values ${sql(
          dataArr
        )} ) select stock_info.id, temp_t.sc_name, temp_t.sc_code::int from temp_t left join stock_info on temp_t.sc_name = stock_info.sc_name and temp_t.sc_code::int = stock_info.sc_code
        `;
  const transformedData = data.map((d, i) => {
    delete d.sc_name;
    delete d.sc_code;
    d.sc_id = result[i].id;
    return d;
  });

  const profiler = dbLog.startTimer();
  const results = await sql`
        INSERT INTO stock_exchange ${sql(
          transformedData
        )} on conflict do nothing
    `;
  profiler.done({
    message: `[${results.command}] : Successfully added ${result.length} records`,
  });
}

async function seed() {
  await createStockInfoTable();
  await createStockExchangeTable();
  await createFavouritesTable();
  const folderPath = "./Equities";

  const profiler = dbLog.startTimer();
  for await (const { filename, result } of extractFilesFromFolder(folderPath)) {
    await insertValuesIntoStockInfo(result);
  }

  for await (const { filename, result } of extractFilesFromFolder(folderPath)) {
    await insertValuesIntoStockExchange(result);
  }

  profiler.done({ message: `Inserted all documents in database` });
}
(async () => {
  try {
    await seed();
  } catch (e) {
    if (e.name === "PostgresError") {
      dbLog.error(e);
    } else {
      serverLog.error(e);
    }
  } finally {
    await sql.end();
  }
})();

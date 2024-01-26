import postgres from "postgres";
import { config } from "dotenv";
import { dbLog, serverLog } from "./loggerConfig.js";

config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://manan@localhost:5432/stock_exchange";

serverLog.info("Connecting to postgres database...");
// const sql = postgres(connectionString, options);
const sql = postgres(
  connectionString,
  process.env.DATABASE_URL
    ? {
        ssl: "require",
        onnotice: (notice) => {
          dbLog.info(notice);
        },
      }
    : {
        onnotice: (notice) => {
          dbLog.info(notice);
        },
      }
);

serverLog.info("Connected");

export default sql;

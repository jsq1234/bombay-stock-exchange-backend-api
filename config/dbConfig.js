import postgres from "postgres";
import { config } from "dotenv";
import { dbLog, serverLog } from "./loggerConfig.js";

config();

const { DATABASE_URL } = process.env;

const connectionString =
  DATABASE_URL || "postgresql://manan@localhost:5432/sample_db_v2";

serverLog.info("Connecting to postgres database...");

const sql = postgres(
  connectionString,
  DATABASE_URL
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

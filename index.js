import app from "./config/serverConfig.js";
import { serverLog } from "./config/loggerConfig.js";
import fs from "fs";
import { downloadEquities } from "./scripts/download.js";

const port = 3000;

app.listen(port, async () => {
  serverLog.info(`Server listening on port ${port}`);
  try{
    if (!fs.existsSync("./Equities")) {
      serverLog.info("Couldn't find equities folder, downloading....");
      await downloadEquities();
      await seed();
    }
  }
});

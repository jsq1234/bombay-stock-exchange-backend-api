import app from "./config/serverConfig.js";
import { serverLog } from "./config/loggerConfig.js";

const port = 3000;

app.listen(port, () => {
  serverLog.info(`Server listening on port ${port}`);
});

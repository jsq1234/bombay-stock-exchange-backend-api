import express from "express";
import { requestsLogMiddleware } from "../middleware/requestLogger.js";
import stockRoutes from "../routes/stock.js";

const app = express();

//  requestLogMiddlware logs the requests to console
//  and the time it took for them to process.
app.use(requestsLogMiddleware);

// HTTP routes here
app.use("/stock", stockRoutes);

export default app;

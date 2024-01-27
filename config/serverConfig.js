import express from "express";
import { requestsLogMiddleware } from "../middleware/requestLogger.js";
import stockRoutes from "../routes/stock.js";
import favouriteRoutes from "../routes/favourites.js";

const app = express();

//  requestLogMiddlware logs the requests to console
//  and the time it took for them to process.
app.use(requestsLogMiddleware);
app.use(express.json());

// HTTP routes here
app.use("/stocks", stockRoutes);
app.use("/favourites", favouriteRoutes);

export default app;

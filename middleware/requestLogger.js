import { serverLog } from "../config/loggerConfig.js";

export function requestsLogMiddleware(req, res, next) {
  const startTime = new Date();
  res.on("finish", () => {
    const endTime = new Date();
    const elapsedTime = endTime - startTime;
    const duration =
      elapsedTime >= 1000
        ? (elapsedTime / 1000).toString() + "s"
        : elapsedTime.toString() + "ms";
    serverLog.info(
      `${req.ip}: [${req.method}] ${req.originalUrl} - ${res.statusCode} ${res.statusMessage} [${duration}]`
    );
  });
  next();
}

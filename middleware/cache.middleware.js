import { Cache } from "memory-cache";
import { serverLog } from "../config/loggerConfig.js";
export const serverCache = new Cache();

export function cacheMiddleware(req, res, next) {
  const key = `${req.originalUrl}__${req.method}`;
  //   console.log(key);
  const cachedData = serverCache.get(key);
  if (cachedData) {
    serverLog.info(`${req.originalUrl} found in cache.`);
    return res.json(cachedData);
  }

  /*
    if cache is not set, we make res.json run our own function
    that automatically caches the response and sends it.
  */

  const originalJson = res.json;

  res.json = function (data) {
    serverLog.info(`Caching ${req.originalUrl}`);
    serverCache.put(key, data, 1000 * 60 * 60);
    originalJson.call(this, data);
  };
  next();
}

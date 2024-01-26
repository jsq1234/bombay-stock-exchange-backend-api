import winston, { format, createLogger } from "winston";
const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp, durationMs }) => {
  if (durationMs) {
    const duration =
      durationMs >= 1000
        ? (durationMs / 1000).toString() + "s"
        : durationMs.toString() + "ms";
    return `${timestamp} [${label}] ${level} : ${message} [${duration}]`;
  }
  return `${timestamp} [${label}] ${level} : ${message}`;
});

export const serverLog = createLogger({
  format: combine(
    label({ label: "bse-server" }),
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});

export const dbLog = createLogger({
  format: combine(
    label({ label: "postgres-db" }),
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});

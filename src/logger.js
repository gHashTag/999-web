import winston from "winston";
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename:
        process.env.NODE_ENV === "development"
          ? "app.log"
          : "/var/log/NEXT_APP/app.log",
    }),
  ],
});

export { logger };

const createLog = (level, event, details = {}) => {
  if (!event || typeof event !== "string") {
    throw new Error("Logger event name is required");
  }

  return {
    level,
    event,
    ...details,
    timestamp: new Date().toISOString(),
  };
};

export const logInfo = (event, details = {}) => {
  console.log(
    JSON.stringify(
      createLog("info", event, details)
    )
  );
};

export const logWarn = (event, details = {}) => {
  console.warn(
    JSON.stringify(
      createLog("warn", event, details)
    )
  );
};

export const logError = (event, details = {}) => {
  console.error(
    JSON.stringify(
      createLog("error", event, details)
    )
  );
};

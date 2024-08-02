export enum LogType {
  ERROR = "ERROR",
  INFO = "",
}

export function log(type: LogType, message: string) {
  if (type == LogType.ERROR) console.log(`[VSLC] | ${type}: ${message}`);
  else console.log(`[VSLC] | ${message}`);
}

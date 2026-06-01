export function debugLog(scope, message, payload) {
  const debugEnabled =
    typeof window !== "undefined" && window.localStorage?.getItem("jatekv2:debug") === "1";

  if (!debugEnabled) {
    return;
  }

  if (payload === undefined) {
    console.info(`[jatekv2][${scope}] ${message}`);
    return;
  }

  console.info(`[jatekv2][${scope}] ${message}`, payload);
}

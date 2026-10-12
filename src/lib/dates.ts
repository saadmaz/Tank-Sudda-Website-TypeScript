/** Today's date (YYYY-MM-DD) in Sri Lanka, regardless of the server's time zone. */
export function todayInSriLanka(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

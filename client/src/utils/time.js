/**
 * Converts a 12-hour time string (e.g. "9:00 AM", "10:30 PM") to minutes since midnight.
 * Used for sorting shows chronologically when time is stored as a free-text string.
 */
export const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.trim().toUpperCase().split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
};

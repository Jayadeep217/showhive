function formatLocalTimestamp(date = new Date(), options = {}) {
  const { utc = false } = options;

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Invalid Date object");
  }

  const pad = (num, size = 2) => String(num).padStart(size, "0");

  const get = (method) =>
    utc ? date[`getUTC${method}`]() : date[`get${method}`]();

  const day = pad(get("Date"));
  const month = pad(get("Month") + 1);
  const year = get("FullYear");

  const hours = pad(get("Hours"));
  const minutes = pad(get("Minutes"));
  const seconds = pad(get("Seconds"));
  const milliseconds = pad(get("Milliseconds"), 3);

  return `${year}/${month}/${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

module.exports = { formatLocalTimestamp };

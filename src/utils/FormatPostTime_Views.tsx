const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "always",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

// -------- VIDEO CREATED-AT TIME FORMATTER ----------
export function FormatPostTime(date: Date): string {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(
        Math.round(duration),
        division.name as Intl.RelativeTimeFormatUnit
      );
    }
    duration /= division.amount;
  }
  return ""; // fallback, if no match found
}

// --------- VIEW + LIKE COUNT FORMATTER -----------
export const View_Like_Formatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

// --------- VIDEO DURATION FORMATTER  ---------
export function formatDuration(durationInSeconds: number): string {
  const totalSeconds = Math.floor(durationInSeconds); // Floor the seconds to get rid of decimals
  const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
  const seconds = totalSeconds % 60; // Remaining seconds

  // Pad hours, minutes, and seconds to always have two digits
  const formattedHours = hours > 0 ? String(hours).padStart(2, "0") + ":" : ""; // Add hour only if it's greater than 0
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

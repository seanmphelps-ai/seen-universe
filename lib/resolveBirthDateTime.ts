export function resolveBirthDateTime(
  birthDate: string,          // "1979-08-01"
  birthTime: string | null,   // "12:41" or null
  timezone: string            // "America/Los_Angeles"
) {
  const hasBirthTime = Boolean(birthTime && birthTime.trim() !== "");

  const dateTimeString = hasBirthTime
    ? `${birthDate}T${birthTime}`
    : `${birthDate}T12:00:00`;

  return {
    dateTime: new Date(`${dateTimeString}`), // you will improve timezone handling later
    usedNoonDefault: !hasBirthTime,
  };
}
